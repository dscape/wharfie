var fs = require('fs');
var nixt = require('nixt');

var wharfie = require('./command');

describe('wharfie#provider', function () {
  it('should show usage information', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' provider')
      .stdout(/wharfie provider \*/)
      .end(done);
  });
});

describe('wharfie#provider.list', function () {
  it('should return an empty object when no providers exist', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' provider list')
      .stdout(/\{\}/)
      .end(done);
  });
});

describe('wharfie#provider.add', function () {
  it('should be able to add a supported provider like digital ocean', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' provider add digitalocean foo bar')
      .stdout(/info:\s+wharfie ok/)
      .end(done);
  });
  it('should now list digital ocean as a provider', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' provider list')
      .expect(function (result) {
        if (!result.stdout.match(/digitalocean/)) {
          return new Error('Did not list digital ocean');
        }
        if (result.stdout.match(/bar/)) {
          return new Error('apiKey was not masked');
        }
      })
      .end(done);
  });
  it('should list digital ocean as the current provider since none existed before', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' config get provider')
      .stdout(/digitalocean/)
      .end(done);
  });
  it('should deplay the provider always since it is defined', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie)
      .stdout(/digitalocean/)
      .end(done);
  });
  it('should not be able to add a provider that is not supported', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' provider add dawg foo bar')
      .stdout(/wharfie not ok/)
      .end(done);
  });
  it('should be able to add a mock provider', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' provider add mock foo baz')
      .stdout(/wharfie ok/)
      .end(done);
  });
  it('but that should not change the current provider, since we already add digital ocean', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' config get provider')
      .stdout(/digitalocean/)
      .end(done);
  });
});

describe("wharfie#provider.use", function () {
  it('should be able to use a existing provider', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' provider use mock')
      .stdout(/wharfie ok/)
      .end(done);
  });
  it('then the mock provider should come up', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' config get provider')
      .stdout(/mock/)
      .end(done);
  });
  it('should now list both providers but not the keys', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' provider list')
      .expect(function (result) {
        if (!result.stdout.match(/digitalocean/)) {
          return new Error('Did not list digital ocean');
        }
        if (result.stdout.match(/bar/)) {
          return new Error('apiKey for digital ocean was not masked');
        }
        if (result.stdout.match(/baz/)) {
          return new Error('apiKey for mock was not masked');
        }
        if (!result.stdout.match(/mock/)) {
          return new Error('Did not list the mock provider');
        }
      })
      .end(done);
  });
  it('should not be able to use a provider that is not registered', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' provider use fuuuuuu')
      .stdout(/wharfie not ok/)
      .end(done);
  });
  it('since this failed the provider should still be mock', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' config get provider')
      .stdout(/mock/)
      .end(done);
  });
});

describe('wharfie#provider.delete', function () {
  it('should be able to delete the mock provider', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' provider delete mock')
      .stdout(/wharfie ok/)
      .end(done);
  });
  it('the current provider should now be unset', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' config get provider')
      .expect(function (result) {
        if (result.stdout.match(/mock/)) {
          return new Error('Provider should be unset since mock was deleted');
        }
      })
      .end(done);
  });
  it('should not list mock anymore', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' provider list')
      .expect(function (result) {
        if (result.stdout.match(/mock/)) {
          return new Error('Provider mock was deleted, should not be listed');
        }
      })
      .end(done);
  });
  it('should be able to delete the mock the digital ocean provider', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' provider delete digitalocean')
      .stdout(/wharfie ok/)
      .end(done);
  });
  it('should not list no providers', function (done) {
    nixt({
      colors: false
    })
      .run(wharfie + ' provider list')
      .stdout(/\{\}/)
      .end(done);
  });
});
