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
    ss.rpc('auth.logout', function(res) {
        console.log('logged out');
        model.user.username("not logged in");
    });
}


exports.edit = function(app) {
    console.log('editing doc');
    ss.rpc('cloud9.edit', app.name, function(url) {
        console.log(url);
        window.open(url);
    });
}

exports.run = function(app) {
    console.log('running app ' + app);
    ss.rpc('apps.run', app.name, function(err, url) {
        if(!err) {
            console.log(url);
            window.open(url);            
        } else {
            console.log('error: ' + err);
        }
    });
}

exports.rm = function(app) {
    console.log('deleting app');
    ss.rpc('apps.rm', app.name, function(res) {
        console.log(res);
        refreshApps();
    });
}

var AppsListModel = function () {
    // this.itemToAdd = ko.observable("");
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
    'apps': new AppsListModel(),
    'stats': new StatsModel(),
    'repos': new ReposModel(),
    'user': new UserModel()
};

function refreshSystemVersions() {
    ss.rpc('system.versions', function(versions) {
        console.log("versions received");
        model.versions.items(versions);
    });
}

function refreshApps() {
    ss.rpc('apps.list', function(apps) {
        console.log("application list received");
        model.apps.items(apps);
    });    
}


function refreshRepos() {
    ss.rpc('github.repositories', function(repos) {
        console.log("repositories received");   
        if(!repos) {
            console.log('error retrieving repos (not authenticated?)');
        } else {
            model.repos.items(repos);    
        }
        
    });    
}

refreshSystemVersions();
refreshApps();
refreshRepos();

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
    
ss.rpc('auth.current', function(username) {
    console.log('current user ' + username);
    if(username == null) {
        username = "not logged in";
    }
    model.user.username(username);
}); 


ko.applyBindings(model);    

var myvalues = [];

function update() {
    ss.rpc('system.loadavg', function(res) {
    myvalues.push(res.one);
    if(myvalues.length > 10)
      myvalues.shift();
    $('.dynamicsparkline').sparkline(myvalues);
    });
    ss.rpc('system.uptime', function(res) {
    	model.stats.process(res.process);
    	model.stats.system(res.system);
    });    
}

clearInterval(update);
setInterval(update, 5000);


console.log('mc loaded');