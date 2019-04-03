//获取应用实例
var user = require('../../../services/user.js');
const wecache = require('../../../utils/wecache.js');
const app = getApp();
const currentMerchat = "currentMerchat";
const currIndex = "currIndex";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.globalData._base_path, //基础路径
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 查看用户微信版本是否支持
    userInfo: null,
    merchant: {},//选中的团长信息
    count:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //确认商户授权用户
  login: function (e) {
    var _this = this;
    if (_this.data.count > 0) {
      return;
    }
    _this.setData({
      count: _this.data.count + 1,
    });
    var wxUser = e.detail.userInfo;
    console.log("userInfo---------------------" + JSON.stringify(wxUser))
    user.wxLogin(wxUser).then(res => {
      if (res.rs == 1) {
        var userInfo = res.data.user;
        var session_key = userInfo.session_key;
        console.log("userInfo--------" + JSON.stringify(userInfo))
        _this.setData({
          userInfo: userInfo
        });
        app.globalData.userInfo = userInfo;
        app.globalData.token = res.data.token;
        wx.setStorageSync('userInfo', userInfo);
        wx.setStorageSync('token', res.data.token);
        //清除购物车缓存
        //cart.cleanCart();

        let bindingPhone = userInfo.bindingPhone;
        console.log("bindingPhone --- " + bindingPhone);
        if (null == bindingPhone || "" == bindingPhone) { // 未绑定手机号
          wx.navigateTo({
            url: '/pages/auth/mobileBind/mobileBind?session_key=' + session_key,
          })
        } else { //已绑定
          var pid = wecache.get("pid", 0);
          var mid = wecache.get("mid", 0);
          var did = wecache.get("did", 0);
          if(0 == pid) { //正常搜索进入
            //选择进入通道
            wx.redirectTo({
              url: '/pages/auth/selectEntry/selectEntry',
            })
          }else if (1 == pid || pid  == 2) { //拼团首页和拼团详情页
            wx.redirectTo({
              url: '/pages/auth/choiceMerchant/choiceMerchant',
            })
          }else if(3 == pid){ // 电商首页
            wx.redirectTo({
              url: '/pages/b2c/index/index',
            })
          }else if(4 == pid) {// 电商详情页
            wx.redirectTo({
              url: '/pages/b2c/details/details?id=' + did,
            })
          } else if (5 == pid) {// 电商详情页
            wx.redirectTo({
              url: '/pages/b2c/shopIndex/shopIndex?mid=' + mid,
            })
          }else{
            wx.redirectTo({
              url: '/pages/auth/choiceMerchant/choiceMerchant',
            })
          }
         
        }


      } else {
        _this.setData({
          count: 0,
        });
        wx.showToast({
          icon:'none',
          title: res.info,
        })
      }

    }).catch((err) => {
      _this.setData({
        count: 0,
      });
      wx.showToast({
        icon: 'none',
        title: "提交失败，请重试！",
      })
    });
  },

  
})