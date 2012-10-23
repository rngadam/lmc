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

var versions = null;

function getVersions() {
  if(!versions) {
    versions = createVersions();
  }
  return versions;
}
exports.getVersions = getVersions;

function getAllMethods(obj) {
    return Object.getOwnPropertyNames(obj).filter(function(property) {
        return typeof obj[property] == 'function';
    });
}

function getOperatingSystemInformation() {
  var info = {};
  var methodList = getAllMethods(os);
  for(var i in methodList) {
    var name = methodList[i];
    var fnc = os[name];
    if(typeof fnc == 'function') {
      info[name] = fnc();
    }
  }
  return info;
}

function getProcessInformation() {
  var info = {};
  var methodList = [
    'uptime',
    'getuid',
    'getgid',
    'execPath',
    'pid',
    'features',
    'memoryUsage',
    'uvCounters',
    'config'
  ];
  for(var i in methodList) {
    var name = methodList[i];
    var datasource = process[name];
    if(typeof datasource == 'function') {
      info[name] = datasource();
    } else {
      info[name] = datasource;
    }
  }
  return info;
}

function getSystemInformation() {
  var all = {
    os: getOperatingSystemInformation(),
    process: getProcessInformation()
  };
  return all;
}

exports.actions = function(req, res, ss) {

  // Easily debug incoming requests here
  //req.use('debug');

  return {
    info: function() {
      res(null, getSystemInformation());
    },
    versions: function() {
      res(null, getVersions());
    },
    os: function() {
      res(null, getOperatingSystemInformation());
    },
    process: function() {
      res(null, getProcessInformation());
    },
    loadavg: function() {
      var values = os.loadavg();
      res(null, {one: values[0], five: values[1], fifteen: values[2] });
    },
    uptime: function() {
      res(null, {process: process.uptime(), system: os.uptime()});
    }
  };
};

function dumpAll() {
  console.log(JSON.stringify(getSystemInformation(), null, 2));
  console.log(JSON.stringify(getVersions(), null, 2));
}

if(require.main === module) {
  //dumpVersions();
  dumpAll();
}