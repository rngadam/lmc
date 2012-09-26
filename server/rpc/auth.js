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
exports.actions = function(req, res, ss){

  // tell SocketStream to load session data
  req.use('session');

  return {
    current: function() {
      var username = req.session.userId
      if(!req.session.userId) {
        username = "not logged in";
      }
      res(username);
    },
    authenticate: function(username, password){
      console.log(arguments);
      var pam = require('authenticate-pam');
      pam.authenticate(username, password, function(err, user) {
          console.log(arguments);
          if(err) {
            console.log(err);
          }
          else {
            console.log("Authenticated!");
            if (user) {
              req.session.setUserId(user.id);
              res(true);
            } else {
              res('Access denied!');
            }
          }
      }, {serviceName: 'lmc', remoteHost: 'localhost'});      
    },

    logout: function(){
      req.session.setUserId(null);
      res(true);
    }
  }
}
