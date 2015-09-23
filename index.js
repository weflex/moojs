#!/usr/bin/env node

'use strict';

const fs = require('fs');
const glob = require('glob').sync;
const assert = require('assert');
const program = require('commander');
const pkgInfo = require('./package.json');
const debug = require('debug')('moo');

const esprima = require('esprima');
const toValue = require('esprima-to-value');
const getObject = require('esprima-get-object');

program
  .version(pkgInfo.version)
  .usage('<directory>')
  .parse(process.argv);

const dir = program.args[0];

if (!dir) {
  console.error('directory required');
  process.exit();
}

// try access, if not exists, will throw errors
fs.accessSync(dir);

// load contents
const globurl = dir + '/common/models/*.js';
const scripts = glob(globurl).map(function (url) {
  const code = fs.readFileSync(url, 'utf8');
  const root = esprima.parse(code);

  // assert the root's type is program
  assert.equal(root.type, 'Program');

  // access to model setup function
  const setup = root.body[0].expression.right;
  assert.equal(setup.type, 'FunctionExpression');
  assert.equal(setup.params.length, 1, setup.params);

  const model = setup.params[0].name;
  const blocks = setup.body.body;

  blocks.forEach(function (b) {
    if (b.type === 'ExpressionStatement') {
      if (b.expression.type === 'CallExpression') {
        if (b.expression.callee.object.name === model) {
          if (b.expression.callee.property.name === 'remoteMethod') {
            const args = toValue(b.expression.arguments);
            console.log(args[1]);
          }
        }
      }
    }
  });

});
