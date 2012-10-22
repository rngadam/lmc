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

console.log('mc loading');

var AppsModel = function() {
  var self = this;
  self.items = ko.observableArray();
  self.name = ko.observable();

  self.createApp = function() {
    console.log("new app name %s", this.name());
    $("#new-app").modal('hide');
  }

  self.refresh = function() {
    ss.rpc('apps.list', function(err, apps) {
      if (err) { logError(err); return; }
      console.log('application list received');
      self.items(apps);
    });
  }

  self.run = function(app) {
    console.log('running app ' + app);
    ss.rpc('apps.run', app.name, function(err, url) {
      if (err) { logError(err); }
      if (url) {
        console.log(url);
        window.open(url);
      }
    });
  }

  self.edit = function(app) {
    console.log('editing doc');
    ss.rpc('cloud9.edit', app.name, function(err, url) {
      if (err) { logError(err); return; }
      console.log(url);
      window.open(url);
    });
  }

  self.rm = function(app) {
    console.log('deleting app');
    ss.rpc('apps.rm', app.name, function(err, res) {
      if (err) { logError(err); return; }
      console.log(res);
      self.refresh();
    });
  }
}

var ProcessesModel = function() {
  var self = this;
  self.items = ko.observableArray();
  self.refresh = function() {
    ss.rpc('processes.list', function(err, processes) {
      if (err) { logError(err); return; }
      console.log('process list received');
      self.items(processes);
    });
  }
  self.kill = function(process) {
    console.log('killing process');
    ss.rpc('processes.kill', process.id, function(err, res) {
      if (err) { logError(err); return; }
      console.log(res);
      self.refresh();
    });
  };
  self.status = function(process) {
    console.log('status process');
    ss.rpc('processes.status', process.id, function(err, res) {
      if (err) { logError(err); return; }
      console.log(res);
    });
  };
  self.open = function(process) {
    console.log('opening process');
    ss.rpc('processes.open', process.id, function(err, url) {
      if (err) { logError(err); return; }
      window.open(url);
    });
  };

};

var StatsModel = function() {
  var self = this;
  self.process = ko.observable();
  self.system = ko.observable();
  self.myvalues = [];
  self.processDisplay = ko.computed(function() {
    return Math.round(self.process()) + 's';
  }, self),

  self.systemDisplay = ko.computed(function() {;
    return Math.round(self.system()) + 's';
  }, this);

  self.refreshLoadAvg = function() {
    ss.rpc('system.loadavg', function(err, res) {
      if (err) { logError(err); return; }
      // TODO: move to HTML binding
      self.myvalues.push(res.one);
      if (self.myvalues.length > 10)
        self.myvalues.shift();
      $('.dynamicsparkline').sparkline(self.myvalues);
    });
  }

  self.refreshUptime = function() {
    ss.rpc('system.uptime', function(err, res) {
      if (err) { logError(err); return; }
      self.process(res.process);
      self.system(res.system);
    });
  }
};

var ErrorsModel = function() {
  this.items = ko.observableArray();
  this.latest = ko.computed(function() {
    if (this.items().length > 0) {
      var last = this.items()[this.items().length - 1];
      console.log('last error: ' + console.dir(last));
      return last;
    }
    return 'No error!';
  }, this);
};

var StatusModel = function() {
  this.connected = ko.observable(true);
};

var VersionsModel = function() {
  var self = this;
  self.items = ko.observableArray();
  self.refresh = function () {
    ss.rpc('system.versions', function(err, versions) {
      if (err) { logError(err); return; }
      console.log('versions received');
      self.items(versions);
    });
  }

};

var UserModel = function() {
  var self = this;
  self.username = ko.observable('not logged in');
  self.pubkey = ko.observable('not available yet');
  self.refreshPubKey = function() {
    ss.rpc('git.pubkey', function(err, pubkey) {
      console.log('current pubkey ' + pubkey);
      if (pubkey == null) {
        pubkey = 'not available';
      }
      self.pubkey(pubkey);
    });
  }
  self.logout = function() {
    console.log('logging out');
    ss.rpc('auth.logout', function(err, res) {
      if (err) { logError(err); return; }
      console.log('logged out');
      self.username('not logged in');
    });
  }
  self.refreshUser = function() {
    ss.rpc('auth.current', function(err, username) {
      if (err) { logError(err); return; }
      console.log('current user ' + username);
      if (username == null) {
        username = 'not logged in';
      }
      self.username(username);
    });
  }
};

var ReposModel = function() {
  var self = this;
  self.items = ko.observableArray();
  self.selectedItem = ko.observable();
  self.selectItem = function(item) {
    console.log('selecting ' + item);
    self.selectedItem(item);
  }

  self.refresh = function() {
    ss.rpc('github.repositories', function(err, repos) {
      if (err) { logError(err); return; }
      console.log('repositories received');
      self.items(repos);
    });
  }

  self.checkoutRepository = function() {
    console.log('checking out ' + self.selectedItem().full_name);
    console.log('using sshurl ' + self.selectedItem().ssh_url);
    ss.rpc('git.checkout', self.selectedItem().ssh_url, function(err, result) {
      if (err) { logError(err); return; }
      console.log(result);
      self.refresh();
      model.apps.refresh();
    });
  }
}

var model = {
  'versions': new VersionsModel(),
  'apps': new AppsModel(),
  'processes': new ProcessesModel(),
  'stats': new StatsModel(),
  'repos': new ReposModel(),
  'user': new UserModel(),
  'errors': new ErrorsModel(),
  'status': new StatusModel()
};


function logError(err) {
  console.log('LOGGING:' + err);
  try {
    model.errors.items.push({errstring: '' + err});
    $('#alert-dialog').show();
  } catch (err) {
    console.log('error in the error handler! ' + err.stack);
  }
  if(err.match(/Access denied/)) {
    model.user.refreshUser();
  }
}

ss.server.on('disconnect', function() {
  model.status.connected(false);
});

ss.server.on('reconnect', function() {
  model.status.connected(true);
});

// initial model value
model.user.refreshUser();

ko.applyBindings(model);

clearInterval(model.stats.refreshLoadAvg);
clearInterval(model.stats.refreshUptime);
setInterval(model.stats.refreshLoadAvg, 5000);
setInterval(model.stats.refreshUptime, 5000);


console.log('mc loaded');
