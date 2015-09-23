
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('moo:service');
const app = express();

app.use(bodyParser.json());
app.post('/hook/github/push', function (req, res) {
  console.log(req.body);
  res.end();
});

const port = process.env.PORT || 8001;
app.listen(port);
debug('service is up on ' + port);
