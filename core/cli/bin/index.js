#! /usr/bin/env node

const importLocal = require('import-local');
const Log = require('npmlog')

if (importLocal(__filename)) {
  Log.info('cli', '正在使用twinnie-cli 本地版本')
} else {
  require('../lib')(process.argv.slice(2));
}
