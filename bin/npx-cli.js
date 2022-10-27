#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const {execSync} = require('child_process');

const runCommand = command => {
  try {
    execSync(`${command}`, {stdio: 'inherit'});
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

process.on('SIGINT', handleExit);
process.on('uncaughtException', handleError);

console.log();
console.log('-------------------------------------------------------');
console.log('Assuming you have already run `npm install` to update the deps.');
console.log('If not, remember to do this before testing!');
console.log('-------------------------------------------------------');
console.log();

const gitStatus = cp.execSync(`git status --porcelain`).toString();

if (gitStatus.trim() !== '') {
  console.log('Please commit your changes before running this script!');
  console.log('Exiting because `git status` is not empty:');
  console.log();
  console.log(gitStatus);
  console.log();
  process.exit(1);
}

const rootDir = path.join(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');
const packagePathsByName = {};
fs.readdirSync(packagesDir).forEach(name => {
  const packageDir = path.join(packagesDir, name);
  const packageJson = path.join(packageDir, 'package.json');
  if (fs.existsSync(packageJson)) {
    packagePathsByName[name] = packageDir;
  }
});

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Please enter at least 2 numbers');
  process.exit(1); //an error occurred
}

console.log(`Result: `);
const total = args.reduce((previous, current) => parseFloat(current) * parseFloat(previous));

if (isNaN(total)) {
  console.error('One or more arguments are not numbers');
  process.exit(1); //an error occurred
}

console.log(total);
process.exit(0); //no errors occurred