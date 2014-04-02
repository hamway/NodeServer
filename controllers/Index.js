/**
 * Created by hamway on 30.03.14.
 */
var BaseController = require("./Base"),
    View = require("../views/Base"),
    request = require('request'),
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

        this.setDB(req.db, ['users']);

        /*this.model('users').selectAll(function(err, result){
            console.log(result);
        });*/

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
                    self.model('users').select(body.id, function(err, result){
                        if (result.length == 0) {
                            self.model('users').insert(body);
                        } else if (result.length == 1) {
                            self.model('users').update(body)
                        } else {
                            self.model('users').flushDuplicate(body);
                        }

                        self.saveUser(req, res, body);
                    });
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

        if (req.body.remember != undefined && req.body.remember == 'on') {
            res.cookie('user_id',user.id, {path: '/', httpOnly: true});
        }
        res.redirect(301, '/main');
    }
});