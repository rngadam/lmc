var fs = require('fs');
var config = require('./config.js');

exports.actions = function(req, res, ss){
  req.use('session');
  req.use('debug');
  req.use('admin.user.checkAuthenticated');
  return {

    // Square a number and return the result
    list: function(){
      var data = [];
      fs.readdir(config.getHomeDirectory(req.session.userId), function(err, files) {
        if(err) {
          res(err);
        } else {
          console.log(files);
          for(var i in files) {
            console.log(files[i]);
            if(files[i].indexOf('.git') > 0) {
              data.push({
                name: files[i], 
                icon: "/icons/nodejs.svg", 
                url: "#run-app"});  
            }
            
          }
          res(data);          
        }
      });
    },
  rm: function(appname) {
    var exec = require( 'child_process' ).exec;
    var path = config.getCheckoutName(appname, req.session.userId);

    exec('/bin/rm -fr ' + path, function ( err, stdout, stderr ){
      if(err) {
        res(err);
      } else {
        res('app deleted: ' + appname);
      }
      
    });
  }
  }
}
