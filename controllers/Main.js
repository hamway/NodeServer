var BaseController = require("./Base"),
    View = require("../views/Base"),
    request = require('request'),
    redis = require('redis').createClient();

module.exports = BaseController.extend({
    name: "Main",
    run: function(req, res, next) {

        if (req.cookies.user_id != undefined) req.session.user_id = req.cookies.user_id;

        if (!req.session.user_id) res.redirect(301, '/');

        this.getProjects(req, res, function(projects){
            var v = new View(res, 'main/index');

            v.render({
                layout: 'mainLayout',
                title: 'Small Api Server',
                projects: projects
            });
        });
    },
    getProjects: function(req, res, callback) {
        var user_id = req.session.user_id;
        if (user_id != undefined) {
            var self = this;
            redis.get('user:' + user_id, function (err, result) {
                if (result == null) return self.runLogout(req, res);

                result = JSON.parse(result);
                request.get('http://git.7gw.ru/api/v3/projects?private_token=' + result.private_token, function (err, response, body) {
                    body = JSON.parse(body);

                    var projects = {};

                    for(var key in body) {
                        var project = body[key],
                            level = (project.public == true) ? 'public' :
                            (project.visibility_level == 0) ? 'private' : 'internal';

                        projects[key] = {
                            id: project.id,
                            name: project.name,
                            level: level
                        };
                        redis.set('user:' + user_id + ':project:' + project.id, JSON.stringify(project));
                    }

                    projects.length = key;

                    callback(projects);
                })
            });
        }
    },
    runLogout: function(req, res, next) {
        var user_id = req.session.user_id;

        req.session.destroy();
        res.clearCookie('user_id');
        redis.keys('user:'+ user_id + '*', function(err, keys) {
            for (var index in keys)
                redis.del(keys[index],function() {});

            res.redirect(301, '/');
        });

    }
});