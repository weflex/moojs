
'use strict';

const Express = require('express');
const Github = require('octop');
const Semver = require('semver');
const Promisify = require('es6-promisify');
const BodyParser = require('body-parser');
const Moo = require('./moo');

const debug = require('debug')('moo:service');
const app = Express();
const token = process.env.GITHUB_ACCESS_TOKEN;
const githubapi = new Github({'token': token});

app.use(BodyParser.json());
app.post('/hook/github/push', function (req, res) {
  let currVersion;
  let currBranch;
  let tags;
  const compares = [];
  const body = req.body;
  const repo = githubapi.getRepo(body.repository.owner.login, body.repository.name);

  debug('getting tags...');
  Promisify(repo.getTags)()
  .then(function (data) {
    tags = data;
    currBranch = body.pull_request.head.ref;
    tags = data.filter(function () {

    })

    debug('getting package.json')
    return Promisify(repo.read)(currBranch, 'package.json');
  })
  .then(function (data) {
    data = JSON.parse(data);
    currVersion = data.version;
    
    debug('getting tree...');
    return getMoo(currBranch);
  })
  .then(function (data) {
    console.log(data);
  })
  .then(function () {
    res.end();
  })
  .catch(function (err) {
    res.status(500).end(err);
  });

  function getMoo (ref) {
    return Promisify(repo.getTree)(ref, true)
    .then(function (data) {
      return Promise.all(
        data.filter(function (item) { 
          return item && /^common\/models\/(.*)\.js$/.test(item.path); 
        }).map(function (item) {
          const read = Promisify(repo.read);
          return read(ref, item.path).then(Moo);
        })
      );
    });
  }

});

if (process.env.NODE_ENV === 'test') {
  module.exports = app;
} else {
  const port = process.env.PORT || 8001;
  app.listen(port, function () {
    debug('Moo service is up on ' + port);
  });
}
