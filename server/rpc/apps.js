'use strict';

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
var forkarator = require('forkarator');

var forkerPath = path.resolve(path.join(__dirname, 'forkapp.js'));

function run(directory, cb) {
  var app = path.join(directory, 'app.js');
  console.log('Running ' + app);
  var id = app;
  forkarator.server.start(id, forkerPath, [id, app], { cwd: directory }, cb);
}

exports.actions = function(req, res, ss) {
  req.use('session');
  //req.use('debug');
  req.use('admin.user.checkAuthenticated');
  return {
    new: function(appname) {
      console.log('creating %s', appname)
    },
    list: function() {
      var data = [];
      var dir = config.getHomeDirectory(req.session.userId);
      fs.readdir(dir, function(err, files) {
        if (err) {
          res(err);
        } else {
          for (var i in files) {
            if (files[i].indexOf('.git') > 0) {
              data.push({
                name: files[i],
                icon: '/icons/nodejs.svg',
                url: '#run-app'});
            }
          }
          res(null, data);
        }
      });
    },
    rm: function(appname) {
      var exec = require('child_process').exec;
      var path = config.getCheckoutName(appname, req.session.userId);

      exec('/bin/rm -fr ' + path, function(err, stdout, stderr ) {
        if (err) {
          res(err);
        } else {
          res(null, 'app deleted: ' + appname);
        }
      });
    },
    run: function(appname) {
      var checkoutName = config.getCheckoutName(appname, req.session.userId)
      var data = run(checkoutName,
          function(err, port) {
            if (err && typeof err == 'object') {
              err = err.toString();
            }
            var url;
            if (port) { // if the error is already started, the port is still valid
              url = config.createURL(port);
            } else {
              url = null;
            }
            res(err, url);
          }
          );
    },

  };
};
