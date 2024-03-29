'use strict';

/*
 * Execute Cloud9 with correct configuration
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
var architect = require('architect');
var ideconfig = require('./ideconfig');
var fs = require('fs');

function BootIdeException(message) {
  this.message = message;
}
BootIdeException.prototype = new Error;

function archive(obj, filename) {
  fs.writeFile(filename, JSON.stringify(obj, null, 4), function(err) {
    if (err) console.log(err.stack);
    else console.log('wrote %s', filename);
  });
}
// hostname == request.headers.host
// ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
function boot(dirname, workdir, options, cb) {
  var debug = options.debug || false;
  var packed = options.packed || false;
  var packedName = options.packedName || '';
  var ip = options.ip || '0.0.0.0';
  var port = options.port || 0;

  if (!(cb instanceof Function)) {
    throw new BootIdeException('callback must be function, got: ' + cb);
  }

  var plugins = ideconfig.getConfig(
      dirname,
      workdir,
      ip,
      port);

  //archive(plugins, 'plugins.txt');

  // server plugins
  plugins.forEach(function(plugin) {
    if (plugin.packagePath && /\.\/cloud9.core$/.test(plugin.packagePath)) {
      //TODO: strange, in the original configuration
      // does that mean this is always overridden?
      if (!plugin.debug) {
        plugin.debug = debug;
      }

      plugin.packed = packed;
      plugin.packedName = packedName;
    }
  });

  architect.createApp(
      architect.resolveConfig(
      plugins,
      path.join(dirname, 'plugins-server')),
      function(err, app) {
        if (err) {
          console.error("While starting the '%s' for '%s':", dirname, workdir);
          cb(err);
        } else {
          console.log("Started '%s' for '%s'!", dirname, workdir);
          var address = app.services.http.getServer().address();
          cb(null, address);
        }
      }
  );
}
exports.boot = boot;

if (require.main === module) {
  var cloud9Dir = path.join(
      process.env['HOME'],
      'lophilo/cloud9');
  boot(
      cloud9Dir,
      process.env['HOME'],
      {
        port: 0
        //debug: true
      },
      function(err, address) {
        if (err) throw err;
        console.log('%s:%d', address.address, address.port);
      }
  );
}
