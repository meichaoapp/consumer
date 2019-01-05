var app = getApp();
Page({
  data: {
     basePath: app.globalData._base_path, //基础路径
     id : 0,
  },
  onLoad: function (options) {
    this.setData({
      id: parseInt(options.id)
    });
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

  //查看团购订单
  toOrder:function(){
    wx.redirectTo({
      url: '/pages/ucenter/order/order?id='+this.data.id,
    })
  },

  //跳转首页(知道了)
  toIndex:function(){
     wx.switchTab({
       url: '/pages/index/index',
     })
  }
  

})