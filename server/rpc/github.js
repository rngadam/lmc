var assert = require('assert');

var GitHubApi = require("github");

var github = new GitHubApi({
      version: "3.0.0"
});
assert(github, "Can't load Github API");

exports.actions = function(req, res, ss){

  // Easily debug incoming requests here
  //console.log(req);

  return {
    getRepositories: function getRepositories() {
      res({});
    }
  }
}