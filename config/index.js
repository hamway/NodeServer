var config = {
    local: {
        mode: 'local',
        port: 3000,
        api: 'http://git.7gw.ru/api/v3'
    },
    staging: {
        mode: 'staging',
        port: 4000
    },
    production: {
        mode: 'production',
        port: 5000
    }
}
module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}