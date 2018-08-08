'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ajaxApi:"https://www.95cfun.xyz",
  HOST: '"dev"'
})
