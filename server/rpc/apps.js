var fs = require('fs');
var path = require('path');
var config = require('./config.js');
var testurl = require('testurl');
var child_process = require('child_process');

function run(directory) {
  var app = path.join(directory, 'app.js');  
  console.log('Running ' + app);
  var appInstance = child_process.spawn('/usr/bin/nodejs', [app], {
    cwd: directory
  });
  return {instance: appInstance, url: 'http://lophilo.local:8888'};
}


exports.actions = function(req, res, ss) {
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
    },
    run: function(appname) {
      var data = run(config.getCheckoutName(appname, req.session.userId));
      testurl.testUrlAvailability(data.url, 0, function(err) {
        if(err) {
          res('error waiting for app to come up');
        } else {
          res(null, data.url);
        }
      });
    }      
  }
}
