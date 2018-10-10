var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const maps = require('../../../utils/maps.js');
var app = getApp();

Page({
  data: {
    userInfo: {},
    latitude: 0.00,
    longitude: 0.00,
    address: "",	   //地址
    name :"", //商户姓名
    phone :"", //电话
  },

  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    this.$wuxToast = app.Wux().$wuxToast

    if(null == userInfo){
      wx.redirectTo({
        url: '/pages/auth/login/login'
      });
    }
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  //提交
  submit: function () {
    var _this = this;
    // if ("" == _this.data.content || _this.data.content == null) {
    //   _this.$wuxToast.show({ type: 'forbidden', text: "内容不能为空，请填写后提交！", });
    //   return;
    // }
    var data = {
      latitude: _this.data.latitude,
      longitude: _this.data.longitude,
      address: _this.data.address,
      name: _this.data.name,
      phone: _this.data.phone,
    }
    util.request(api.Partner, data, "POST").then(function (res) {
      if (res.rs === 1) {
        _this.setData({
          content: "",
        });
        _this.$wuxToast.show({ type: 'success', text: "提交成功!", });
      }
    });
  },
})