var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 查看用户微信版本是否支持
    userInfo:null,
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  login: function (e) {
    var wxUser = e.detail.userInfo;
    console.log("userInfo" + wxUser)
    user.wxLogin(wxUser).then(res => {
      this.setData({
        userInfo: res.data.userInfo
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      wx.navigateBack({
        delta:1
      })
    }).catch((err) => {
      console.log(err)
    });
  },
 
})