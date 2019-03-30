var user = require('../../../services/user.js');
const cart = require('../../../services/cart.js');
const app = getApp();
const currentMerchat = "currentMerchat";
const currIndex = "currIndex";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    merchant: {},//选中的团长信息
    count: 0,
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

  /**
   * 选择入口
   */
  selectEntry: function(e) {
    let type = e.currentTarget.dataset.type;
    if(type == 1) { //团购
      let merchant = wx.getStorageSync(currentMerchat);
      if (merchant) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        wx.redirectTo({
          url: '/pages/auth/choiceMerchant/choiceMerchant',
        })
      }
    }else{
      wx.redirectTo({
        url: '/pages/b2c/index/index',
      })
    }
   
  },

})