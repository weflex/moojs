
'use strict';

const Express = require('express');
const Github = require('octop');
const bodyParser = require('body-parser');
const promisify = require('es6-promisify');

const debug = require('debug')('moo:service');
const app = Express();
const token = process.env.GITHUB_ACCESS_TOKEN;
const githubapi = new Github({'token': token});

app.use(bodyParser.json());
app.post('/hook/github/push', function (req, res) {
  const body = req.body;
  const repo = githubapi.getRepo(body.repository.owner.login, body.repository.name);
  promisify(repo.getTags)()
  .then(function (sha) {
    const branch = body.pull_request.head.ref;
    return promisify(repo.read)(branch, 'package.json');
  })
  .then(function (data) {
    console.log(data);
    res.end();
  })
  .catch(function (err) {
    res.status(500).end(err);
  });
});

const port = process.env.PORT || 8001;
app.listen(port);
debug('service is up on ' + port);
