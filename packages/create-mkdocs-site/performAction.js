#!/usr/bin/env node

'use strict';

import CP, { exec, execSync } from 'child_process';
import chalk from 'chalk';
import { Command, Argument } from 'commander';
import packageJson from '../package.json' assert { type: 'json' };
const program = new Command(packageJson.name).version(packageJson.version);

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

let repoDestination;
function init() {
    program
        .addArgument(new Argument('<repo-dest>', 'doc-builder repo location'))
        .usage(`${chalk.green('<repo-dest>')} [options]`)
        .action((repo_dest, options, command) => {
            repoDestination = repo_dest;
        });

    program.parse();
}
init();

process.on('SIGINT', handleExit);
process.on('uncaughtException', handleError);

const ACTION_STATUS = {
    NOT_STARTED: 0,
    IN_PROGRESS: 1,
    COMPLETE_SUCCESS: 2,
    COMPLETE_CONTINUE: 3,
    COMPLETE_FAILURE: 4
};


const gitCheckoutCommand = `git clone --depth 1 git@github.com:dahannajr/doc-builder.git ${repoDestination}`;
const installDepsCommand = `cd ${repoDestination} && npm install`;

class Action {
    #_status;
    #_steps;

    constructor(actionTitle) {
        this.actionTitle = actionTitle;
        this.#_status = ACTION_STATUS.NOT_STARTED;
        this.#_steps = [];
    }

    printStatus() {
        switch (this.status) {
            case ACTION_STATUS.NOT_STARTED:
                console.log(`${chalk.gray(this.actionTitle)}`);
                break;
            case ACTION_STATUS.IN_PROGRESS:
                console.log(`${chalk.yellow(this.actionTitle)}`);
                break;
            case ACTION_STATUS.COMPLETE_SUCCESS:
                console.log(`${chalk.green(this.actionTitle)}`);
                break;
            case ACTION_STATUS.COMPLETE_FAILURE:
                console.log(`${chalk.red(this.actionTitle)}`);
                break;
        }
    }

    execute() {
        this.#_steps.forEach((step) => {
            try {
                switch (step()) {
                    case ACTION_STATUS.COMPLETE_SUCCESS:
                        this.status = ACTION_STATUS.COMPLETE_SUCCESS;
                        break;
                    case ACTION_STATUS.COMPLETE_FAILURE:
                        this.status = ACTION_STATUS.COMPLETE_FAILURE;
                        break;
                    case ACTION_STATUS.COMPLETE_CONTINUE:
                        this.status = ACTION_STATUS.IN_PROGRESS;
                        break;
                }
            } catch (e) {
                this.status = ACTION_STATUS.COMPLETE_FAILURE;
            }

            if (this.status == ACTION_STATUS.COMPLETE_FAILURE || this.status == ACTION_STATUS.COMPLETE_SUCCESS) {
                return;
            }
        });
    }

    set status(status) {
        this.#_status = status;
    }

    get status() {
        return this.#_status;
    }

    addStep(func) {
        this.#_steps.push(func);
    }
}


let verifyCondaInstallAction = new Action('Verify Conda Installed');
verifyCondaInstallAction.addStep(() => {
    try {
        execSync('conda --help');
        return ACTION_STATUS.COMPLETE_SUCCESS;
    } catch (e) {
        return ACTION_STATUS.COMPLETE_FAILURE;
    }
});

let verifyCondaEnvironmentAction = new Action('Verify Conda Environment Exists');
verifyCondaEnvironmentAction.addStep(() => {
    let returnStatus = ACTION_STATUS.COMPLETE_CONTINUE;
    try {
        let execResponse = execSync('conda info --envs').toString().split('\n').slice(2);

        execResponse.forEach((line) => {
            if (line.startsWith(CONDA_ENV)) {
                returnStatus = ACTION_STATUS.COMPLETE_SUCCESS;
            }
        });
    } catch (e) {
        throw e;
    }

    return returnStatus;
});
verifyCondaEnvironmentAction.addStep(() => {
    let returnStatus = ACTION_STATUS.COMPLETE_CONTINUE;
    try {
        execSync(`conda create --name ${CONDA_ENV}`, { stdio: 'inherit' });
    } catch (e) {
        throw e;
    }

    return returnStatus;
});
verifyCondaEnvironmentAction.addStep(() => {
    let returnStatus = ACTION_STATUS.COMPLETE_SUCCESS;
    try {
        execSync(`conda install -n ${CONDA_ENV} python=3.10`, { stdio: 'inherit' });
    } catch (e) {
        throw e;
    }

    return returnStatus;
});

let checkoutDocBuilder = new Action('Checkout MKDOCS Doc Builder');
checkoutDocBuilder.addStep(() => {
    let returnStatus = ACTION_STATUS.COMPLETE_SUCCESS;
    try {
        execSync(`${gitCheckoutCommand}`, { stdio: 'inherit' });
    } catch (e) {
        console.error(e);
        throw e;
    }
    return returnStatus;
});

let installDepsAction = new Action('Install MKDOCS Dependencies')
installDepsAction.addStep(() => {
    let returnStatus = ACTION_STATUS.COMPLETE_SUCCESS;
    try {
        execSync(`${installDepsCommand}`, { stdio: 'inherit' });
    } catch (e) {
        console.error(e);
        throw e;
    }
    return returnStatus;
});

const CONDA_ENV = 'mkdocs2';
const ACTIONS = [
    verifyCondaInstallAction,
    verifyCondaEnvironmentAction,
    checkoutDocBuilder,
    installDepsAction
]

function printStatus() {
    console.clear();
    let step = 1;
    ACTIONS.forEach((action) => {
        action.printStatus();
        step++;
    });
}

printStatus();
ACTIONS.forEach((action) => {

    action.execute();

    if (action.status != ACTION_STATUS.COMPLETE_SUCCESS) {
        handleExit();
    }

    printStatus();
});

handleExit();