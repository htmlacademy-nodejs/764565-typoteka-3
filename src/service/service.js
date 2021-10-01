'use strict';

const {Cli} = require(`./cli`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode
} = require(`../constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

const isNotExistsCommand = !Cli[userCommand];
const isNotExistsArguments = (userArguments.length === 0);

if (isNotExistsCommand || isNotExistsArguments) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}

Cli[userCommand].run(userArguments.slice(1));
