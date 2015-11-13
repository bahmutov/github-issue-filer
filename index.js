var config = require('./src/config');
var la = require('lazy-ass');
var check = require('check-more-types');
var moment = require('moment');
var R = require('ramda');

var matcher = require('github-issue-matcher');
var getIssues = require('github-issue-proxy');

var options = {
  user: 'bahmutov',
  repo: 'gt'
};

var newIssue = {
  title: 'Investigate stack reported on crash',
  body: 'something something blue'
};

function formatLabels(issue) {
  return R.map(R.prop('name'), issue.labels).join(',');
}

function printFoundIssue(issue) {
  var important = R.pick([
    'id', 'number', 'title', 'body',
    'created_at', 'updated_at',
    'state', 'labels', 'comments'
  ], issue);
  important.labels = formatLabels(important);
  important.created_at = moment(important.created_at).toString();
  important.updated_at = moment(important.updated_at).toString();
  console.log(important);
}

getIssues(options)
  .then(function (existingIssues) {
    return matcher(existingIssues, newIssue);
  })
  .then(function (found) {
    // do something, like add comment
    console.log('found matching issue');
    printFoundIssue(found);
  }, function () {
    // could not find existing issue
    // file new one?
    console.log('could not find existing issue');
  });
