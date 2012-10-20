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
var assert = require('assert');
var forkarator = require('forkarator');
var config = require('../../config.js');
var path = require('path');
var script = path.join(__dirname, 'forkide.js');

function startCloud9(directory, cb) {
  assert(directory, 'location of git repository required');
  var id = directory;
  forkarator.start(id, script, [id, directory], cb);
}

function createUrl(req, port) {
    return 'http://' + config.get('hostname') + ':' + port;
}

exports.actions = function(req, res, ss){
  req.use('session');
  req.use('debug');
  req.use('admin.user.checkAuthenticated');
  return {
    edit: function(repoUrl) {
      var dir = config.getCheckoutName(repoUrl, req.session.userId);
      var data = startCloud9(dir, function(err, port) {
        if(err) {
          res('error waiting for cloud9 to come up' + err.stack);
        } else {
          res(null, createUrl(req, port));
        }
      });
    }
  }
}
