var path = require('path');
var sshkeys = require('sshkeys');

var BASE_DIR = '/home/rngadam/lophilo/lmc';
var USERS_DIR = path.join(BASE_DIR, 'users');

exports.actions = function(req, res, ss){
	req.use('session');
	req.use('debug');
	req.use('admin.user.checkAuthenticated');
	return {
		// takes in full repo URL and checks it out
		// using the ssh key
		checkout: function(repoName) {
		  checkout(repoName, res);
		},
		// returns pubkey value (creates it if not available)
		pubkey: function() {
		  sshkeys.getPublicKey(USERS_DIR, req.session.userId, 'github', function(err, key) {
		  	if(err) {
		  		// publish error err
		  		res(null);
		  	} else {
		  		res(key);
		  	}
		  });
		}		
	}
}
