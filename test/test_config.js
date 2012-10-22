'use strict';

var config = require('../config.js');
var assert = require('assert');
var should = require('should');
var path = require('path');

describe('config', function() {
  describe('#getInstallDir', function() {
    it('correct install dir', function() {
      var installDirExpected = path.resolve(path.join(__dirname, '..', '..'));
      console.log('should be ' + installDirExpected);
      config.getInstallDir().should.eql(installDirExpected);
    });
  });
  describe('#get', function() {
    it('valid config return expected values', function() {
      config.get('internalPort').should.eql(3000);
    });
  });
});
