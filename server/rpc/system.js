"use strict";

var os = require('os');
var fs = require('fs');

var versions = {
	data: [	
		{
			name: "Management Console", 
			version: "1.0" 
		},
		{
			name: "Hardware platform", 
			version: "version 1.0 (tabby)"
		},
		{
			name: "Operating system", 
			version: "Debian Wheezy 7.0"
		},
		{
			name: "Linux Kernel", 
			version: "3.4.4"
		},
		{
			name: "Kernel driver", 
			version: "1.0 (tabby)"
		}
	]
};

for(var k in process.versions) {
	versions.data.push({name: k, version: process.versions[k]});
}	
exports.actions = function(req, res, ss){

  // Easily debug incoming requests here
  //console.log(req);

  return {
    loadavg: function loadavg() {
      var values = os.loadavg();
      res({one: values[0], five: values[1], fifteen: values[2] });
    },
    versions: function version() {
    	res(versions);
    },
    uptime: function uptime() {
    	res({process: process.uptime(), system: os.uptime()});
    }    
  }
}
