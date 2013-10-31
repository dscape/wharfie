/* jslint node: true */

var fs = require('fs');
var join = require('path').join;
var nixt = require('nixt');

var wharfie = require('./command');

describe('wharfie#usage', function() {
  it('makes sure usage works', function(done) {
    nixt({ colors: false })
      .run(wharfie)
      .stdout(/Docker for all your servers/)
      .end(done);
  });
});