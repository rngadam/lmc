"use strict";
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

var GITHUB_CLIENT_ID = '8b19f4a1ceb92a50819b';
var GITHUB_CLIENT_SECRET = '8deb9798993c0a1a937e6fb90416b287867cbb48';
var COOKIE_SECRET = 'My kitten is a bit crazy'; // generate and read from disk
var SESSION_SECRET = 'His name is Chewie';

var configs = [
  {
    host: 'local.host',
    port: 3000,
    clientId: '8b19f4a1ceb92a50819b',
    clientSecret: '8deb9798993c0a1a937e6fb90416b287867cbb48',
    entryPath: '/auth/github',
    callbackPath: '/auth/github/callback' 
  },
  {
    host: 'lophilo.local',
    port: 80,
    internalPort: 8080,
    clientId: '53daae98ae370d2dfdb5',
    clientSecret: '638354c0def5f4339be0cf32bf7fd9526389228c',
    entryPath: '/auth/github',
    callbackPath: '/auth/github/callback' 
  },  
];

var config = configs[1];

everyauth.github
  .appId(config.clientId)
  .appSecret(config.clientSecret)
  .entryPath(config.entryPath)
  .callbackPath(config.callbackPath)
  .scope('repo')
  .findOrCreateUser( function (session, accessToken, accessTokenExtra, githubUserMetadata) {
    session.oauth = accessToken;
    session.userId = githubUserMetadata.login;
    session.save();
    return session.userId;
  })
  .redirectPath('/');

ss.http.middleware.prepend(ss.http.connect.bodyParser());
ss.http.middleware.append(everyauth.middleware());

localconfigs.applyConfigs(ss, './client/code', 'socketstream.json');

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
server.listen(config.internalPort, config.host);

// Start Console Server (REPL)
// To install client: sudo npm install -g ss-console
// To connect: ss-console <optional_host_or_port>
var consoleServer = require('ss-console')(ss);
consoleServer.listen(config.internalPort + 1);

// Start SocketStream
ss.start(server);