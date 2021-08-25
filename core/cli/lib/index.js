'use strict';

module.exports = core;


// require 加载资源的方式和原理 .js .node .json
// .js -> module.exports/exports
// .json -> JSON.parse
// .node -> process.dlopen
const path = require('path')
const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const minimist = require('minimist')

const pkg = require('../package.json')
const log = require('@twinnie-cli-dev/log')
const constant = require('./const')
let args

async function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
    checkEnv()
    await checkGlobalUpdate()
  } catch (e) {
    log.error(e.message)
  }

}

function checkPkgVersion() {
  log.notice(pkg.version)
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

function checkRoot() {
  const rootCheck = require('root-check')
  rootCheck()
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red(`当前登录用户目录不存在！`))
  }
}

function checkInputArgs() {
  args = minimist(process.argv.slice(2))
  checkArgs()
}

function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose'
  } else {
    process.env.LOG_LEVEL = 'info'
  }
  log.level = process.env.LOG_LEVEL
}

function checkEnv() {
  const dotenv = require('dotenv')
  const dotenvPath = path.resolve((userHome, '.env'))
  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath
    })
  }
  createDefaultConfig()
  log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome
}

async function checkGlobalUpdate() {
  // 1.获取当前版本，模块名
  const currentVersion = pkg.version
  const npmName = pkg.name
  // 2.调研npm API ，获取所有版本号
  const { getSemverVersion } = require('@twinnie-cli-dev/get-npm-info')
  const versions = await getSemverVersion(currentVersion, npmName)

  // 3.提取所有版本号，比对哪些版本号大于当前版本号
  // 4.获取最新版本号，提示用户更新到改版本
}