var _ = require('lodash');
var fs = require('fs');
var express = require('express');
var router = express.Router();

var content = fs.readFileSync(__dirname+'/../config.json').toString();
var config = JSON.parse(content);
var loggedUsersHashes = [];

function getHash() {
    return  _.random(300000)+'x'+_.random(300000)
}

function isAuthenticated(req) {
    var hash = req.headers.authorization;
    console.info('check if user is authenticated', hash, loggedUsersHashes)
    return _.includes(loggedUsersHashes, hash);
}

router.post('/login', function(req, res, next) {
  console.info('login', config)
  console.info('req.body', req.body)
  var username = req.body.username;
  var password = req.body.password;
  var found = _.find(config.users, {name: username});
  if(found) {
    if(password === found.password) {
        var hash = getHash();
        loggedUsersHashes.push(hash);
        res.status(200).json({
            hash: hash,
            status: 'Login successful!'
          });
    } else {
         return res.status(500).json({
           err: 'Could not log in user ' + username
         });
    }
  } else {
    return res.status(401).json({
        err: 'User '+username+' not found.'
      });
  }


});

router.get('/logout', function(req, res) {
  console.info('Logout user with hash', req.query.hash)
  _.remove(loggedUsersHashes, req.query.hash);
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!isAuthenticated(req)) {
    console.info('status not authenticated');
    return res.status(200).json({
      status: false
    });
  }
  console.info('status authenticated');
  res.status(200).json({
    status: true
  });
});


module.exports = router;