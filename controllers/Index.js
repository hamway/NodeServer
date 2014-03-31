/**
 * Created by hamway on 30.03.14.
 */
var BaseController = require("./Base"),
    View = require("../views/Base"),
    request = require('request');

module.exports = BaseController.extend({
    name: "Index",
    request: {},
    response: {},
    run: function(req, res, next) {

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
        this.request.session.user_id = user.id;

        require('redis').createClient().set('user:' + user.id, JSON.stringify(user));

        this.response.redirect(301, '/main');

    }
});