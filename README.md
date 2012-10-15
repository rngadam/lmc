# The Lophilo Main Controller (mc)

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

## installation

Should be installed as /home/lophilo/lophilo/lmc

We want to run as a non-root user for additional safety. Many server-side services also expect running as a user, not root.

Note: for developers, we recommend exporting your $HOME/lophilo to NFS and mounting the NFS drive on lophilo.

## startup

Adapt the script start_lophilo.sh to your needs.

 open lophilo.local in your browser

## Dependencies

depends on the following:

	apt-get install libpam0g-dev
	apt-get install redis-server

npm global packages dependencies:

	npm install -g nodemon

## Binary npm

Some npm with compiled modules from just being a copy from the host system:

* mmap
* socket.io

## running as a non-root user

non-root user can't bind ports below 1024 (including HTTP port 80). Use iptables to redirect:

	sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
	sudo iptables -t nat -A OUTPUT --src 0/0 --dst 127.0.0.1 -p tcp --dport 80 -j REDIRECT --to-ports 8080

# Development

## adding an app

lmc is based on the SocketStream framework. This means you can create additional apps as part of the lmc directory structure:

* create directory and file ./client/code/<appname>/<appname>.js
* create file ./client/code/<appname>/entry.js (copy from other existing)
* make sure the require in entry.js points to <appname>
* create file ./client/views/<appname>
* modify ./app.js to ss.client.define your app dependencies and ss.http.route to route a URL to your app.
* test (node-mon and socketstream should automatically reload on app change)

## reload on client changes

use nodemon (or supervisor):

	nodemon app.js

Note: this only reloads on changes with client/; for server-side see the bug:

https://github.com/socketstream/socketstream/issues/310

# Troubleshooting

## can't connect to host

if console shows:

   warn  - error raised: Error: getaddrinfo ENOENT

check that your config.json host entry matches your hostname.

Otherwise, make sure that the IP the server is listening to matches what your client is trying to connect to. Use 0.0.0.0 to bind to any IP.

## Copyright and license notice

This software has been developed by:

Shyu Lee shyul@lophilo.com (Lophilo hardware engineering)
Ricky Ng-Adam rngadam@lophilo.com (Lophilo software engineering)

Copyright (C) 2012 Lophilo

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.