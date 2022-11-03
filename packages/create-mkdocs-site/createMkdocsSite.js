'use strict';

const chalk = require('chalk');
const { Command } = require('commander');
const envinfo = require('envinfo');


const packageJson = require('./package.json');
let projectName;

function buildCommand() {
  const cmd = new Command();

  cmd
    .name('create-mkdocs-site')
    .argument('<project-directory>', 'directory to install the new site template')
    .option('--template <path-to-template>', 'specify a template for the mkdocs starting point')
    .action((...args) => {
      const { invoke } = require(`@kickstep/create-mkdocs-site`);
      let commandArgs = args.splice(0, args.length - 1);
      let command = args[0];
      invoke(commandArgs);
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

