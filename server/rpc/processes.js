'use strict';

/*
 * Manage running processes
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

var config = require('../../config.js');
var forkarator = require('forkarator');
var path = require('path');

function createUserReadableName(id) {
  return path.join(path.basename(path.dirname(id)), path.basename(id));
}

process.on('exit', function() {
  console.log('exiting so resetting all...');
  forkarator.reset();
});

exports.actions = function(req, res, ss) {
  req.use('session');
  //req.use('debug');
  req.use('admin.user.checkAuthenticated');
  return {
    list: function() {
      forkarator.server.list(function(err, childs) {
        var data = [];
        for (var id in childs) {
          console.dir(childs[id]);
          var name =
          data.push({
            name: createUserReadableName(id),
            id: id,
            icon: '/icons/socketstream.png'
          });
        }
        res(err, data);
      });
    },
    kill: function(id) {
      forkarator.server.stop(id, res);
    },
    status: function(id) {
      forkarator.server.status(id, res);
    },
    open: function(id) {
      forkarator.server.port(id, function(err, port) {
        if(err) res(err);
        else res(null, config.createURL(port));
      });
    },
  }
}