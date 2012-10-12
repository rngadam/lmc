# The Main Controller (mc)

Lophilo main web console from which users can:

* login (using third party authentication systems with OAuth)
* manage various aspects of the systems
* monitor Lophilo remotely
* checkout repositories
* launch the Cloud9 IDE

## Technology

Based on the Socketstream framework.

SocketStream offers:

* a pre-defined directory hierarchy to organize code
* automatic pre-processing of files based on "formatters"
* packaging of all assets and dependencies for faster downloads (production mode)
* built-in RPC call system

# Running 

## startup

 node-mon app.js

 open localhost:3000 in your browser

## Dependencies

depends on the following:

	apt-get install libpam0g-dev 
	apt-get install redis-server

## Binary npm

These prevents the source from just being a copy:

### mmap 

	rm -fr node_modules/mmap
	npm install mmap


## running as a non-root user

non-root user can't bind ports below 1024 (including HTTP port 80). Use iptables to redirect:

	sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
	sudo iptables -t nat -A OUTPUT --src 0/0 --dst 127.0.0.1 -p tcp --dport 80 -j REDIRECT --to-ports 8080

# Development

## adding an app

* create directory and file ./client/code/<appname>/<appname>.js
* create file ./client/code/<appname>/entry.js (copy from other existing)
* make sure the require in entry.js points to <appname>
* create file ./client/views/<appname>
* modify ./app.js to ss.client.define your app dependencies and ss.http.route to route a URL to your app.
* test (node-mon and socketstream should automatically reload on app change)

## reload on changes

use nodemon or supervisor:

	supervisor app.js

# Troubleshooting

## can't connect to host

if console shows:

   warn  - error raised: Error: getaddrinfo ENOENT

check that your config.json host entry matches your hostname.

Otherwise, make sure that the IP the server is listening to matches what your client is trying to connect to.

## Copyright and license notice

This software has been developed by:

Shyu Lee shyul@lophilo.com (Lophilo hardware engineering)
Ricky Ng-Adam rngadam@lophilo.com (Lophilo software engineering)

Copyright (C) 2012 Lophilo

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.