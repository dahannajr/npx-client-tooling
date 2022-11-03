#!/usr/bin/env node

'use strict';

const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const cp = require('child_process');
const commander = require('commander');
const packageJson = require('../package.json');
const program = new commander.Command(packageJson.name).version(packageJson.version);

const runCommand = command => {
  try {
    cp(`${command}`, {stdio: 'inherit'});
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }

  return true;
}

const cleanup = () => {
  console.log('Cleaning up.');
  // Reset changes made to package.json files.
  // cp.execSync(`git checkout -- packages/*/package.json`);
  // Uncomment when snapshot testing is enabled by default:
  // rm ./template/src/__snapshots__/App.test.js.snap
};

const handleExit = () => {
  cleanup();
  console.log('Exiting without error.');
  process.exit();
};

const handleError = e => {
  console.error('ERROR! An error was encountered while executing');
  console.error(e);
  cleanup();
  console.log('Exiting with error.');
  process.exit(1);
};

let toolCommand;
function init() {
  program
    .addArgument(new commander.Argument('<tool-command>', 'kickstep starter tool to run').choices(['create-doc-builder', 'create-cloudformation-baseline', 'create-docker-baseline']))
    .usage(`${chalk.green('<tool-command>')} [options]`)
    .allowUnknownOption()
    .action((tool, options, command) => {
      toolCommand = tool;
    });

  program.parse();
}

function run() {
  const { invoke } = require(`../packages/${toolCommand}`);

  invoke(process.argv.slice(3));
}

process.on('SIGINT', handleExit);
process.on('uncaughtException', handleError);

// Init
init();

// Run
run();

// Cleanup
handleExit();