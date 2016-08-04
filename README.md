# Passport-uber-v2

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating with [Uber](http://www.uber.com/) using the OAuth 2.0 API.

This module lets you authenticate using Uber in your Node.js [Express](http://expressjs.com/) (or [Connect](http://www.senchalabs.org/connect/)) server applications.

## Install

```bash
$ npm install passport-uber-v2
```

## Usage

#### Configure Strategy

The Uber authentication strategy authenticates users using an Uber account and OAuth tokens. The strategy requires a `verify` callback, which accepts these credentials and calls `done` providing a user, as well as `options` specifying a client id , client secret, and callback URL.

```javascript
var uberStrategy = require('passport-uber-v2').Strategy;

passport.use(new uberStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    var user = profile;
    user.accessToken = accessToken;
    return done(null, user);
  }
));
```



#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'uber'` strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/) application:

```javascript
app.get('/auth/uber',
  passport.authenticate('uber', { scope: ['profile'] }
));

app.get('/callback', passport.authenticate('uber', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});
```



## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2016 Tomomi ❤ Imura <[http://girliemac.com](http://girliemac.com)>
