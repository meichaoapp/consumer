/**
 * @author bjsonghongxu 11
 * @desc 
 *    日志采集
 * @time 2019-02-22
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');



function collectLog(client, pName, url, parameters, others, uid) {
  var log = {
    client: client,
    pName: pName,
    url: url,
    parameters: parameters,
    data:data,
    others: others,
    userId:uid,
  };
  console.log("collectLog------" + log);
  return new Promise(function (resolve, reject) {
    util.request(api.CollectLogs, log , 'POST').then(res => {
      if (res.rs === 1) {
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err);
    });
    
  });
}

module.exports = {
  collectLog: collectLog,

}