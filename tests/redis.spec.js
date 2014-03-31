/**
 * Created by hamway on 31.03.14.
 */


describe("RedisDB", function() {
    it("is there a server running", function(next) {
        var RedisClient = require('redis').createClient();
        RedisClient.on('error', function(err) {
            expect(err).toBe(null);
            next();
        });

        RedisClient.on('connect', function(err){
            expect(err).toBe(null);
            next();
        });

        RedisClient.end();
        next();
    });
});