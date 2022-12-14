'use strict';

const chalk = require('chalk');
const commander = require('commander');
const envinfo = require('envinfo');

const packageJson = require('./package.json');
let projectName;

function init() {
  const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action(name => {
      projectName = name;
    })
    .option('--verbose', 'print additional logs')
    .option('--info', 'print environment debug info')
    .option( '--template <path-to-template>', 'specify a template for the created project')
    .option('--use-pnp')
    .allowUnknownOption()
    .on('--help', () => {
      console.log( `    Only ${chalk.green('<project-directory>')} is required.`);
      console.log();
    })
    .parse(process.argv);

  if (program.info) {
    console.log(chalk.bold('\nEnvironment Info:'));
    console.log( `\n  current version of ${packageJson.name}: ${packageJson.version}`);
    console.log(`  running from ${__dirname}`);
    return envinfo
      .run(
        {
          System: ['OS', 'CPU'],
          Binaries: ['Node', 'npm', 'Yarn'],
          Browsers: [
            'Chrome',
            'Edge',
            'Internet Explorer',
            'Firefox',
            'Safari',
          ],
          npmPackages: ['react', 'react-dom', 'react-scripts'],
          npmGlobalPackages: ['create-react-app'],
        },
        {
          duplicates: true,
          showNotFound: true,
        }
      )
      .then(console.log);
  }

  if (typeof projectName === 'undefined') {
    console.error('Please specify the project directory:');
    console.log( `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`);
    console.log();
    console.log('For example:');
    console.log( `  ${chalk.cyan(program.name())} ${chalk.green('my-react-app')}`);
    console.log();
    console.log( `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`);
    process.exit(1);
  }
}

function invoke(args) {
  console.log(`createDockerBaseline.js invoke()`);
  console.log(`args: ${JSON.stringify(args, "", 2)}`);
}

module.exports = {
  init,
  invoke
};