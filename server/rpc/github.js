'use strict';

/*
 * Interface with user Github information
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
var assert = require('assert');
var redis = require('redis'),
    rclient = redis.createClient();

var GitHubApi = require('github');

var github = new GitHubApi({
  version: '3.0.0'
});
assert(github, "Can't load Github API");

exports.actions = function(req, res, ss) {
  // Easily debug incoming requests here
  //console.log(req);
  req.use('session');
  req.use('debug');
  req.use('admin.user.checkAuthenticated');
  return {
    repositories: function() {
      var key = req.session.auth.github.user.login;
      rclient.get(key, function(error, data) {
        assert(!error, 'Error querying back-end storage' + error);
        if (data) {
          console.log('fetched data from redis');
          res(null, JSON.parse(data));
        }
        //res(testdata);
        github.authenticate({
          type: 'oauth',
          token: req.session.oauth
        });
        console.log('authenticated to github');
        github.repos.getAll({}, function(error, data) {
          assert(!error, 'Error querying github' + error);
          assert(data, 'Empty dataset returned by github' + data);
          console.log('fetched data from github');

          rclient.set(key, JSON.stringify(data), function(error, reply) {
            assert(!error, 'error caching data ' + data);
            console.log(reply);
            res(null, data);
          });
        });
      });
    }
  };
};
