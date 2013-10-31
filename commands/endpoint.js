/* jslint node: true */

var fs = require('fs');
var path = require('path');
var wharfie = require('../wharfie');
var helpers = require('../helpers');
var config = wharfie.config;

var endpoint = exports;

endpoint.list = function () {
  var endpoints = config.get('endpoints') || {};

  wharfie.inspect.putObject(config.stores.file.store.endpoints);

  var args = helpers.parse_args([].slice.call(arguments, 0), true);
  var params = args[1];
  var callback = args[2];

  callback();
};

endpoint.add = function (name, ip) {
  var err;

  if(typeof name === "function") {
    err = new Error("You didn't provide an endpoint name.");
    return name(err);
  }

  if(typeof ip === "function") {
    err = new Error("You didn't provide an endpoint ip.");
    return ip(err);
  }

  var args = helpers.parse_args([].slice.call(arguments, 0), true);
  var params = args[1];
  var callback = args[2];

  config.set('endpoints:' + name, ip);
  config.save(function (err) {
    if (err) {
      callback(err);
      return wharfie.showError.apply(
        wharfie, [wharfie.argv._[0]].concat(err));
    }
    callback();
  });
};

endpoint.use = function (name) {
  var err;
  var endpoints = config.get('endpoints') || {};

  if(typeof name === "function") {
    err = new Error("You didn't provide an endpoint name.");
    return name(err);
  }

  var args = helpers.parse_args([].slice.call(arguments, 0), true);
  var params = args[1];
  var callback = args[2];

  if(endpoints[name]) {
    config.set('endpoint', endpoints[name]);
    config.set('endpoints:current', endpoints[name]);
    config.save(function (err) {
      if (err) {
        callback(err);
        return wharfie.showError.apply(
          wharfie, [wharfie.argv._[0]].concat(err));
      }
      callback();
    });
  } else {
    err = new Error('Endpoint name not found');
    return callback(err);
  }
};

endpoint.delete = function (name) {
  var err;

  if(typeof name === "function") {
    err = new Error("You didn't provide an endpoint name.");
    return name(err);
  }

  var args = helpers.parse_args([].slice.call(arguments, 0), true);
  var params = args[1];
  var callback = args[2];

  if(name === 'current') {
    config.clear('endpoint');
  }

  config.clear('endpoints:' + name);
  config.save(function (err) {
    if (err) {
      callback(err);
      return wharfie.showError.apply(
        wharfie, [wharfie.argv._[0]].concat(err));
    }
    callback();
  });
};

endpoint.usage = [
  '',
  '`wharfie endpoint *` commands allow you to edit your',
  'local wharfie configuration file. Valid commands are:',
  '',
  'wharfie endpoint use <name> ...',
  'wharfie endpoint add <name> <ip> ...',
  'wharfie endpoint delete <name>',
  'wharfie endpoint list'
];