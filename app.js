'use strict';
/*
 * SocketStream application application Management Console for Lophilo
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

var http = require('http');
var ss = require('socketstream');
var everyauth = require('everyauth');
var assert = require('assert');
var localconfigs = require('ss-localconfigs');

var path = require('path');
var config = require(path.join(__dirname, 'config.js'));

everyauth.github
  .appId(config.get('clientId'))
  .appSecret(config.get('clientSecret'))
  .entryPath(config.get('entryPath'))
  .callbackPath(config.get('callbackPath'))
  .scope('repo')
  .findOrCreateUser(function(session, accessToken, accessTokenExtra, githubUserMetadata) {
      session.oauth = accessToken;
      session.userId = githubUserMetadata.login;
      session.save();
      return session.userId;
    })
  .redirectPath('/');

ss.http.middleware.prepend(ss.http.connect.bodyParser());
ss.http.middleware.append(everyauth.middleware());

ss.session.store.use('redis');
ss.publish.transport.use('redis');

localconfigs.applyConfigs(
    ss,
    path.join(__dirname, 'client/code'), '.socketstream.json');

// Code Formatters
ss.client.formatters.add(require('ss-stylus'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

// middleware
//require('./server/backup/auth').configureEveryAuth(ss);

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

// Start web server
var server = http.Server(ss.http.middleware);
server.listen(config.get('internalPort'), '0.0.0.0');

// Start Console Server (REPL)
// To install client: sudo npm install -g ss-console
// To connect: ss-console <optional_host_or_port>
var consoleServer = require('ss-console')(ss);
consoleServer.listen(config.get('internalPort') + 1);

// Start SocketStream
ss.start(server);

console.log('Listening on http://'
  + config.get('hostname')
  + ':'
  + config.get('port')
  + " (internal "
  + "http://"
  + config.get('internalHostname')
  + ':'
  + config.get('internalPort')
  + ')'
  );
