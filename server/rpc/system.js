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
var path = require('path');

function createVersions() {
  var packageJsonPath = path.join(__dirname, '..', '..', 'package.json');
  var packageJSON = require(packageJsonPath);
  var data = [
    {
      name: 'Management Console',
      version: packageJSON.version
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
  ];
  for (var k in process.versions) {
    data.push({
      name: k,
      version: process.versions[k]
    });
  }
  for (var d in packageJSON.dependencies) {
    packageJsonPath = path.join(__dirname, '..', '..', 'node_modules', d, 'package.json');
    var dep = require(packageJsonPath);
    data.push({
      name: d,
      version: dep.version
    });
  }
  return data;
}

var versions = {data: null};

exports.actions = function(req, res, ss) {

  // Easily debug incoming requests here
  //req.use('debug');

  return {
    loadavg: function loadavg() {
      var values = os.loadavg();
      res(null, {one: values[0], five: values[1], fifteen: values[2] });
    },
    versions: function version() {
      if(!versions.data) {
        versions.data = createVersions();
      }
      res(null, versions);
    },
    uptime: function uptime() {
      res(null, {process: process.uptime(), system: os.uptime()});
    }
  };
};

function dumpInfo() {
  console.log(JSON.stringify(createVersions(), null, 2));
}

if(require.main === module) {
  dumpInfo();
}