'use strict';
/*
 * Wrap Cloud9 startup script for forkarator
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

var forkarator = require('forkarator');
var bootide = require('./bootide');
var config = require('../../config.js');

function setup(id, dir) {
  forkarator.setup(id, process);
  bootide.boot(
      config.getCloud9Path(),
      dir,
      {
        port: 0
      },
      function(err, address) {
        if (err) throw err;
        console.log('%s:%d', address.address, address.port);
        forkarator.register(id, address.port);
      }
  );
}

if (require.main === module) {
  // argument 0: node bin path
  // argument 1: this script name
  // argument 2: the id that we want to register as
  // argument 3: directory that we are working from
  var id = process.argv[2];
  var dir = process.argv[3];
  console.log('forking id: %s, dir: %s', id, dir);
  setup(id, dir);
}
