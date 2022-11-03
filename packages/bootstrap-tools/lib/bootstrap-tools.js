'use strict';

const chalk = require('chalk');
const packageJson = require('../package.json');
const { Command } = require('commander');
const program = new Command();
const { buildCommand } = require(`@kickstep/create-mkdocs-site`);

module.exports = {
    buildCommanderProgram
};

function buildCommanderProgram() {
    program
        .name(packageJson.name)
        .version(packageJson.version)
        .hook('preAction', (thisCommand, actionCommand) => {
            if (thisCommand.opts().trace) {
                console.log(`About to call action handler for subcommand: ${actionCommand.name()}`);
                console.log('arguments: %O', actionCommand.args);
                console.log('options: %o', actionCommand.opts());
            }
        });

    program.addCommand(buildCommand());
    // program
    //     .command('create-mkdocs-site')
    //     .description('setup new mkdocs site template')
    //     .argument('<dir>', 'directory to install the new site template')
    //     .argument('[documentation-template]', 'template to preload the documentation site with')
    //     .allowUnknownOption(true)
    //     .action((...args) => {
    //         const { invoke } = require(`@kickstep/create-mkdocs-site`);
    //         let commandArgs = args.splice(0, args.length-1);
    //         invoke(commandArgs);
    //     });

    program
        .command('create-docker-baseline')
        .description('setup a new docker-compose configuration base on a solution template')
        .argument('<dir>', 'directory to setup compose and volumees template')
        .option('-t, --template <template>', 'template to use')
        .allowUnknownOption(true)
        .action((...args) => {
            const { invoke } = require(`@kickstep/create-docker-baseline`);
            let commandArgs = args.splice(0, args.length-1);
            invoke(commandArgs);
        });

    return program;
}
