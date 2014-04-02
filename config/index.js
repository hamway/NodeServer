var config = {
    local: {
        mode: 'local',
        port: 3000,
        db: 'mongodb://127.0.0.1:27017/sas',
        api: 'http://git.7gw.ru/api/v3'
    },
    staging: {
        mode: 'staging',
        port: 4000,
        db: 'mongodb://127.0.0.1:27017/sas',
        api: 'http://git.7gw.ru/api/v3'
    },
    production: {
        mode: 'production',
        port: 5000,
        db: 'mongodb://127.0.0.1:27017/sas',
        api: 'http://git.7gw.ru/api/v3'
    }
}
module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}