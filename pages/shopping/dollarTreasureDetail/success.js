var app = getApp();
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({
  data: {
     id : 0,
     code:"",
     lotteryTime:"",
  },
  onLoad: function (options) {
    this.$wuxToast = app.Wux().$wuxToast
    this.setData({
      id: parseInt(options.id),
    });
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    if (null == userInfo || userInfo == "" || undefined == userInfo) {
      wx.navigateTo({
        url: '/pages/auth/login/login'
      });
    } else {
      this.setData({
        userInfo: userInfo,
      });

      this.joinBack();
    }
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

  joinBack:function(){
    let _this = this;
    util.request(api.JoinBack,
      {
        id: _this.data.id,
        openid: _this.data.userInfo.openid,
      }, "POST").then(function (res) {
        if (res.rs === 1) {
          var data = res.data;
          _this.setData({
            code: data.code,
            lotteryTime: data.lotteryTime,
          });
        } else {
          _this.$wuxToast.show({ type: 'forbidden', text: res.info, });
        }
      });
  },

  //跳转到我的一元夺宝（查看详情）
  toMydollarTreasure:function(){
    wx.redirectTo({
      url: '/pages/shopping/mydollarTreasure/mydollarTreasure?id='+this.data.id,
    })
  },

  //跳转到一元夺宝(知道了)
  toDollarTreasure:function(){
    wx.redirectTo({
      url: '/pages/shopping/dollarTreasure/dollarTreasure?id=' + this.data.id,
    })
  },

  toEditUserInfo: function () {
    wx.redirectTo({
      url: '/pages/ucenter/yourinfor/yourinfor',
    })
  }
  

})