"use strict";
// Client Code

console.log('test load');


var ReposListModel = function () {
    this.organizations = ko.observableArray([
        { name: "rngadam", repos: [{name: 'example a'}, {name: 'example b'}]},
        { name: "Lophilo", repos: [{name: 'example a'}, {name: 'example b'}]},
        { name: "XinCheJian", repos: [{name: 'example a'}, {name: 'example b'}]},
    ]);
};
 
var model = {
	'repos': new ReposListModel()
};
 ko.applyBindings(model);