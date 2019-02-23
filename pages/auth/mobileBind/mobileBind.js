// pages/auth/mobileBind/mobileBind.js
const util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session_key:"",
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    this.setData({
      session_key: options.session_key,
    });
    let userInfo = wx.getStorageSync('userInfo');
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

  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if ("getPhoneNumber:ok" == e.detail.errMsg) {
      let _this = this;
      var data = {
        "userId": _this.data.userInfo.id, // id 用户id
        "encryptedData": e.detail.encryptedData, //从微信获取的手机号
        "iv": e.detail.iv,
        "session_key": _this.data.session_key,
      }
      
      util.request(api.PareseMobile, data, "POST").then(function (res) {
        if (res.rs == 1) {
          var mobile = res.data.phoneNumber;
          wx.navigateTo({
            url: '/pages/auth/mobileBind/normalBind?mobile=' + mobile,
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.info
          })
        }
      });
    }
  
  }


})