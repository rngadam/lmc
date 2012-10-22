'use strict';

/*
 * checkout and configure git repositories
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

var path = require('path');
var fs = require('fs');
var assert = require('assert');

var INSTALL_DIR = path.resolve(path.join(__dirname, '..'));
var LMC_DIR = __dirname;
var USERS_DIR = path.join(LMC_DIR, 'users');
var SSH_PATH = path.join(LMC_DIR, 'ssh');

// sample config file (do not check in github!)
// {
//   "hostname": "HOSTNAME",
//   "port": EXPORTED_PORT_USING_IPTABLES,
//   "internalPort": PORT_LISTEN_TO,
//   "clientId": "FROM_GITHUB",
//   "clientSecret": "FROM_GITHUB",
//   "entryPath": "/auth/github",
//   "callbackPath": "/auth/github/callback",
// }
var currentConfig = null;

function addAdditionalConfig(config) {
  config['sshPath'] = SSH_PATH;
}

function init() {
  var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
  var hostname = config.target.hostname;
  var port = config.target.port;
  assert(hostname, "target hostname must be set in configuration");
  assert(port, "target port must be set in configuration");
  for (var i in config.configs) {
    if (hostname == config.configs[i].hostname && port == config.configs[i].port) {
      currentConfig = config.configs[i];
      addAdditionalConfig(currentConfig);
      return;
    }
  }
  throw new Error('configuration not found for hostname ' + hostname);
}

init();

function get(key) {
  assert(key, 'valid key required');
  return currentConfig[key];
}
exports.get = get;

function getInstallDir() {
  return INSTALL_DIR;
}
exports.getInstallDir = getInstallDir;

function getNodePath() {
  return '/usr/local/bin/node';
}
exports.getNodePath = getNodePath;

function getCloud9Path() {
  return path.join(getInstallDir(), 'cloud9');
}
exports.getCloud9Path = getCloud9Path;

function getCloud9ScriptRelativePath() {
  return './bin/cloud9.sh';
}
exports.getCloud9ScriptRelativePath = getCloud9ScriptRelativePath;

function getHomeDirectory(username) {
  assert(username, 'valid username required');
  return path.join(USERS_DIR, username);
}
exports.getHomeDirectory = getHomeDirectory;

function getSshDirectory(username) {
  assert(username, 'valid username required');
  return path.join(getHomeDirectory(username), '.ssh');
}
exports.getSshDirectory = getSshDirectory;

function getCheckoutName(repoUrl, username) {
  assert(username, 'valid username required');
  var index = repoUrl.lastIndexOf('/');
  var checkoutName;
  if (index > 0) {
    checkoutName = repoUrl.slice(index + 1);
  } else {
    checkoutName = repoUrl;
  }

  return path.join(getHomeDirectory(username), checkoutName);
}
exports.getCheckoutName = getCheckoutName;

function createURL(port) {
  assert(port, 'valid port required');
  return 'http://' + get('hostname') + ':' + port;
}
exports.createURL = createURL;
