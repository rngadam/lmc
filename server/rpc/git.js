'use strict';

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
var config = require('../../config.js');

function streamBuffer(data) {
  console.log('LOG: ' + data);
}

function checkout(repoUrl, username, cb) {
  var cloneName = config.getCheckoutName(repoUrl, username);
  var sshPath = config.get('sshPath');
  var sshDir = config.getSshDirectory(username);

  // we won't use it, but we want to make sure the key exist...
  sshkeys.getPublicKeyPromise(sshDir, 'github').then(
    function() {
      return gitmanager.clonePromise(
        repoUrl,
        cloneName,
        sshPath
      );
    }
  ).then(
    function() {
      var sshPrivateKeyPath = path.join(sshDir, 'github');
      return gitmanager.configPromise(cloneName, sshPrivateKeyPath);
    }
  ).then(
    function() {
      cb(null, 'successfully checked out ' + repoUrl);
    }
  ).fail(
    function(err) {
      console.log('TEST FAILED ' + err);
      cb(err);

    }
  );
}
exports.checkout = checkout;

exports.actions = function(req, res, ss) {
  req.use('session');
  req.use('debug');
  req.use('admin.user.checkAuthenticated');
  return {
    // takes in full repo URL and checks it out
    // using the ssh key
    checkout: function(repoUrl) {
      checkout(repoUrl, req.session.userId, function(err) {
        if (err) {
          res('Error: could not checkout repository: ' + err.stack);
        } else {
          res(null, 'Repository has been checked out ' + repoUrl);
        }
      });
    },
    // returns pubkey value (creates it if not available)
    pubkey: function() {
      var sshDir = config.getSshDirectory(req.session.userId);
      sshkeys.getPublicKey(sshDir, 'github', function(err, key) {
          if (err) {
            res(err);
          } else {
            res(null, key);
          }
      });
    }
  };
};
