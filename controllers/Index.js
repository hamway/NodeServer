/**
 * Created by hamway on 30.03.14.
 */
var BaseController = require("./Base"),
    View = require("../views/Base"),
    os = require('os');

module.exports = BaseController.extend({
    name: "Status",
    run: function(req, res, next) {
        var v = new View(res, 'index/index');
        v.render({
            title: 'Small Api Server'
        });
    }
});