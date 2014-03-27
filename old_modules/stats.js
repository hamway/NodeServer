exports.getStatus = function (type) {
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
    return res;
}