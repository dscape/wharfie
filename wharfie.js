/* jslint node: true */

var path = require('path'),
  url = require('url'),
  flatiron = require('flatiron');

var wharfie = module.exports = new flatiron.App({
  directories: {
    root: path.join(process.env.HOME, '.wharfie')
  }
});

wharfie.use(require('flatiron-cli-version'));

wharfie.use(flatiron.plugins.cli, {
  usage: require('./commands/usage'),
  source: path.join(__dirname, 'wharfie', 'commands'),
});

wharfie.started = false;
wharfie.commands = require('./commands');
wharfie.prompt.override = wharfie.argv;

/*
wharfie.prompt.properties = wharfie.common.mixin(
  wharfie.prompt.properties, {
    "yesno": {
      "name": 'yesno',
      "message": 'are you sure?',
      "validator": /y[es]?|n[o]?/,
      "warning": 'Must respond yes or no',
      "default": 'no'
    },
    "endpoint": {
      "name": "endpoint",
      "message": "Server",
      "current": "196.138.107.1"
    }
  }
);
*/

require('./config');
require('./aliases');

wharfie.welcome = function () {
  wharfie.log.info('Welcome to ' + 'wharfie'.grey);
  wharfie.log.info('It worked if it ends with ' + 'wharfie'.grey + ' ok'.green.bold);
};

wharfie.start = function (callback) {
  wharfie.init(function (err) {
    if (err) {
      wharfie.welcome();
      callback(err);
      return wharfie.showError.apply(null, ["wharfie"].concat(arguments));
    }

    wharfie.welcome();

    var endpoint = wharfie.config.get('endpoint') || wharfie.config.get('endpoints:current');
    if (!endpoint) {
      return wharfie.prompt.get(["endpoint"], function (err, stdin) {
        if (err) {
          callback(err);
          return wharfie.showError.apply(
            wharfie, [wharfie.argv._[0]].concat(arguments));
        }

        //
        // only accept ip addresses
        //
        if (typeof stdin.endpoint === "string" &&
          /^(?:\d{1,3}\.){3}\d{1,3}$/.test(stdin.endpoint)) {
          var endpoint = stdin.endpoint;
          wharfie.config.set('endpoint', endpoint);
          wharfie.config.set('endpoints:current', endpoint);
          wharfie.config.save(function (err) {
            if (err) {
              callback(err);
              return wharfie.showError.apply(
                wharfie, [wharfie.argv._[0]].concat(err));
            }

            wharfie.log.info('Configured endpoint ' + endpoint.magenta);
            return wharfie.exec(wharfie.argv._, callback);
          });
        } else {
          err = new Error("Bad IP Address");
          callback(err);
          return wharfie.showError.apply(
            wharfie, [wharfie.argv._[0]].concat(err));
        }
      });
    }
    return wharfie.exec(wharfie.argv._, callback);
  });
};

wharfie.exec = function (command, callback) {
  function execCommand(err) {
    if (err) {
      return callback(err);
    }

    wharfie.log.info('Executing command ' + command.join(' ').magenta);
    wharfie.router.dispatch('on', command.join(' '), wharfie.log,
      function (err, shallow) {
        if (err) {
          callback(err);
          return wharfie.showError(command.join(' '), err, shallow);
        }

        callback.apply(null, arguments);
      });
  }

  return !wharfie.started ? wharfie.setup(execCommand) : execCommand();
};

wharfie.setup = function (callback) {
  if (wharfie.started === true) {
    return callback();
  }

  var endpoint = wharfie.config.get('endpoint');

  wharfie.started = true;

  callback();
};

wharfie.showError = function (command, err, shallow, skip) {
  var stack;

  wharfie.log.error('Error running command ' + command.magenta);

  if (err.message) {
    wharfie.log.error(err.message);
  }

  wharfie.inspect.putObject(err, {
    password: function (line) {
      var password = line.match(/password.*\:\s(.*)$/)[1];
      return line.replace(password, "'********'");
    }
  }, 2);

  wharfie.log.info('wharfie '.grey + 'not ok'.red.bold);
};