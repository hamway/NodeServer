var app = require('app');
var redis = require('redis');
var http = require('http');

exports.timer = [];
exports.client;
exports.options = {};

exports.start = function () {
    var config = app.config;
    var redis_conf = config.redis;
    var stats_conf = config.stats;
    var period = stats_conf.period.split('|');

    this.client = redis.createClient(
        redis_conf.port,
        redis_conf.host,
        {
            max_attempts: redis_conf.max_attempts || 5
        }
    );

    this.client.on('error', function(err) {
        console.log('REDIS:');
        console.log(err);
    });

    this.client.select(redis_conf.database,function(){});

    this.options = {
        hostname: config.http.host,
        port: config.http.port,
        path: '/status?json',
        method: 'GET'
    };

    for (var key in period) {
        if (period[key] != undefined)
            this.createTimer(period[key]);
    }
};

exports.createTimer = function (interval) {
    var delay = this.seconds(interval);

    var Iid = setInterval(function(client, timer, options){
        var req = http.request(options, function(res) {
            if(res.statusCode == 200) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    var date = new Date();
                    var day = (date.getDate() <10) ? '0'+date.getDate() : date.getDate();
                    var month = (date.getMonth() <10) ? '0'+date.getMonth() : date.getMonth();
                    var month_Key = 'date:' + month +':'+ date.getFullYear();
                    client.exists(month_Key,function(err,isExists){
                        if (!isExists) client.sadd(month_Key,day);
                        else {
                            client.sismember(month_Key,day,function(err, ismem){
                                if(!ismem) {
                                    client.sadd(month_Key,day);
                                }
                            })
                        }
                    });
                    var info = JSON.parse(chunk);
                    var key = 'stat:'+interval+':' + new Date().getTime() +':' + info.Hostname;
                    client.set(key,chunk);
                });
            }
        });
        req.write('data\n');
        req.end();

    }, delay,this.client,this.timer, this.options);

    this.timer.push(Iid);
};

exports.shedule = function () {

}

exports.seconds = function(min) {
    return min*5*1000;
}