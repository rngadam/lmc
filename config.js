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

var BASE_DIR = '/root/lophilo/lmc';
var USERS_DIR = path.join(BASE_DIR, 'users');

function getNodePath() {
    return '/usr/local/bin/node';
}
exports.getNodePath = getNodePath;

function getCloud9Script() {
    return '/root/lophilo/cloud9-on-lophilo/bin/cloud9.sh';
}
exports.getCloud9Script = getCloud9Script;

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

function getHostname() {
    return 'lophilo.local';
}
exports.getHostname = getHostname;

var currentPort = 8888;
function getNextAvailablePort() {
    return currentPort++;
}
exports.getNextAvailablePort = getNextAvailablePort;

function getIp() {
    return "10.42.0.38";
}
exports.getIp = getIp;