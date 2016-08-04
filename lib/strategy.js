/**
 * Module dependencies
 */
var util = require('util');
var OAuth2Strategy = require('passport-oauth2');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;


/**
 * `Strategy` constructor
 *
 * The Uber authentication strategy authenticates requests by delegating to
 * Uber using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`     your Uber application's client id
 *   - `clientSecret` your Uber application's client secret
 *   - `callbackURL`  URL to which Uber will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new UberStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret',
 *         callbackURL: 'https://www.example.net/auth/uber/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://login.uber.com/oauth/v2/authorize';
  options.tokenURL = options.tokenURL || 'https://login.uber.com/oauth/v2/token';
  options.scopeSeparator = options.scopeSeparator || ' ';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'uber';
  this._userProfileURL = options.userProfileURL || 'https://api.uber.com/v1/me';
  this._oauth2.setAuthMethod('Bearer');
  this._oauth2.useAuthorizationHeaderforGET(true);
}


/**
 * Inherit from `OAuth2Strategy`
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Uber
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `uber`
 *   - `id`               user unique id
 *   - `firstname`
 *   - `lastname`
 *   - `email`
 *   - `avatar`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */

Strategy.prototype.userProfile = function(accessToken, done) {
  var headers = {'Authorization': 'Bearer ' + accessToken };

  this._oauth2._request('GET', this._userProfileURL, headers, '', accessToken, function (err, body, res) {
    var json;

    if (err) {
      console.log(err);
      if (err.data) {
        try {
          json = JSON.parse(err.data);
        } catch (_) {}
      }

      if (json && json.meta && json.meta.errorType) {
        return done(new APIError(json.meta.errorDetail, json.meta.errorType, json.meta.code));
      }
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    if ('string' == typeof json) {
      json = JSON.parse(json);
    }
    console.log(json);
    var profile = {};
    profile.id = String(json.uuid);
    profile.firstname = String(json.first_name);
    profile.lastname = String(json.last_name);
    profile.email = String(json.email);
    profile.avatar = String(json.picture);

    profile.provider = 'uber';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
}


/**
 * Expose `Strategy`
 */

module.exports = Strategy;
