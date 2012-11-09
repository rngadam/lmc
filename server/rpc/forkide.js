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

function setup(dir) {
  bootide.boot(
      config.getCloud9Path(),
      dir,
      {
        port: 0
      },
      function(err, address) {
        if (err) throw err;
        console.log('%s:%d', address.address, address.port);
        forkarator.client.register(address.port);
      }
  );
}

if (require.main === module) {
  // argument 0: node bin path
  // argument 1: this script name
  // argument 2: directory that we are working from
  var dir = process.argv[2];
  console.log('forking id: %s, dir: %s', dir);
  setup(dir);
}
