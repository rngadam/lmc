'use strict';

var assert = require('assert');
var fs = require('fs');
var git = require('../server/rpc/git.js');
var path = require('path');
var rimraf = require('rimraf');
var should = require('should');
var gitmanager = require('gitmanager');

describe('git', function() {
  describe('#checkout', function() {
    var gitname = 'test_gitsrcgit';
    var srcgit = path.resolve(path.join(__dirname, gitname));
    var sshgit = "ssh://localhost" + srcgit;
    var username = 'testusername';
    var homedir = path.join(__dirname, '..', 'users', username);
    var cloneName = path.join(homedir, gitname);

    function clean() {
      if(fs.existsSync(srcgit))
        rimraf.sync(srcgit);
      if(fs.existsSync(cloneName))
        rimraf.sync(cloneName);
      if(fs.existsSync(homedir))
        rimraf.sync(homedir);
    }

    before(function() {
      clean();
    });

    it('should correctly clone', function(done) {
      gitmanager.initPromise(srcgit)
      .then(
        function() {
          if(!fs.existsSync(srcgit))
            throw Error('Expected directory to be created: ' + srcgit);
          console.log('directory created ' + srcgit);
        }
      ).then(
        function() {
          git.checkout(srcgit, username,
            function(err, message) {
              if(err)
                throw err;
              if(!fs.existsSync(cloneName)) {
                throw Error('Expected directory to be created: ' + cloneName);
              }
              console.log('clone checked out ' + cloneName);
            }
          );
        }
      ).then(
        function() {
          console.log('and we are done...');
          done();
        }
      ).fail(
        function(err) {
          done(err);
        }
      )
    });

    after(function() {
      clean();
    });
  });
});
