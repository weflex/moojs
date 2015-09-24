
const test = require('tape');
const request = require('supertest');
const app = require('../lib/service.js');
const pullRequest = require('./github/pull-request.json');

test('Service', function (t) {
  request(app)
  .post('/hook/github/push')
  .send(pullRequest)
  .end(function () {
    t.end();
  });
});
