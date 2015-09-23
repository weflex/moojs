
'use strict';

const fs = require('fs');
const assert = require('assert');
const debug = require('debug')('moo');

const esprima = require('esprima');
const toValue = require('esprima-to-value');
const getObject = require('esprima-get-object');

function moo (url) {
  
  debug(`parsing ${url}`);
  
  let ret;
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
            ret = toValue(b.expression.arguments);
          }
        }
      }
    }
  });

  return ret;
}

module.exports = moo;
