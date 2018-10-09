var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0,
    wxPaySelected:false, // 微信支付
    balancePaySelected : false, //账户余额支付
    couponPaySelected : false, //卡券支付
  },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数

    try {
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }

      var couponId = wx.getStorageSync('couponId');
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
      
      var wxPaySelected = wx.getStorageSync('wxPaySelected');
      if (wxPaySelected != null) {
        this.setData({
          'wxPaySelected': wxPaySelected
        });
      }

      var balancePaySelected = wx.getStorageSync('balancePaySelected');
      if (balancePaySelected != null) {
        this.setData({
          'balancePaySelected': balancePaySelected
        });
      }

      var couponPaySelected = wx.getStorageSync('couponPaySelected');
      if (couponPaySelected != null) {
        this.setData({
          'couponPaySelected': couponPaySelected
        });
      }

    } catch (e) {
      // Do something when catch error
    }


  },

  //切换支付方式
  switchPayWay:function(e){
    let that = this;
    var way = e.currentTarget.dataset.way;
    //console.log("way---" + way);
    if(way == 1){
      that.setData({
        balancePaySelected: !that.data.balancePaySelected,
        wxPaySelected: (!that.data.balancePaySelected) ? false: that.data.wxPaySelected,
      });
    } else if (way == 2) {
      that.setData({
        wxPaySelected: !that.data.wxPaySelected,
        balancePaySelected: (!that.data.wxPaySelected) ? false : that.data.balancePaySelected ,
      });
    } else if (way == 3) {
      that.setData({
        couponPaySelected: !that.data.couponPaySelected,
      });
      
    }
    wx.setStorageSync('balancePaySelected', that.data.balancePaySelected);
    wx.setStorageSync('wxPaySelected', that.data.wxPaySelected);
    wx.setStorageSync('couponPaySelected', that.data.couponPaySelected);
  },

  getCheckoutInfo: function () {
    let that = this;
    util.request(api.CartCheckout, { addressId: that.data.addressId, userCouponId: that.data.couponId }).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          checkedCoupon: res.data.checkedCoupon,
          couponList: res.data.couponList,
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice
        });
      }
      wx.hideLoading();
    });
  },
  
  selectCoupons() {
    let that = this;
    if (that.data.couponList.length > 0){
      wx.navigateTo({
        url: '/pages/shopping/coupon/coupon',
      })
    }
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    let that = this;
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    if (that.data.balancePaySelected && that.data.wxPaySelected && that.data.couponPaySelected ) {
      util.showErrorToast('请选择支付方式');
      return false;
    }
    var payWays = that.getPayWays();
    util.request(api.OrderSubmit, { 
          addressId: this.data.addressId,
          userCouponId: this.data.couponId, 
          payWays: payWays, 
          freightPrice: that.data.freightPrice
       }, 'POST').then(res => {
      if (res.errno === 0) {
        that.clearSession();//清除
        const orderId = res.data.orderInfo.id;
        pay.payOrder(parseInt(orderId)).then(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
  },
  //获取支付方式
  getPayWays :function(){
    var ways = [];
    let that = this;
    if (that.data.balancePaySelected) {
      ways.push(1);
    } else if (that.data.wxPaySelected ) {
      ways.push(2);
    } else if (that.data.couponPaySelected) {
      ways.push(3);
    }
    return ways.join(",");
  },
  //清除数据缓存
  clearSession : function(){
    wx.setStorageSync('couponId', null);
    wx.setStorageSync('balancePaySelected', null);
    wx.setStorageSync('wxPaySelected', null);
    wx.setStorageSync('couponPaySelected', null);
  }
})