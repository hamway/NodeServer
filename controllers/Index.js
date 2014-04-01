/**
 * Created by hamway on 30.03.14.
 */
var BaseController = require("./Base"),
    View = require("../views/Base"),
    request = require('request'),
    redis = require('redis').createClient(),
    config = require('../config')();

module.exports = BaseController.extend({
    name: "Index",
    run: function(req, res, next) {
        if (req.cookies.user_id != undefined) {
            req.session.user_id = req.cookies.user_id;
        }

        if (req.session.user_id != undefined) {
            res.redirect(301, '/main');
        }

        var post = req.body;

        if (post.login != undefined && post.password != undefined) {
            var isEmail = (post.login.search("@") != -1);

            var data = {password: post.password};

            if (isEmail) {
                data.email = post.login;
            } else {
                data.login = post.login;
            }

            var self = this;
            request.post(config.api + '/session', function(err, response, body) {
                if (err) return console.error(err);

                body = JSON.parse(body);

                if (body.id) {
                    self.saveUser(req, res, body);
                } else {
                    self.renderView(req, res);
                }
            }).form(data);
        } else {
            this.renderView(req, res);
        }
    },
    renderView: function(req, res) {
        var v = new View(res, 'index/index');
        v.render({
            title: 'Small Api Server'
        });
    },
    saveUser: function(req, res, user) {
        req.session.user_id = user.id;
        redis.set('user:' + user.id, JSON.stringify(user));

        if (req.body.remember != undefined && req.body.remember == 'on') {
            res.cookie('user_id',user.id, {path: '/', httpOnly: true});
        } else {
            redis.expire('user:' + user.id, 3600*24);
        }
        res.redirect(301, '/main');
    }
});