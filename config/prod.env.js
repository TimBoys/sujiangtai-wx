'use strict'
let HOST = process.argv.splice(2)[0] || 'prod';
console.log(HOST);
module.exports = {
  NODE_ENV: '"production"',
//ajaxApi:"https://www.95cfuns.com",
ajaxApi:"http://47.89.247.54:8082",
  HOST: '"'+HOST+'"'
}
