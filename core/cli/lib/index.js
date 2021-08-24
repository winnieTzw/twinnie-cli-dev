'use strict';

module.exports = core;


// require 加载资源的方式和原理 .js .node .json
// .js -> module.exports/exports
// .json -> JSON.parse
// .node -> process.dlopen
const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const pkg = require('../package.json')
const log = require('@twinnie-cli-dev/log')
const constant = require('./const')

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
  } catch (e) {
    log.error(e.message)
  }

}


function checkUserHome(){
  if(!userHome || !pathExists(userHome)){
    throw new Error(colors.red(`当前登录用户目录不存在！`))
  }
}

function checkNodeVersion() {
  // 获取当前版本号
  const currentVersion = process.version;

  const lowestVersion = constant.LOWEST_NODE_VERSION;

  // 比较最低版本号
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(colors.red(`twinnie-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`))
  }
}

function checkRoot(){
  const rootCheck = require('root-check')
  rootCheck()
}

function checkPkgVersion() {
  log.notice(pkg.version)
}
