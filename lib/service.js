
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
  const data = req.body.repository;
  const repo = githubapi.getRepo(data.owner.login, data.name);
  repo.getTags(function (err, sha) {
    console.log(arguments);
  });
  res.end();
});

const port = process.env.PORT || 8001;
app.listen(port);
debug('service is up on ' + port);
