var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    basePath: app.globalData._base_path, //基础路径
    orderId: 0,
    detail:{},
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },

  /**
   * 查询详情
   */
  getOrderDetail() {
    let that = this;
    util.request(api.QueryShopOrderDetail, {
      orderId: that.data.orderId
    }, "POST").then(function (res) {
      if (res.rs == 1) {
        that.setData({
          detail:res.data.detail,
        });
      }
    });
  },

  //确认收货
  confirmReceive: function () {
    let _this = this;
    util.request(api.ConfirmReceive, {
      orderId: that.data.orderId
    }, "POST").then(function (res) {
      if (res.rs === 1) {
        //刷新结果
        _this.getOrderDetail();
      } else {
        wx.showToast({
          icon: 'none',
          title: res.info,
        })
      }
    });
  },


})
