var _ = require("underscore");
module.exports = {
    name: "base",
    _collections: [],
    extend: function(child) {
        return _.extend({}, this, child);
    },
    run: function(req, res, next) {

    },
    setDB: function(db, collections) {
        for (var index in collections) {
            this._collections[collections[index]] = db.collection(collections[index]);
        }
    },
    model: function(name) {
        var model = this._collections[name];
        return {
            selectAll: function(callback) {
                model.find().toArray(callback || function(){});
            },
            select: function(id, callback) {
                model.find({id:id}).toArray(callback || function(){});
            },
            insert: function(data, callback) {
                model.insert(data, {}, callback || function(){});
            },
            update: function(data, callback) {
                model.update({id:data.id}, data, {}, callback || function(){});
            },
            remove: function(id, callback) {
                model.findAndModify({id: id}, [], {}, {remove: true}, callback || function(){});
            },
            flushDuplicate: function(data, callback) {
                var self = this;
                this.remove(data.id, function() {
                    self.insert(data, callback || function(){});
                });
            }
        };
    }
}