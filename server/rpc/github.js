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
    redisClient = redis.createClient();

var GitHubApi = require('github');

// see http://ajaxorg.github.com/node-github/
var github = new GitHubApi({
  version: '3.0.0'
});
assert(github, "Can't load Github API");

function fetchUserRepos(res) {
  github.repos.getAll({}, function(err, data) {
    if(err) return res(err);
    console.log('fetched data from github');
    res(null, data);
  });
}

function fetchOrgRepos(org, res) {
  //TODO: does not take the parameters into account
  github.repos.getFromOrg({
    org: org,
    per_page: 100, // TODO: watch out if we get to >100!
    sort: 'full_name',
    }, function(err, data) {
    if(err) return res(err);
    console.log('fetched data from github');
    res(null, data);
  });
}

function memoize(key, fnc, cb) {
  redisClient.get(key, function(err, data) {
    if(err) return cb(err);
    if(data) {
      console.log('cache hit for ' + key);
      cb(null, JSON.parse(data));
    } else {
      console.log('cache miss for ' + key);
      fnc(function(err, fncdata) {
        if(err) return cb(err);
        redisClient.set(key, JSON.stringify(fncdata), function(err, data) {
          if(err) return cb(err);
          console.log('stored data for' + key);
          cb(null, fncdata);
        });
      })
    }
  });
}

function authenticateAndFetchUserRepos(req, res) {
  github.authenticate({
    type: 'oauth',
    token: req.session.oauth
  });
  fetchUserRepos(res);
}

function fork(user, repo, cb) {
  github.repos.fork({
    user: user,
    repo: repo
  }, cb);
}

function filterRepos(match, repos, cb) {
  var filteredRepos = [];
  for(var i in repos) {
    var repo = repos[i];
    if(repo.name && repo.name.match(match)) {
      console.log('found ' + repo.name);
      filteredRepos.push({
        name: repo.name,
        description: repo.description,
        ssh_url: repo.ssh_url
      });
    }
  }
  cb(null, filteredRepos);
}

function getRepositoriesKey(req) {
  return req.session.auth.github.user.login + '.repositories';
}

function getExamplesKey(req) {
  return 'Lophilo.repositories';
}
exports.actions = function(req, res, ss) {
  req.use('session');
  req.use('debug');
  req.use('admin.user.checkAuthenticated');

  return {
    flushRepositories: function() {
      redisClient.del(getRepositoriesKey(req), res);
    },
    flushExamples: function() {
      redisClient.del(getExamplesKey(req), res);
    },
    repositories: function() {
      memoize(
        getRepositoriesKey(req),
        authenticateAndFetchUserRepos.bind(null, req),
        res
      );
    },
    examples: function() {
      //TODO: cache invalidation!
      memoize(
        getExamplesKey(req),
        fetchOrgRepos.bind(null, 'Lophilo'),
        function(err, repos) {
          console.log('filtering data');
          if(err) { console.error('ERROROOOOOO'); return res(err); }
          filterRepos(/lophilojs-/, repos, res);
        }
      );
    },
    name: function() {
      //TODO
      res("not implemented");
    },
    email: function() {
      //TODO
      res("not implemented");
    },
    fork: function(reponame) {
      //TODO: not tested
      fork('Lophilo', reponame, res);
    }
  };
};

if(require.main === module) {
  assert(process.env.GITHUB_USERNAME, 'export GITHUB_USERNAME=<your username>');
  assert(process.env.GITHUB_PASSWORD, 'export GITHUB_PASSWORD=<your password>');
  github.authenticate({
      type: "basic",
      username: process.env.GITHUB_USERNAME,
      password: process.env.GITHUB_PASSWORD
  });
  switch(process.argv[2]) {
    case 'fetch':
      fetchUserRepos(function(err, data) {
        if(err) throw err;
        console.log(data);
        process.exit(0);
      });
      break;
    case 'fetchorg':
      fetchOrgRepos('Lophilo', function(err, data) {
        if(err) throw err;
        console.log(data);
        process.exit(0);
      });
      break;
    case 'examples':
      fetchOrgRepos('Lophilo', function(err, repos) {
        if(err) throw err;
        filterRepos(/lophilojs-/, repos, function(err, data) {
          if(err) process.exit(1);
          console.log(JSON.stringify(data, null, 4));
        });
        process.exit(0);
      });
      break;
    case 'fork':
      fork('Lophilo', 'testurl', function(err, data) {
        if(err) throw err;
        console.log('Successfully forked: ' + data);
        process.exit(0);
      });
      break;
    default:
      console.log('param fork|fetch, got ' + process.argv[2]);
      process.exit(1);
  }
}