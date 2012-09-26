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

var BASE_DIR = '/home/rngadam/lophilo/lmc';
var USERS_DIR = path.join(BASE_DIR, 'users');

function getHomeDirectory (username) {
	return path.join(USERS_DIR, username);
}


function getSshDirectory(username) {
	return path.join(getHomeDirectory(), '.ssh');
}

 function getCheckoutName(repoUrl, username) {
  var checkoutName = repoUrl.slice(repoUrl.lastIndexOf('/')+1);	
  return path.join(getHomeDirectory(username), checkoutName)	
}

exports.getHomeDirectory = getHomeDirectory;
exports.getCheckoutName = getCheckoutName;
exports.getSshDirectory = getSshDirectory;