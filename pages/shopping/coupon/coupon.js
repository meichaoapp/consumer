var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    couponList : [] , //用户优惠券列表
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    let that = this;
    that.getCouponList();
  },
 


  ///去使用
  toUse:function(e){
    try {
      wx.setStorageSync('couponId', e.currentTarget.dataset.id);
    } catch (e) {

    }
    //选择该收货地址
    wx.redirectTo({
      url: '/pages/shopping/checkout/checkout'
    })
  },

  //获取优惠券列表
  getCouponList() {
    let that = this;
    util.request(api.CouponList,{
      isUsed: 0,
      isTransmit: 0
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        //console.log(res.data);
        that.setData({
          couponList: res.data
        });
      }
    });
  },

})