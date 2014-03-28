/**
 * Created by hamway on 27.03.14.
 */
var BaseController = require("./Base"),
    View = require("../views/Base"),
    os = require('os');

module.exports = BaseController.extend({
    name: "Status",
    run: function(req, res, next) {
        var v = new View(res, 'status/index');
        v.render({
            title: 'Status server',
            status: this.getStatus('json'),
            statusRaw: this.getStatus('raw')
        });
    },
    runJson: function(req, res, next) {
        res.contentType('application/json');
        res.send(this.getStatus('json'));
    },
    runError: function(req, res, next) {
        var v = new View(res, 'status/error');
        v.render({
            title: 'Status server',
            error: '404 Page not Found'
        });
    },
    getStatus: function(type) {
        var output = {
            'Hostname': os.hostname(),
            'Type': os.type(),
            'Platform': os.platform(),
            'Arch': os.arch(),
            'Endianness': os.endianness(),
            'Release': os.release(),
            'Uptime': os.uptime(),
            'Load_Average': os.loadavg(),
            'Total_Memory': os.totalmem(),
            'Free_Memory': os.freemem(),
            'Cpus': os.cpus(),
            'Network': os.networkInterfaces()
        }
        var res = {}
        if (type == "json") {
            res = JSON.stringify(output);
        } else if (type == "raw") {
            res = this.objectToString(output);
        } else {
            res = 'Unknown type';
        }
        return res;
    },
    objectToString: function (obj, level) {
        var res = '';
        if (level == undefined) {
            level = 0;
        } else {
            level++;
        }

        for (var key in obj) {
            var value = obj[key]

            if (level > 0) {
                var i = 0;
                for (i = 0; i < level; i++) {
                    res += '  ';
                }
            }

            if ((typeof value) != 'object') {
                res += key + ': ' + value + os.EOL;
            } else {
                res += key + ':\n'
                res += this.objectToString(value, level);
            }
        }
        return res;
    }
});
