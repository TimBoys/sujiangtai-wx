'use strict'
let HOST = process.argv.splice(2)[0] || 'prod';
console.log(HOST);
module.exports = {
  NODE_ENV: '"production"',
	//ajaxApi:"https://www.95cfuns.com",
//	ajaxApi:"http://47.89.247.54:8082",//ip曹总
//	ajaxApi:"http://47.89.247.54:8081",//ip曹佳
//	ajaxApi:"http://www.primes-thaitea.com:8082", //客户域名曹总
//	ajaxApi:"http://www.primes-thaitea.com:8081", //客户域名曹佳
	ajaxApi:"https://www.primes-thaitea.com", //客户域

  HOST: '"'+HOST+'"'
}
