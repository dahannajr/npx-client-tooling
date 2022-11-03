'use strict';

const bootstrapTools = require('..');
const assert = require('assert').strict;

assert.strictEqual(bootstrapTools(), 'Hello from bootstrapTools');
console.info("bootstrapTools tests passed");
