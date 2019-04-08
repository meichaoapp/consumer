var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    basePath: app.globalData._base_path, //基础路径
    orderId: 0,
    detail:{},
    logisticsList:null, //物流信息
    showModal: false,
    modalTitle: "",
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
        that.viewLogistics();
      }
    });
  },

  /**
   * 查看物流信息
   */
  viewLogistics: function() {
    let _this = this;
    _this.data.detail.expressNum = "3700390913306";
    _this.data.detail.expressCode = "yunda";
    if (_this.data.detail.expressNum) {
      var data = {
        expressCode: _this.data.detail.expressCode,// 快递公司编号
        expressNum: _this.data.detail.expressNum ,// 运单编号，未发货时，不显示
      };
      util.request(api.QueryLogistics, data, "POST").then(function (res) {
        if (res.rs === 1 && res.data) {
          var data = JSON.parse(res.data).data;
          _this.setData({
            logisticsList: data, //物流信息
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: res.info,
          })
        }
      });
    }
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

  copyOrderCode() {
    let that = this;
    //复制到剪切板
    wx.setClipboardData({
      data: that.data.detail.orderCode,
      success() {
        wx.hideToast();
        that.setData({
          modalTitle: "您已复制订单编号",
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
