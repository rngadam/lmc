'use strict';

var forkarator = require('forkarator');
var bootide = require('./bootide');
var config = require('../../config.js');

function setup(id, dir) {
  forkarator.setup(id, process);
  bootide.boot(
      config.getCloud9Path(),
      dir,
      {
        port: 0
      },
      function(err, address) {
        if (err) throw err;
        console.log('%s:%d', address.address, address.port);
        forkarator.register(id, address.port);
      }
  );
}

if (require.main === module) {
  // argument 0: node bin path
  // argument 1: this script name
  // argument 2: the id that we want to register as
  // argument 3: directory that we are working from
  var id = process.argv[2];
  var dir = process.argv[3];
  console.log('forking id: %s, dir: %s', id, dir);
  setup(id, dir);
}
