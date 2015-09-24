
'use strict';

const Express = require('express');
const Github = require('octop');
const bodyParser = require('body-parser');

const debug = require('debug')('moo:service');
const app = Express();
const token = process.env.GITHUB_ACCESS_TOKEN;
const githubapi = new Github({'token': token});

app.use(bodyParser.json());
app.post('/hook/github/push', function (req, res) {
  const body = req.body;
  const repo = githubapi.getRepo(body.repository.owner.login, body.repository.name);
  repo.getTags(function (err, sha) {
    const branch = body['pull_request'].head.ref;
    console.log(branch);
  });
  res.end();
});

const port = process.env.PORT || 8001;
app.listen(port);
debug('service is up on ' + port);
