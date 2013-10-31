var fs = require('fs');
var path = require('path');
var wharfie = require('../wharfie');
var helpers = require('../helpers');
var config = wharfie.config;

var saveConfig = helpers.saveConfig(wharfie);
var server = exports;

server.list = function () {
  var servers = config.get('servers') || {};

  wharfie.inspect.putObject(servers);

  var args = helpers.parse_args([].slice.call(arguments, 0), true);
  var params = args[1];
  var callback = args[2];

  callback();
};

server.create = function (name) {
  if (typeof name === "function") {
    return name(new Error("You didn't provide a server name."));
  }

  var args = helpers.parse_args([].slice.call(arguments, 0), true);
  var params = args[1];
  var callback = args[2];

  //
  // bootstrap the server, get the ip
  //
  config.set('servers:' + name, "ip");

  saveConfig(callback);
};

server.use = function (name) {
  var servers = config.get('servers') || {};

  if (typeof name === "function") {
    return name(new Error("You didn't provide a server name."));
  }

  var args = helpers.parse_args([].slice.call(arguments, 0), true);
  var params = args[1];
  var callback = args[2];

  if (servers[name]) {
    config.set('server', servers[name]);
    config.set('servers:current', servers[name]);
    config.save(function (err) {
      if (err) {
        callback(err);
        return wharfie.showError.apply(
          wharfie, [wharfie.argv._[0]].concat(err));
      }
      callback(err);
    });
  } else {
    return callback(new Error('Endpoint name not found'));
  }
};

server.delete = function (name) {
  var err;

  if (typeof name === "function") {
    err = new Error("You didn't provide an server name.");
    return name(err);
  }

  var args = helpers.parse_args([].slice.call(arguments, 0), true);
  var params = args[1];
  var callback = args[2];

  if (name === 'current') {
    config.clear('server');
  }

  config.clear('servers:' + name);
  config.save(function (err) {
    if (err) {
      callback(err);
      return wharfie.showError.apply(
        wharfie, [wharfie.argv._[0]].concat(err));
    }
    callback();
  });
};

server.usage = [
  '',
  '`wharfie server *` commands allow you to edit your',
  'local wharfie configuration file. Valid commands are:',
  '',
  'wharfie server use <name> ...',
  'wharfie server add <name> <ip> ...',
  'wharfie server delete <name>',
  'wharfie server list'
];
