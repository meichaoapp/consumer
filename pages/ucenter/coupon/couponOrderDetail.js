var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var WxParse = require('../../../lib/wxParse/wxParse.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    detail:{},
    merchant:{},
    showModal: false,
    modalTitle: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    this.setData({
      id: options.id,
    });
    this.queryCouponDetail();
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

  //查询详情
  queryCouponDetail:function() {
    
    let that = this;
    util.request(api.QueryCouponDetail,
      {
        "orderId": that.data.id,
      },
      "POST").then(function (res) {
        if (res.rs === 1) {
          that.setData({
            detail: res.data.detail,
            merchant: res.data.merchant,
          });
          WxParse.wxParse('goodsDetail', 'html', res.data.detail.content, that);
        }
      });
  },
  copyPhone() {
    let that = this;
    //复制到剪切板
    wx.setClipboardData({
      data: that.data.merchant.merchantPhone,
      success() {
        //wx.hideToast();
        that.setData({
          modalTitle: "您已复制团长手机号",
          showModal: true
        });
      }
    })
  },
  copyWxCode() {
    let that = this;
    //复制到剪切板
    wx.setClipboardData({
      data: that.data.merchant.wxcode,
      success() {
        //wx.hideToast();
        that.setData({
          modalTitle: "您已复制团长微信",
          showModal: true
        });
      }
    })
  },

  closeFloat() {
    this.setData({
      modalTitle: "",
      showModal: false
    });
  }

 
})