var fs = require('fs');
var join = require('path').join;
var nixt = require('nixt');

var wharfie = require('./command');

describe('wharfie#server', function () {
  it('should give usage information if badly invoked', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' server')
      .stdout(/wharfie server */)
      .end(done);
  });
});
