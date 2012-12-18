
/*
 * GET home page.
 */

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
  res.sendfile('public/index.html');
};

exports.gif = function(req, res){
  //res.render('index', { title: 'Express' });
  res.sendfile('public/gif.html');
};