var fs = require('fs'),
  path = require('path');

var wharfie = require('../wharfie'),
  helpers = require('../helpers'),
  config = wharfie.config,
  saveConfig = helpers.saveConfig(wharfie),
  provider = exports;

//
// mock provider is for testing, whatevs. dont judge!
//
var supportedProviders = ['digitalocean', 'mock'];

provider.list = function () {
  var providers = config.get('providers') || {};

  wharfie.inspect.putObject(providers, {
    apiKey: function (line) {
      var key = line.match(/apiKey.*\:\s(.*)$/)[1];
      return line.replace(key, "'********'");
    }
  }, 2);

  var args = helpers.parse_args([].slice.call(arguments, 0), true);
  var params = args[1];
  var callback = args[2];

  callback();
};

provider.add = function (name, clientKey, apiKey) {
  if (typeof name === "function") {
    return name(new Error("You didn't provide a provider name."));
  }

  if (typeof clientKey === "function") {
    return clientKey(new Error("You didn't provide an client id."));
  }

  if (typeof apiKey === "function") {
    return apiKey(new Error("You didn't provide an api key."));
  }

  var args = helpers.parse_args([].slice.call(arguments, 0), true);
  var params = args[1];
  var callback = args[2];

  if (!~supportedProviders.indexOf(name)) {
    return callback(new Error(name + " is not a supported provider. Try " + supportedProviders.join(', ')));
  }

  config.set('providers:' + name, {
    clientKey: clientKey,
    apiKey: apiKey
  });

  //
  // if don't have a provider set
  // we use this as the current provider
  //
  // this saves us one new command to change the provider
  // to whatever it is we added
  //
  if (!config.get('provider')) {
    config.set('provider', name);
  }

  saveConfig(callback);
};

provider.use = function (name) {
  var providers = config.get('providers') || {};

  if (typeof name === "function") {
    return name(new Error("You didn't provide a provider name."));
  }

  var args = helpers.parse_args([].slice.call(arguments, 0), true);
  var params = args[1];
  var callback = args[2];

  if (providers[name]) {
    config.set('provider', name);
    config.set('providers:' + name, providers[name]);
    saveConfig(callback);
  } else {
    return callback(new Error('Provider not found. Try ' + Object.keys(providers).join(', ')));
  }
};

provider.delete = function (name) {
  if (typeof name === "function") {
    return name(new Error("You didn't provide a provider name."));
  }

  var args = helpers.parse_args([].slice.call(arguments, 0), true);
  var params = args[1];
  var callback = args[2];

  //
  // remove the provider from in use if removed
  //
  if (name === config.get('provider')) {
    config.clear('provider');
  }

  config.clear('providers:' + name);
  saveConfig(callback);
};

provider.usage = [
  '',
  '`wharfie provider *` commands allow you to edit your',
  'local wharfie configuration file. Valid commands are:',
  '',
  'wharfie provider use <name>',
  'wharfie provider add <name> <ip> ...',
  'wharfie provider delete <name>',
  'wharfie provider list'
];
