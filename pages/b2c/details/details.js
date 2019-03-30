// pages/b2c/details/details.js
var app = getApp();
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var WxParse = require('../../../lib/wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        basePath: app.globalData._base_path, //基础路径
        id:0,
        detail: {}, //商品详情
        merchant:{}, // 店铺信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
        _this.setData({
          id: options.id,
        });
        this.queryShopDetail();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

  /**
* 进入具体店铺
*/
  toShop: function () {
    let _this = this;
    wx.navigateTo({
      url: '/pages/b2c/shopIndex/shopIndex?mid=' + _this.data.merchant.merchantId,
    })
  },
   
    /**
     * 去客服聊天界面
     */
    toCustomerServiceBox:function() {
      wx.navigateTo({
        url: '/xxx/xx?mid=' + _this.data.merchant.merchantId,
      })
    },

    /**
     * 去电商首页
     */
    toIndex:function() {
      wx.redirectTo({
        url: '/pages/b2c/index/index',
      })
    },

    /**
     * 查询详情
     */
    queryShopDetail : function() {
        let that = this;
        util.request(api.QueryShopDetail, {id: that.data.id}, "POST").then(function (res) {
            if (res.rs == 1) {
                var data = res.data;
                let detail = data.detail;
                var  specifications = [
                  {
                      spec: "颜色分类",
                      details: ["黑色","深灰色"]
                  }
                ];
                detail.specifications = specifications;   
                that.setData({
                    detail:detail,
                    merchant: data.merchant, // 店铺信息
                })
               WxParse.wxParse('goodsDetail', 'html', res.data.detail.content, that);
            }
        });
    },

    /**
     * 加载规格信息
     */
    loadSpecs:function() {
      let that = this;
      util.request(api.LoadSpecs, { id: that.data.id }, "POST").then(function (res) {
        if (res.rs == 1) {
          var data = res.data;
          let detail = data.detail
          that.setData({
            detail: detail,
            merchant: data.merchant, // 店铺信息
          })
          WxParse.wxParse('goodsDetail', 'html', res.data.detail.content, that);
        }
      });
    },
    //打开规格弹窗
    openSpecsBox: function () {
        let that = this;
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        that.animation = animation
        animation.translateY(300).step()
        that.setData({
            animationData: animation.export(),
            specsStatus: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    hideSpecsBox: function () {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                specsStatus: false,
            })
        }.bind(this), 200)
    },
})