'use strict';

/*
 * Wrap a SocketStream app to track on which port the webapp is available.
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
var forkarator = require('forkarator');

function setup(id, appPath) {
	forkarator.setup(id, process);
	var app = require(appPath);
	app.main(function(err, port) {
		if (err) throw err;
		console.log('Listening on port %d', port);
		forkarator.register(id, port);
	});
}

if (require.main === module) {
	// argument 0: node bin path
	// argument 1: this script name
	// argument 2: the id that we want to register as
	// argument 3: path to socketstream app.js app
	var id = process.argv[2];
	var appPath = process.argv[3];
	console.log('forking id: %s, path: %s', id, appPath);
	setup(id, appPath);
}
