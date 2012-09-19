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

## startup

 node-mon app.js

 open localhost:3000 in your browser

## adding an app

* create directory and file ./client/code/<appname>/<appname>.js
* create file ./client/code/<appname>/entry.js (copy from other existing)
* make sure the require in entry.js points to <appname>
* create file ./client/views/<appname>
* modify ./app.js to ss.client.define your app dependencies and ss.http.route to route a URL to your app.
* test (node-mon and socketstream should automatically reload on app change)

## Copyright and license notice

This software has been developed by:

Shyu Lee shyul@lophilo.com (Lophilo hardware engineering)
Ricky Ng-Adam rngadam@lophilo.com (Lophilo software engineering)

Copyright (C) 2012 Lophilo

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.