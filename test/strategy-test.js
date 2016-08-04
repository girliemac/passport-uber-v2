var expect = require('chai').expect;
var util = require('util');
var uberStrategy = require('../lib/strategy');

describe('Strategy', function() {

  describe('constructed', function() {
    var strategy = new uberStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});

    it('should be named uber', function() {
      expect(strategy.name).to.equal('uber');
    });
  })

  describe('constructed with undefined options', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new uberStrategy(undefined, function(){});
      }).to.throw(Error);
    });
  })

});
