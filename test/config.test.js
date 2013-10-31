/* jslint node: true */

var fs = require('fs');
var join = require('path').join;
var nixt = require('nixt');

var wharfie = require('./command');

describe('wharfie#config', function() {
  it('make sure wharfie config gives useful usage info', function(done) {
    nixt({ colors: false })
      .run(wharfie + ' config')
      .stdout(/wharfie config list/)
      .end(done);
  });
});

describe('wharfie#config-list', function() {
  it('listing config information should work', function(done) {
    nixt({ colors: false })
      .run(wharfie + ' config list')
      .stdout(/endpoints/)
      .end(done);
  });
});