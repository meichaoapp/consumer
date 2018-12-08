// pages/orderConfirm/orderConfirm.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const cart = require('../../services/cart.js');
const currentMerchat = "currentMerchat";

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    merchat:null,
    totalPay: 0.00,//共付
    needPay: 0.00,// 应付
    preferential:0.00,//优惠
    merchantId: 1,// 店铺id
    merchantOrder: {},// 团购订单
    oneselfOrder: {}, // 自营订单

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    console.log("userinfo----" + userInfo);
    if (null != userInfo && userInfo != "" && undefined != userInfo) {
      this.setData({
        userInfo: userInfo,
      });
    }
    let merchant = wx.getStorageSync(currentMerchat);
    if (null != merchant && undefined != merchant) {
      this.setData({
        merchat: merchant,
      });
    }

    this.loadOrderInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  /**
   * 加载订单信息
   */
  loadOrderInfo:function(){
    let _this = this;
    var _data = cart.createOrder(_this.data.merchat.merchantId,_this.data.userInfo);
    console.log("loadOrderInfo----" + JSON.stringify(_data));
    _this.setData({
      totalPay: _data.totalPay.toFixed(2),//共付
      needPay: _data.needPay.toFixed(2),// 应付
      preferential: (_data.totalPay - _data.needPay).toFixed(2),
      merchantOrder: _data.merchantOrder,// 团购订单
      oneselfOrder: _data.oneselfOrder, // 自营订单
    });
  },
})