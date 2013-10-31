var wharfie = require('./wharfie');
var helpers = exports;

helpers.parse_args = function (args, require_cb) {
  var callback;
  var params = {};

  if (require_cb) {
    callback = args.pop();
    if (typeof callback !== "function") {
      var err = new Error("Invalid callback function: " + callback);
      return [err];
    }
  }

  for (var k in args) {
    var current = args[k];
    var kv;
    if (typeof current === "string" && (kv = current.split("=")) && kv[1]) {
      try {
        kv[1] = JSON.parse(kv[1]);
      } catch (ex) {}
      params[kv[0]] = kv[1];
    }
  }

  return [null, params, callback];
};

helpers.generic_cb = function (callback) {
  return function (err, body) {
    if (err) {
      return callback(err);
    }
    // iterating and showing names would be better
    wharfie.inspect.putObject(body, {
      password: function (line) {
        var password = line.match(/password.*\:\s(.*)$/)[1];
        return line.replace(password, "'********'");
      }
    }, 2);
    callback();
  };
};

helpers.saveConfig = function (wharfie) {
  var config = wharfie.config;

  return function (callback) {
    config.save(function (err) {
      if (err) {
        wharfie.showError.apply(
          wharfie, [wharfie.argv._[0]].concat(err));
      }
      callback(err);
    });
  };
};
