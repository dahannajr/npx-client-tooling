#!/bin/bash

# Start in tasks/ even if run from root directory
cd "$(dirname "$0")"

# Exit the script on any command with non 0 return code
# We assume that all the commands in the pipeline set their return code
# properly and that we do not need to validate that the output is correct
set -e

# Echo every command being executed
set -x

# Go to root
cd ..
root_path=$PWD

if [ -n "$(git status --porcelain)" ]; then
  echo "Your git status is not clean. Aborting.";
  exit 1;
fi

# Compile
npm run build:prod -w react-error-overlay

# Get 2FA when not CI
otp=""
if [ -z $CI ]; then
  echo "Please enter npm two-factor auth code: "
  read otp
fi

# Go!
NPM_CONFIG_OTP="$otp" ./node_modules/.bin/lerna publish "$@"