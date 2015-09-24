
'use strict';

const Express = require('express');
const Github = require('octop');
const util = require('util');
const bodyParser = require('body-parser');
const promisify = require('es6-promisify');

const debug = require('debug')('moo:service');
const app = Express();
const token = process.env.GITHUB_ACCESS_TOKEN;
const githubapi = new Github({'token': token});

app.use(bodyParser.json());
app.post('/hook/github/push', function (req, res) {
  let currVersion;
  let currBranch;
  let tags;
  const body = req.body;
  const repo = githubapi.getRepo(body.repository.owner.login, body.repository.name);

  debug('getting tags...');
  promisify(repo.getTags)()
  .then(function (data) {
    tags = data;
    currBranch = body.pull_request.head.ref;

    debug('getting package.json')
    return promisify(repo.read)(currBranch, 'package.json');
  })
  .then(function (data) {
    data = JSON.parse(data);
    currVersion = data.version;
    
    debug('getting tree...');
    return promisify(repo.getTree)(currBranch, true);
  })
  .then(function (data) {
    data.filter(function (item) {
      return item && /^common\/models\/*\.js$/.test(item.path);
    }).forEach(function (item) {
      console.log(item);
    });
    res.end();
  })
  .catch(function (err) {
    res.status(500).end(err);
  });
});

if (process.env.NODE_ENV === 'test') {
  module.exports = app;
} else {
  const port = process.env.PORT || 8001;
  app.listen(port, function () {
    debug('Moo service is up on ' + port);
  });
}
