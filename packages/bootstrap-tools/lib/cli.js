'use strict';

const factory = require('yargs/yargs');
const bootstrapTools = require('./bootstrap-tools');
const chalk = require('chalk');
const packageJson = require('../package.json');
const { Command } = require('commander');
const program = new Command();

module.exports = cli;

function cli(cwd) {
  program
    .name(packageJson.name)
    .version(packageJson.version);

  program
    .command('create-mkdocs-site')
    .description('setup new mkdocs site template')
    .argument('<dir>', 'directory to install the new site template')
    .argument('[documentation-template]', 'template to preload the documentation site with')
    .action((dir, documentationTemplate) => {
      console.log('create-mkdocs-site');
      console.log(dir);
      console.log(documentationTemplate);
    });

  program
    .command('create-docker-baseline')
    .description('setup a new docker-compose configuration base on a solution template')
    .argument('<dir>', 'directory to setup compose and volumees template')
    .option('-t, --template <template>', 'template to use')
    .action((dir, options, command) => {
      console.log('create-docker-baseline');
      console.log(dir);
      console.log(options);
    })
    

  return program;
  // run(toolCommand, toolCommandArguments);
}

function run(toolCommand, toolCommandArguments) {
  console.log(`${toolCommand}`);
  console.log(`${toolCommandArguments}`);

  const { invoke } = require(`@kickstep/${toolCommand}`);

  invoke(toolCommandArguments);
}