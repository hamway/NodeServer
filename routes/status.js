
/*
 * GET status page.
 */

exports.index = function(req, res){
    res.render("status", { title: 'Server status'});
};