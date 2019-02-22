/***
 * 商户相关服务
 * @athor  bjsonghongxu
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');

//获取商户列表
function queryMerchants(data) {
  return new Promise(function (resolve, reject) {
    util.request(api.QueryMerchants, data, "POST").then((res) => {
      console.log('------商户信息', res);
      if (res.rs === 1) {
        resolve(res);
      }else{
        reject(res);
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * 校验商户和商品的关系
 */
function checkMerchantGoodsRel(merchantId , goodsId) {
  return new Promise(function (resolve, reject) {
    util.request(api.QueryMerchants, 
      {
        merchantId: merchantId,
        goodsId: goodsId
      }, "POST").then((res) => {
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
  queryMerchants: queryMerchants,
  checkMerchantGoodsRel: checkMerchantGoodsRel,
}