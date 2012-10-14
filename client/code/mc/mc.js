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


// Client Code

console.log('mc loading');


var AppsModel = function () {
    this.items = ko.observableArray();
};

var ProcessesModel = function () {
    this.items = ko.observableArray();
};

var StatsModel = function() {
    this.process = ko.observable();
    this.system = ko.observable();
    this.processDisplay = ko.computed(function() {
        return Math.round(this.process()) + "s";
    }, this),
    this.systemDisplay = ko.computed(function() {;
        return Math.round(this.system()) + "s";
    }, this)
};

var ErrorsModel = function() {
    this.items = ko.observableArray();
    this.latest = ko.computed(function() {
        return this.items[this.items.length-1];
    }, this)
};

var VersionsModel = function() {
    this.items = ko.observableArray();
};

var UserModel = function() {
    this.username = ko.observable("not logged in");
    this.pubkey = ko.observable("not available yet");
};

var ReposModel = function() {
    var self = this;
    self.items = ko.observableArray();
    self.selectedItem = ko.observable();
    self.selectItem = function(item) {
        console.log('selecting ' + item);
        self.selectedItem(item);
    }
};

var model = {
    'versions': new VersionsModel(),
    'apps': new AppsModel(),
    'processes': new ProcessesModel(),
    'stats': new StatsModel(),
    'repos': new ReposModel(),
    'user': new UserModel(),
    'errors': new ErrorsModel()
};

exports.checkoutRepository  = function() {
    console.log('checking out ' + model.repos.selectedItem().full_name);
    console.log('using sshurl ' + model.repos.selectedItem().ssh_url);
    ss.rpc('git.checkout', model.repos.selectedItem().ssh_url, function() {
        console.log('checkout completed');
        refreshApps();
    });
}

exports.logout = function() {
    console.log('logging out');
    ss.rpc('auth.logout', function(err, res) {
        if(err) { logError(err); return; }
        console.log('logged out');
        model.user.username("not logged in");
    });
}

exports.edit = function(app) {
    console.log('editing doc');
    ss.rpc('cloud9.edit', app.name, function(err, url) {
        if(err) { logError(err); return; }
        console.log(url);
        window.open(url);

    });
}

exports.run = function(app) {
    console.log('running app ' + app);
    ss.rpc('apps.run', app.name, function(err, url) {
        if(err) { logError(err); return; }
        console.log(url);
        window.open(url);
    });
}

exports.rm = function(app) {
    console.log('deleting app');
    ss.rpc('apps.rm', app.name, function(err, res) {
        if(err) { logError(err); return; }
        console.log(res);
        refreshApps();
    });
}

function refreshSystemVersions() {
    ss.rpc('system.versions', function(err, versions) {
        if(err) { logError(err); return; }
        console.log("versions received");
        model.versions.items(versions);
    });
}
exports.refreshSystemVersions = refreshSystemVersions;

function refreshApps() {
    ss.rpc('apps.list', function(err, apps) {
        if(err) { logError(err); return; }
        console.log("application list received");
        model.apps.items(apps);
    });
}
exports.refreshApps = refreshApps;

function refreshProcesses() {
    ss.rpc('apps.processes', function(err, processes) {
        if(err) { logError(err); return; }
        console.log("process list received");
        model.processes.items(processes);
    });
}
exports.refreshProcesses = refreshProcesses;

function refreshRepos() {
    ss.rpc('github.repositories', function(err, repos) {
        if(err) { logError(err); return; }
        console.log("repositories received");
        model.repos.items(repos);

    });
}
exports.refreshRepos = refreshRepos;

function refreshPubKey() {
    ss.rpc('git.pubkey', function(pubkey) {
        console.log('current pubkey ' + pubkey);
        if(pubkey == null) {
            pubkey = "not available";
        }
        model.user.pubkey(pubkey);
    });
}
exports.refreshPubKey = refreshPubKey;

ss.rpc('auth.current', function(err, username) {
    if(err) { logError(err); return; }
    console.log('current user ' + username);
    if(username == null) {
        username = "not logged in";
    }
    model.user.username(username);
});

function logError(err) {
    console.log(err);
    try {
        model.errors.items.push(err);
        $('#alert-dialog').modal('show')
    } catch(err) {
        console.log('error in the error handler!');
    }
}

ko.applyBindings(model);

var myvalues = [];

function update() {
    ss.rpc('system.loadavg', function(err, res) {
        if(err) { logError(err); return; }
        myvalues.push(res.one);
        if(myvalues.length > 10)
          myvalues.shift();
        $('.dynamicsparkline').sparkline(myvalues);
    });
    ss.rpc('system.uptime', function(err, res) {
        if(err) { logError(err); return; }
    	model.stats.process(res.process);
    	model.stats.system(res.system);
    });
}

clearInterval(update);
setInterval(update, 5000);

console.log('mc loaded');