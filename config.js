/* jslint node: true */
var path = require('path'),
    fs = require('fs'),
    wharfie = require('./wharfie');

var _load = wharfie.config.load;

try {
  wharfie.config.file({
    file: wharfie.argv.wharfieconf || wharfie.argv.q || '.wharfieconf',
    dir: process.env.HOME,
    search: true
  });
}
catch (err) {
  console.log('Error parsing ' + wharfie.config.stores.file.file.magenta);
  console.log(err.message);
  console.log('');
  console.log('This is most likely not an error in wharfie.');
  console.log('Please check your wharfieconf and try again.');
  console.log('');
  process.exit(1);
}


var defaults = {
  colors: true,
  debug: true,
  loglevel: 'info',
  loglength: 110,
  root: process.env.HOME,
  userconfig: '.wharfieconf',
  modes: {
    exec: 0777 & (~022),
    file: 0666 & (~022),
    umask: 022
  }
};

wharfie.config.defaults(defaults);

wharfie.use(require('flatiron-cli-config'), {
  store: 'file',
  restricted: [
    'root',
    'userconfig'
  ],
  before: {
    list: function () {
      var configFile = wharfie.config.stores.file.file;

      var display = [
        'Here is your ' + configFile.grey + ' file:',
        'If you\'d like to change a property try:',
        'wharfie config set <key> <value>'
      ];

      display.forEach(function (line) {
        wharfie.log.help(line);
      });

      return true;
    }
  }
});


wharfie.config.load = function (callback) {
  _load.call(wharfie.config, function (err, store) {
    if (err) {
      return callback(err, true, true, true);
    }

    wharfie.config.set('userconfig', wharfie.config.stores.file.file);

    callback(null, store);
  });
};