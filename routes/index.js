
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index/index', { title: 'Small Api Server' });
};