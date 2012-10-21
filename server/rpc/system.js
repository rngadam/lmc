'use strict';

/*
 * Offer general system level RPC
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

var os = require('os');
var fs = require('fs');

var versions = {
  data: [
    {
      name: 'Management Console',
      version: '1.0'
    },
    {
      name: 'Hardware platform',
      version: 'version 1.0 (tabby)'
    },
    {
      name: 'Operating system',
      version: 'Debian Wheezy 7.0'
    },
    {
      name: 'Linux Kernel',
      version: '3.4.4'
    },
    {
      name: 'Kernel driver',
      version: '1.0 (tabby)'
    }
  ]
};

for (var k in process.versions) {
  versions.data.push({name: k, version: process.versions[k]});
}
exports.actions = function(req, res, ss) {

  // Easily debug incoming requests here
  //console.log(req);

  return {
    loadavg: function loadavg() {
      var values = os.loadavg();
      res(null, {one: values[0], five: values[1], fifteen: values[2] });
    },
    versions: function version() {
      res(null, versions);
    },
    uptime: function uptime() {
      res(null, {process: process.uptime(), system: os.uptime()});
    }
  };
};
