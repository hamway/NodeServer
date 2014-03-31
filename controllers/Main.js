var BaseController = require("./Base"),
    View = require("../views/Base"),
    request = require('request'),
    redis = require('redis').createClient();

module.exports = BaseController.extend({
    name: "Main",
    run: function(req, res, next) {

        if (!req.session.user_id) res.redirect(301, '/');

        this.getProjects(req.session.user_id, function(projects){
            var v = new View(res, 'main/index');

            v.render({
                layout: 'mainLayout',
                title: 'Small Api Server',
                projects: projects
            });
        });
    },
    getProjects: function(user_id, callback) {
        if (user_id != undefined) {
            redis.get('user:' + user_id, function (err, result) {
                result = JSON.parse(result);
                request.get('http://git.7gw.ru/api/v3/projects?private_token=' + result.private_token, function (err, response, body) {
                    body = JSON.parse(body);

                    var projects = {};

                    for(var key in body) {
                        var project = body[key];

                        projects[key] = {
                            id: project.id,
                            name: project.name
                        };

                        redis.set('user:' + user_id + ':project:' + project.id, JSON.stringify(project));
                    }
                    projects.length = key;

                    callback(projects);
                })
            });
        }
    }
});