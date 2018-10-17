var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 查看用户微信版本是否支持
    userInfo:null,
  },
  onLoad: function (options) {
    this.$wuxToast = app.Wux().$wuxToast
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
    var _this = this;
    var wxUser = e.detail.userInfo;
    console.log("userInfo" + wxUser)
    user.wxLogin(wxUser).then(res => {
      if(res.rs == 1){
        _this.setData({
          userInfo: res.data.user
        });
        app.globalData.userInfo = res.data.user;
        app.globalData.token = res.data.token;
        wx.navigateBack({
          delta: 1
        })
      }else{
        _this.$wuxToast.show({ type: 'forbidden', text: "登录失败，请重试！", });
      }
     
    }).catch((err) => {
      _this.$wuxToast.show({ type: 'forbidden', text: "提交失败，请重试！", });
      console.log(err)
    });
  },
 
})