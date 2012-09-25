
"use strict";

/*
 * git repositories API for Lophilo
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
var sshkeys = require('sshkeys');
var gitmanager = require('gitmanager');

var BASE_DIR = '/home/rngadam/lophilo/lmc';
var USERS_DIR = path.join(BASE_DIR, 'users');

function getHomeDirectory(username) {
	return path.join(USERS_DIR, username);
}

function getSshDirectory(username) {
	return path.join(getHomeDirectory(), '.ssh');
}

function streamBuffer(data) {
	console.log('LOG: ' + data);
}

function checkout(repoUrl, username, cb) {
	sshkeys.getPublicKeyPromise(getSshDirectory(username), username, 'github')
		.then(
			function(key) {
				return gitmanager.cloneGitPromise(
					repoUrl, getHomeDirectory(username), key);
			}			
		).then(
			function() {
				cb(null, true);
			}
		).fail(
			function(err) {
				cb(err);
			}		
		);
}

exports.actions = function(req, res, ss){
	req.use('session');
	req.use('debug');
	req.use('admin.user.checkAuthenticated');
	return {
		// takes in full repo URL and checks it out
		// using the ssh key
		checkout: function(repoUrl) {
			checkout(repoUrl, req.session.userId, function(err) {
				if(err) res('Error: could not checkout repository: ' + err.stack);
				else res('Repository has been checked out ' + repoUrl);
			});
		},
		// returns pubkey value (creates it if not available)
		pubkey: function() {
		  sshkeys.getPublicKey(getSshDirectory(req.session.userId), req.session.userId, 'github', function(err, key) {
		  	if(err) {
		  		// publish error err
		  		res(null);
		  	} else {
		  		res(key);
		  	}
		  });
		}		
	}
}
