#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const { Command } = require('commander');
const envinfo = require('envinfo');
const packageJson = require('./package.json');
let projectName;

function buildCommand() {
  const inpectCommand = (command) => {
    // The option value is stored as property on command because we called .storeOptionsAsProperties()
    console.log(`Called '${command.name()}'`);
    console.log(`args: ${command.args}`);
    console.log('opts: %o', command.opts());
  };

  const cmd = new Command();

  cmd
    .name('create-mkdocs-site')
    .argument('<project-directory>', 'directory to install the new site template')
    .option('--template <path-to-template>', 'specify a template for the mkdocs starting point')
    .action((projectDirectory, options, command) => {
      // const { invoke } = require(`@kickstep/create-mkdocs-site`);
      // let commandArgs = args.splice(0, args.length - 1);
      // let command = args[0];
      // invoke(commandArgs);
      console.log(projectDirectory);
      console.log(options);

      // inpectCommand(command);
    });

  return cmd;
}

function invoke(args) {
  console.log(`createDockerBaseline.js invoke()`);
  console.log(`args: ${JSON.stringify(args, "", 2)}`);
}

module.exports = {
  buildCommand,
  invoke
};

