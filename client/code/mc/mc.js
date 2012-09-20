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

var AppsListModel = function () {
    // this.itemToAdd = ko.observable("");
    this.allItems = ko.observableArray([
        { name: "LED demo", icon: "/icons/nodejs.svg", url: "#run-app" },
        { name: "PWM motor driver", icon: "/icons/nodejs.svg", url: "#run-app" },
        { name: "ADC acquisition", icon: "/icons/nodejs.svg", url: "#run-app" },
        { name: "Interactive GPIO", icon: "/icons/nodejs.svg", url: "#run-app" },
        { name: "Bouncy ball", icon: "/icons/processing.svg", url: "#run-app" },
    ]);
    // this.selectedItems = ko.observableArray(["LED demo"]);                                // Initial selection
 
    // this.addItem = function () {
    //     if ((this.itemToAdd() != "") && (this.allItems.indexOf(this.itemToAdd()) < 0)) // Prevent blanks and duplicates
    //         this.allItems.push(this.itemToAdd());
    //     this.itemToAdd(""); // Clear the text box
    // };
 
    // this.removeSelected = function () {
    //     this.allItems.removeAll(this.selectedItems());
    //     this.selectedItems([]); // Clear selection
    // };
 
    // this.sortItems = function() {
    //     this.allItems.sort();
    // };
};
 

var ReposListModel = function () {
    this.organizations = ko.observableArray([
        { name: "rngadam", repos: [{name: 'example a'}, {name: 'example b'}]},
        { name: "Lophilo", repos: [{name: 'example a'}, {name: 'example b'}]},
        { name: "XinCheJian", repos: [{name: 'example a'}, {name: 'example b'}]},
    ]);
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

var versionsModel;
var model;

ss.rpc('system.versions', function(res) {
	console.log("versions received");
	versionsModel = ko.mapping.fromJS(res);
	model = {
		'versions': versionsModel,
		'apps': new AppsListModel(),
		'stats': new StatsModel(),
        'repos': new ReposListModel()
	};
	ko.applyBindings(model);
});

var myvalues = [];
//var myvalues = [10,8,5,7,4,4,1];
//$('.dynamicsparkline').sparkline(myvalues);

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
setInterval(update, 1000);

console.log('mc loaded');