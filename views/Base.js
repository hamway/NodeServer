/**
 * Created by hamway on 27.03.14.
 */
module.exports = function(response, template) {
    this.response = response;
    this.template = template;
};
module.exports.prototype = {
    extend: function(properties) {
        var Child = module.exports;
        Child.prototype = module.exports.prototype;
        for(var key in properties) {
            Child.prototype[key] = properties[key];
        }
        return Child;
    },
    render: function(data) {
        if(this.response && this.template) {
            this.response.render(this.template, data);
        }
    }
}