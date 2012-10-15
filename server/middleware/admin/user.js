exports.checkAuthenticated = function() {

  return function(req, res, next){
  	console.log('checking that user is authenticated');
    if (req.session && req.session.userId) {
    	console.log(req.session.userId);
    	return next();
    }
    console.log('NO session available');
    res("Access denied: not logged in yet!"); // Access denied: prevent request from continuing
  }
}