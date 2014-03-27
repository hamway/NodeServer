/**
 * Created by hamway on 27.03.14.
 */
var BaseController = require("./Base"),
    View = require("../views/Base");
module.exports = BaseController.extend({
    name: "Status",
    status: {},
    run: function(req, res, next) {
        var self = this;
        this.getStatus('raw', function() {
            var v = new View(res, 'status');

            v.render({
                title: 'Status server',
                status: self.status
            });
        })

    },
    getStatus: function(type, callback) {
        var output = {
            'Hostname': os.hostname(),
            'Type': os.type(),
            'Platform': os.platform(),
            'Arch': os.arch(),
            'Endianness': os.endianness(),
            'Release': os.release(),
            'Uptime': os.uptime(),
            'Load Average': os.loadavg(),
            'Totoal Memory': os.totalmem(),
            'Free Memory': os.freemem(),
            'Cpus': os.cpus(),
            'Network': os.networkInterfaces()
        }
        var res = {}
        if (type == "json") {
            res = JSON.stringify(output);
        } else if (type == "raw") {
            res = objectToString(output);
        } else {
            res = 'Unknown type';
        }
        this.status = res;
        callback();
    }
});