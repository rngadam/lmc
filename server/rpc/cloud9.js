"use strict";

/*
 * Launch cloud9 IDE [ss.rpc("cloud9.edit", "git@github.com:Lophilo/sshkeys.git")]
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
var child_process = require('child_process');

var assert = require('assert');
var testurl = require('testurl');
var config = require('./config.js');

function startCloud9(directory) {
  assert(directory, 'location of git repository required');
  var cmd = "/home/rngadam/lophilo/cloud9/bin/cloud9.sh -w "  + directory + "";

  var cloud9 = child_process.spawn('/bin/bash', ["-c", cmd]);
  cloud9.stdout.on('data', function(data) {
    console.log(data.toString());
  });
  cloud9.stderr.on('data', function(data) {
    console.log(data.toString());
  });  
  cloud9.stdout.on('exit', function(data) {
    console.log('cloud9 exited');
  });

  return {instance: cloud9, url: "http://localhost:3131"};
}

exports.actions = function(req, res, ss){
  req.use('session');
  req.use('debug');
  req.use('admin.user.checkAuthenticated');
  return {
    edit: function(repoUrl) {
      var data = startCloud9(config.getCheckoutName(repoUrl, req.session.userId));
      testurl.testUrlAvailability(data.url, 0, function(err) {
        if(err) {
          res('error waiting for cloud9 to come up');
          data.instance.kill();
        } else {
          res(data.url);
        }
      });
    }
  }
}