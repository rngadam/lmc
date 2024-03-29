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

function logger(model, id, err) {
  console.log('LOGGING:' + err);
  try {
    model.items.push({errstring: '' + err});
    $(id).show();
    setTimeout(function() {
      $(id).alert('close');
    }, 5000);
  } catch (err) {
    console.log('error in the error handler! ' + err.stack);
  }
}

// TODO: add matcher for all incoming messages
function checkError(err) {
  if(err.match(/Access denied/)) {
     model.user.refreshUser();
  }
}

var AppsModel = function() {
  var self = this;
  self.items = ko.observableArray();
  self.name = ko.observable();

  self.refresh = function() {
    ss.rpc('apps.list', function(err, apps) {
      if (err) { return logError(err); }
      console.log('application list received');
      self.items(apps);
    });
  }

  self.run = function(app) {
    logInfo('running app ' + app.name);
    ss.rpc('apps.run', app.name, function(err, url) {
      if (err) { return logError(err); }
      logSuccess('opening ' + url);
      window.open(url);
    });
  }

  self.edit = function(app) {
    logInfo('editing doc ' + app.name);
    ss.rpc('cloud9.edit', app.name, function(err, url) {
      if (err) { return logError(err); }
      logSuccess('opening ' + url);
      window.open(url);
    });
  }

  self.rm = function(app) {
    logInfo('deleting app ' + app.name);
    ss.rpc('apps.rm', app.name, function(err, res) {
      if (err) { return logError  (err); }
      logSuccess(res);
      self.refresh();
    });
  }
}

var ProcessesModel = function() {
  var self = this;
  self.items = ko.observableArray();
  self.refresh = function() {
    ss.rpc('processes.list', function(err, processes) {
      if (err) { return logError(err); }
      console.log('process list received');
      self.items(processes);
    });
  }
  self.kill = function(process) {
    logInfo('killing process ' + process.id);
    ss.rpc('processes.kill', process.id, function(err, res) {
      if (err) { return logError(err); }
      logSuccess(res);
      self.refresh();
    });
  };
  self.status = function(process) {
    console.log('status process');
    ss.rpc('processes.status', process.id, function(err, res) {
      if (err) { return logError(err); }
      logSuccess(res);
    });
  };
  self.open = function(process) {
    logInfo('opening process ' + process.id);
    ss.rpc('processes.open', process.id, function(err, url) {
      if (err) { return logError(err); }
      logSuccess('opening ' + url);
      window.open(url);
    });
  };

};

var StatsModel = function() {
  var self = this;
  self.process = ko.observable();
  self.system = ko.observable();
  self.history = [];
  self.processDisplay = ko.computed(function() {
    return Math.round(self.process()) + 's';
  }, self),

  self.systemDisplay = ko.computed(function() {;
    return Math.round(self.system()) + 's';
  }, this);

  self.refreshLoadAvg = function() {
    ss.rpc('system.loadavg', function(err, res) {
      if (err) { return logError(err); }
      self.history.push(res.one);
      if (self.history.length > 10)
        self.history.shift();
    });
  }

  self.refreshUptime = function() {
    ss.rpc('system.uptime', function(err, res) {
      if (err) { return logError(err); }
      self.process(res.process);
      self.system(res.system);
    });
  }
};

// list of items with latest
function createItemsLatest() {
  this.items = ko.observableArray();
  this.latest = ko.computed(function() {
    if (this.items().length > 0) {
      var last = this.items()[this.items().length - 1];
      //console.log('last error: ' + console.dir(last));
      return last;
    }
    return 'No items';
  }, this);
};

var ErrorsModel = createItemsLatest;
var SuccessModel = createItemsLatest;

var StatusModel = function() {
  this.connected = ko.observable(true);
};

var VersionsModel = function() {
  var self = this;
  self.items = ko.observableArray();
  self.refresh = function () {
    ss.rpc('system.versions', function(err, versions) {
      if (err) { return logError(err); }
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
      if (err) { return logError(err);s }
      self.username('not logged in');
      logSuccess('logged out');
    });
  }
  self.refreshUser = function() {
    ss.rpc('auth.current', function(err, username) {
      if (err) { return logError(err); }
      console.log('current user ' + username);
      if (username == null) {
        username = 'not logged in';
      }
      self.username(username);
    });
  }
};

// some form of inheritance for the next two?

var ExamplesModel = function() {
  var self = this;
  self.items = ko.observableArray();
  self.selectedItem = ko.observable();
  self.name = ko.observable();

  self.createApp = function() {
    logSuccess("new app name " + this.name() + " from " + self.selectedItem().ssh_url);
    $("#new-app").modal('hide');
    ss.rpc('git.checkout', self.selectedItem().ssh_url, self.name(), function(err, result) {
      if (err) { return logError(err); }
      model.apps.refresh();
      logSuccess(result);
    });
  }

  self.selectItem = function(item) {
    console.log('selecting ' + item);
    self.selectedItem(item);
  }
  self.refresh = function() {
    ss.rpc('github.examples', function(err, repos) {
      if (err) { return logError(err); }
      if(!repos && !repos.length) {
        return logError('No examples available!');
      }
      self.items(repos);
    });
  }
  self.flush = function() {
    ss.rpc('github.flushExamples', function(err, repos) {
      if (err) { return logError(err); }
      self.refresh();
    });
  }
};

var ReposModel =  function() {
  var self = this;
  self.items = ko.observableArray();
  self.selectedItem = ko.observable();
  self.selectItem = function(item) {
    console.log('selecting ' + item);
    self.selectedItem(item);
  }
  self.refresh = function() {
    ss.rpc('github.repositories', function(err, repos) {
      if (err) { return logError(err); }
      console.log('repositories received');
      self.items(repos);
    });
  }
  self.flush = function() {
    ss.rpc('github.flushRepositories', function(err, repos) {
      if (err) { return logError(err); }
      self.refresh();
    });
  }
  self.checkoutRepository = function() {
    logInfo(
      'checking out ' + self.selectedItem().full_name
      + ' using sshurl ' + self.selectedItem().ssh_url);
    ss.rpc('git.checkout', self.selectedItem().ssh_url, function(err, result) {
      if (err) { return logError(err); }
      logSuccess(result);
      self.refresh();
      model.apps.refresh();
    });
  }
}

var model;

var logError = console.log;
var logSuccess = console.log;
var logInfo = console.log;

ss.rpc('system.info', function(err, system) {
  model = {
    'apps': new AppsModel(),
    'errors': new ErrorsModel(),
    'info': new ErrorsModel(),
    'examples': new ExamplesModel(),
    'processes': new ProcessesModel(),
    'repos': new ReposModel(),
    'stats': new StatsModel(),
    'status': new StatusModel(),
    'success': new ErrorsModel(),
    'system': ko.mapping.fromJS(system),
    'user': new UserModel(),
    'versions': new VersionsModel(),
  };
  console.dir(model);
  console.dir(system);

  logError = logger.bind(null, model.errors, '#alert-dialog');
  logInfo = logger.bind(null, model.info, '#info-dialog');
  logSuccess = logger.bind(null, model.success, '#success-dialog');

  // initial model value
  model.user.refreshUser();
  model.stats.refreshLoadAvg();
  model.stats.refreshUptime();
  model.versions.refresh();

  ko.applyBindings(model);


  ss.server.on('disconnect', function() {
    model.status.connected(false);
  });

  ss.server.on('reconnect', function() {
    model.status.connected(true);
  });

  console.log('mc loaded');

  /* disabled
  clearInterval(model.stats.refreshLoadAvg);
  clearInterval(model.stats.refreshUptime);
  setInterval(model.stats.refreshLoadAvg, 5000);
  setInterval(model.stats.refreshUptime, 5000);
  */

});

