module.exports = function(ejs) {
     ejs.filters.taskLabels = function(labels) {
        var result = "";
        for (var key in labels) {
            var line = "<span class=\"label\">";
            line += labels[key];
            line += '</span>';

            result += line;
        }

        return result;
    };
};
