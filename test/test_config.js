'use strict';

var config = require('../config.js');
var assert = require('assert');
var should = require('should');
var path = require('path');

describe('config', function() {
  describe('#getInstallDir', function() {
    it('correct install dir', function() {
      config.getInstallDir().should.eql(path.resolve('..'));
    });
  });
  describe('#get', function() {
    it('valid config return expected values', function() {
      config.setTarget('lophilo.local', 80);
      config.get('internalPort').should.eql(8080);
    });
    it('unavailable host throws', function() {
      (function() {
        config.setHostname('lophilo.com', 80);
      }).should.throw(/configuration not found/);
    });
  });
});
