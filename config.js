"use strict";

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

var INSTALL_DIR = path.resolve('.', path.join(__dirname, '..'));
var LMC_DIR = __dirname;
var USERS_DIR = path.join(LMC_DIR, 'users');

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
var configs = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
var currentConfig;

function setTarget(hostname, port) {
    for(var i in configs) {
        if(hostname == configs[i].hostname && port == configs[i].port) {
            currentConfig = configs[i];
            return;
        }
    }
    throw new Error('configuration not found for hostname ' + hostname);
}
exports.setTarget = setTarget;

function get(key) {
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

function getHomeDirectory (username) {
	return path.join(USERS_DIR, username);
}
exports.getHomeDirectory = getHomeDirectory;

function getSshDirectory(username) {
	return path.join(getHomeDirectory(), '.ssh');
}
exports.getSshDirectory = getSshDirectory;

function getCheckoutName(repoUrl, username) {
    var index = repoUrl.lastIndexOf('/');
    var checkoutName;
    if(index>0) {
       checkoutName = repoUrl.slice(index+1);
    } else {
        checkoutName = repoUrl;
    }

    return path.join(getHomeDirectory(username), checkoutName)
}
exports.getCheckoutName = getCheckoutName;

function createURL(port) {
    return 'http://' + get('hostname') + ':' + port
}
exports.createURL = createURL;