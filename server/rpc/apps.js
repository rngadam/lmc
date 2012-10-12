"use strict";

/*
 * Start web apps RPC
 *
 * Author: Ricky Ng-Adam <rngadam@lophilo.com>

 Copyright 2012 Lophilo

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var fs = require('fs');
var path = require('path');
var config = require('../../config.js');
var testurl = require('testurl');
var child_process = require('child_process');

function run(directory) {
  var app = path.join(directory, 'app.js');  
  console.log('Running ' + app);
  var appInstance = child_process.spawn(
    config.getNodePath(), 
    [app], 
    {
      cwd: directory
    }
  );
  
  appInstance.stdout.on('data', function(data) {
    console.log(data.toString());
  });
  appInstance.stderr.on('data', function(data) {
    console.log(data.toString());
  });  
  appInstance.stdout.on('exit', function(data) {
    console.log(app + ' exited');
  });

  return {
    instance: appInstance, 
    url: 'http://' + config.getHostname() + '8888'
  }

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
      testurl.testUrlAvailability(
        data.url, 
        0, 
        function(err) {
          if(err) {
            res('error waiting for app to come up');
          } else {
            res(null, data.url);
          }
      });
    }      
  }
}
