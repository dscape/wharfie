/* jslint node: true */

var fs = require('fs');
var join = require('path').join;
var nixt = require('nixt');

var wharfie = require('./command');

describe('wharfie#endpoint', function() {
  it('should give usage information if badly invoked', function(done) {
    nixt({ colors: false })
      .run(wharfie + ' endpoint')
      .stdout(/wharfie endpoint */)
      .end(done);
  });
});

describe('wharfie#endpoint-list', function() {
  it('list all endpoints, including the default one', function(done) {
    nixt({ colors: false })
      .run(wharfie + ' endpoint list')
      .stdout(new RegExp(process.env.DOCKERENDPOINT))
      .end(done);
  });
});

describe('wharfie#endpoint-add-bad', function() {
  it('add an endpoint with a bad ip', function(done) {
    nixt({ colors: false })
      .run(wharfie + ' endpoint add foobar')
      .stdout(/wharfie not ok/)
      .end(done);
  });
});

describe('wharfie#endpoint-add-good', function() {
  it('add an endpoint with a good ip', function(done) {
    nixt({ colors: false })
      .run(wharfie + ' endpoint add ilikedonuts 1.1.1.1')
      .stdout(/1.1.1.1/)
      .end(done);
  });
});

describe('wharfie#endpoint-use', function() {
  it('use a new endpoint', function(done) {
    nixt({ colors: false })
      .run(wharfie + ' endpoint use ilikedonuts')
      .stdout(/wharfie ok/)
      .end(done);
  });
});