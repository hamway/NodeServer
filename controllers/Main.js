var BaseController = require("./Base"),
    View = require("../views/Base"),
    request = require('request'),
    redis = require('redis').createClient(),
    config = require('../config')();

module.exports = BaseController.extend({
    name: "Main",
    init: function(req, res, next) {
        if (req.cookies.user_id != undefined) req.session.user_id = req.cookies.user_id;
        if (!req.session.user_id) res.redirect(301, '/');
    },
    run: function(req, res, next) {
        if (req.cookies.user_id != undefined) req.session.user_id = req.cookies.user_id;
        if (!req.session.user_id) res.redirect(301, '/');

        this.getProjects(req, res, function(projects){
            var v = new View(res, 'main/index');

            v.render({
                layout: 'mainLayout',
                title: 'Small Api Server',
                projects: projects,
                projectId: null
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

                req.session.user_token = result.private_token;
                request.get(config.api +'/projects?private_token=' + result.private_token, function (err, response, body) {
                    body = JSON.parse(body);

                    var projects = {};

                    for(var key in body) {
                        var project = body[key],
                            level = (project.public == true) ? 'public' :
                            (project.visibility_level == 0) ? 'private' : 'internal';

                        projects[key] = {
                            id: project.id,
                            name: project.name,
                            url: project.web_url,
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
    runProject: function(req, res, next) {
        if (req.cookies.user_id != undefined) req.session.user_id = req.cookies.user_id;
        if (!req.session.user_id) res.redirect(301, '/');

        var self = this;
        this.getProjects(req, res, function(projects){
            self.showProject(req, res, req.params.id, projects);
        });
    },
    showProject: function(req, res, projectId, projects) {

        var v = new View(res, 'main/project');

        request.get(config.api + '/projects/' + projectId + '/issues?private_token=' + req.session.user_token, function(err, response, body) {
            var user_id = req.session.user_id;
            redis.set('user:' + user_id + ':project:' + projectId + ':issues', body);

            v.render({
                layout: 'mainLayout',
                title: 'Small Api Server',
                projects: projects,
                projectId: projectId,
                issues: JSON.parse(body)
            });
        })
    },
    runProfile: function(req, res, next) {
        this.init(req, res, next);

        var user_id = req.session.user_id;
        this.getProjects(req, res, function(projects){
            redis.get('user:' + user_id, function(err, result) {
                var v = new View(res, 'main/profile');

                v.render({
                    layout: 'mainLayout',
                    title: 'Small Api Server',
                    projects: projects,
                    projectId: null,
                    user: JSON.parse(result)
                });
            });
        });
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