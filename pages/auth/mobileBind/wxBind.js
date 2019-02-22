// pages/auth/wxBind/wxBind.js
const util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     mobile:"",
     userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mobile: options.mobile,
      count: 0, //提交计数
    });

    let _this = this;
    let userInfo = wx.getStorageSync('userInfo');
    console.log("userinfo----" + userInfo);
    if (util.isNotNULL(userInfo)) {
      _this.setData({
        userInfo: userInfo,
      });
    }

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  
  /**
   * 绑定手机号
   */
  submit:function() {
    let _this = this;
    var data = {
      "userId": _this.data.userInfo.id, // id 用户id
      "wxPhone": _this.data.mobile, //从微信获取的手机号
      "phone": "" // 用户自主填的手机号
    }
    util.request(api.BindMobile, data, "POST").then(function (res) {
       if(res.rs == 1) {
         wx.showToast({
           title: '恭喜您绑定成功！',
         })
         //更新缓存信息
         userInfo.bindingPhone = _this.data.mobile;
         wx.setStorageSync('userInfo', userInfo);
         //跳转首页
         wx.switchTab({
           url: '/pages/index/index',
         })
       }else {
         wx.showToast({
           icon: "none",
           title: res.info
         })
       }
    });
  },

  /**
   * 拒绝
   */
  refuse:function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
 
})