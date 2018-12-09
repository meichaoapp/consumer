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
    merchant:null,
    deliveryType:1,
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
    let _this = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (null != userInfo && userInfo != "" && undefined != userInfo) {
      _this.setData({
        userInfo: userInfo,
      });
    }
    let merchant = wx.getStorageSync(currentMerchat);
   
    if (null != merchant && undefined != merchant) {
      _this.setData({
        merchant:merchant,
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
  //切换取货方式
  switchDeliveryType: function(e) {
    let _this = this;
    let type = e.currentTarget.dataset.type;
    _this.setData({
      deliveryType: type,
    });
    _this.loadOrderInfo();
  },
  /**
   * 加载订单信息
   */
  loadOrderInfo:function(){
    let _this = this;
    var _data = cart.createOrder(0,_this.data.merchant.merchantId, _this.data.userInfo, _this.data.deliveryType, _this.data.merchant);
    //console.log("loadOrderInfo----" + JSON.stringify(_data));
    _this.setData({
      totalPay: _data.totalPay.toFixed(2),//共付
      needPay: _data.needPay.toFixed(2),// 应付
      preferential: (_data.totalPay - _data.needPay).toFixed(2),
      merchantOrder: _data.merchantOrder,// 团购订单
      oneselfOrder: _data.oneselfOrder, // 自营订单
    });
  },

  getOrderDatas: function(){
    let _this = this;
    var _data = cart.createOrder(1, _this.data.merchant.merchantId, _this.data.userInfo, _this.data.deliveryType, _this.data.merchant);
    return {
      merchantId: _this.data.merchant.merchantId,
      totalPay: _data.totalPay.toFixed(2),//共付
      needPay: _data.needPay.toFixed(2),
      merchantOrder: _data.merchantOrder,// 团购订单
      oneselfOrder: _data.oneselfOrder, // 自营订单
    };
  },

  //参团
  joinGroup: function () {
    //1.创建订单
    let _this = this;
    if (_this.data.count > 0) {
      return;
    }
    _this.setData({
      count: _this.data.count + 1,
    });
  
    var order = _this.getOrderDatas();
    console.log("order--- " + JSON.stringify(order));
    util.request(api.CreateOrder, order, "POST").then(function (res) {

      if (res.rs === 1) { //创建成功
        var data = res.data;

        //console.log(res.data.wxPayResponse);

        // wx.redirectTo({
        //   url: '/pages/details/success?id=' + data.id,
        // })
        // cart.cleanCart();
        // return;


        var wxPayResponse = res.data.wxPayResponse;
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        wx.requestPayment(
          {
            'timeStamp': wxPayResponse.timeStamp,
            'nonceStr': wxPayResponse.nonceStr,
            'package': "prepay_id=" + wxPayResponse.prepayId,
            'signType': 'MD5',
            'paySign': wxPayResponse.sign,
            'success': function (res) {
              cart.cleanCart();
              //跳转成功页
              wx.redirectTo({
                url: '/pages/details/success?id=' + data.id,
              })
            },
            'fail': function (res) {
              _this.setData({
                count: 0,
              });
              wx.showToast({
                icon: "none",
                title: '参团失败请重试!',
              })
              return false;
            },
            'complete': function (res) {

            }
          })

      } else {
        _this.setData({
          count: 0,
        });
        wx.showToast({
          icon: "none",
          title: res.info,
        })
        return false;
      }
    }).catch((err) => {
      _this.setData({
        count: 0,
      });
      wx.showToast({
        icon: "none",
        title: err.info,
      })
      console.log(err)
    });
  },
})