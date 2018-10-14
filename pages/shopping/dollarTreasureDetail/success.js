var app = getApp();
Page({
  data: {
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
  }
  

})