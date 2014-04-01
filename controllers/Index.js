/**
 * Created by hamway on 30.03.14.
 */
var BaseController = require("./Base"),
    View = require("../views/Base"),
    request = require('request'),
    redis = require('redis').createClient();

module.exports = BaseController.extend({
    name: "Index",
    request: {},
    response: {},
    run: function(req, res, next) {

        if (req.cookies.user_id != undefined) {
            req.session.user_id = req.cookies.user_id;
        }

        if(req.session.user_id != undefined) {
            res.redirect(301, '/main');
        }

        this.request = req;
        this.response = res;
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

            request.post('http://git.7gw.ru/api/v3/session', function(err, response, body) {
                if (err) return console.error(err);

                body = JSON.parse(body);

                if (body.id) {
                    self.saveUser(body);
                } else {
                    this.renderView(self.request, self.response);
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
    saveUser: function(user) {
        if (this.request.body.remember != undefined && this.request.body.remember == 'on') {
            this.request.cookies.user_id = user.id;
        }

        this.request.session.user_id = user.id;
        redis.set('user:' + user.id, JSON.stringify(user));

        if (!this.request.cookie.user_id) {
            redis.expire('user:' + user.id, 3600*24);
        }

        this.response.redirect(301, '/main');

    }
});