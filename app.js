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

var GITHUB_CLIENT_ID = '8b19f4a1ceb92a50819b';
var GITHUB_CLIENT_SECRET = '8deb9798993c0a1a937e6fb90416b287867cbb48';
var COOKIE_SECRET = 'My kitten is a bit crazy'; // generate and read from disk
var SESSION_SECRET = 'His name is Chewie';

everyauth.github
  .appId(GITHUB_CLIENT_ID)
  .appSecret(GITHUB_CLIENT_SECRET)
  .entryPath('/auth/github')
  .callbackPath('/auth/github/callback')
  .scope('repo')
  .findOrCreateUser( function (session, accessToken, accessTokenExtra, githubUserMetadata) {
    session.oauth = accessToken;
    session.userId = githubUserMetadata.login;
    session.save();
    return true;
  })
  .redirectPath('/');

exports.configureEveryAuth = function(ss) {
  ss.http.middleware.prepend(ss.http.connect.bodyParser());
  ss.http.middleware.append(everyauth.middleware());
}


// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.html',
  css:  ['app.styl'],
  code: ['libs/jquery.min.js', 'app'],
  tmpl: '*'
});

ss.client.define('loadavg', {
  view: 'loadavg.html',
  css:  ['jgauge'],
  code: ['libs/jquery.min.js', 'libs/jgauge-0.3.0.a3.min.js', 'libs/jQueryRotate.min.js', 'loadavg'],
  tmpl: '*'
});

ss.client.define('processing', {
  view: 'processing.html',
  code: ['libs/jquery.min.js', 'libs/processing-1.4.1.js',  'processing'],
  tmpl: '*'
});

// the order matters: jquery has to come first
ss.client.define('sparklines', {
  view: 'sparklines.html',
  code: [ 'libs/jquery.min.js', 'libs/jquery.sparkline.min.js','sparklines'],
  tmpl: '*'
});

ss.client.define('webgl', {
  view: 'webgl.html',
  code: [ 'libs/jquery.min.js', 'webgl'],
  tmpl: '*'
});

ss.client.define('knockout', {
  view: 'knockout.html',
  code: [ 'libs/jquery.min.js', 'libs/knockout-2.1.0.js', 'knockout'],
  tmpl: '*'
});

ss.client.define('bootstrap', {
  view: 'bootstrap.html',
  css: ['bootstrap'],
  code: [ 'libs/jquery.min.js', 'libs/bootstrap.js', 'bootstrap'],
  tmpl: '*'
});

ss.client.define('test', {
  view: 'test.html',
  css: ['bootstrap'],
  code: [ 'libs/jquery.min.js', 'libs/bootstrap.js', 'libs/knockout-2.1.0.js', 'test'],
  tmpl: '*'
});

ss.client.define('mc', {
  view: 'mc.html',
  css: ['bootstrap'],
  code: [ 
    'libs/jquery.min.js', 
    'libs/knockout-2.1.0.js', 
    'libs/bootstrap.js', 
    'libs/jquery.sparkline.min.js', 
    'libs/knockout.mapping-latest.js', 
    'mc'],
  tmpl: '*'
});

// Serve this client on the root URL
ss.http.route('/', function(req, res){
  res.serveClient('mc');
});

ss.http.route('/loadavg', function(req, res){
  res.serveClient('loadavg');
});

ss.http.route('/sparklines', function(req, res){
  res.serveClient('sparklines');
});

ss.http.route('/processing', function(req, res){
  res.serveClient('processing');
});

ss.http.route('/webgl', function(req, res){
  res.serveClient('webgl');
});

ss.http.route('/knockout', function(req, res){
  res.serveClient('knockout');
});

ss.http.route('/bootstrap', function(req, res){
  res.serveClient('bootstrap');
});

ss.http.route('/test', function(req, res){
  res.serveClient('test');
});

// Code Formatters
console.dir(ss.client);
ss.client.formatters.add(require('ss-stylus'));

// Use server-side compiled Hogan (Mustache) templates. Others engines available
ss.client.templateEngine.use(require('ss-hogan'));

// middleware
//require('./server/backup/auth').configureEveryAuth(ss);

// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();

// Start web server
var server = http.Server(ss.http.middleware);
server.listen(3000);

// Start Console Server (REPL)
// To install client: sudo npm install -g ss-console
// To connect: ss-console <optional_host_or_port>
var consoleServer = require('ss-console')(ss);
consoleServer.listen(5000);

// Start SocketStream
ss.start(server);