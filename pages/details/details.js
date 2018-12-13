// pages/details/details.js
var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const wecache = require('../../utils/wecache.js');
const cart = require('../../services/cart.js');
const currentMerchat = "currentMerchat";
const currIndex = "currIndex";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    id: 0,
    count: 0, //提交计数
    detail: {}, //团购详情
    merchant: {},//商家
    friensList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 页面初始化 options为页面跳转所带来的参数
    this.$wuxLoading = app.Wux().$wuxLoading //加载
    this.$wuxToast = app.Wux().$wuxToast
    this.setData({
      id: parseInt(options.id),
      count: 0, //提交计数
    });
    this.queryGroupPurchaseDetail();
    this.friends();

    var source = options.source; //跳转来源
    if (source == 1) {
      var merchantId = options.mid;
      let merchant = wx.getStorageSync(currentMerchat);
      let currentIndex = wx.getStorageSync(currIndex);
      if (null != merchant && undefined != merchant && null != currentIndex && undefined != currentIndex) {
        if (merchantId != that.data.merchant.merchantId) {
          //切换商户
          that.swithchMerchats(merchantId);
          //清空购物车
          cart.cleanCart();
        }

      } else {
        //切换商户
        that.swithchMerchats(merchantId);
        //清空购物车
        cart.cleanCart();
      }
    }

    // 页面显示
    let userInfo = wx.getStorageSync('userInfo');
    console.log("userInfo -------" + userInfo);
    if (null != userInfo && userInfo != "" && undefined != userInfo) {
      console.log("userInfo -------" + JSON.stringify(userInfo));
      this.setData({
        userInfo: userInfo,
      });
    } else {
      wx.navigateTo({
        url: '/pages/auth/login/login'
      });
    }
   
   

  },

  //切换商户列表信息
  swithchMerchats: function (merchantId) {
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude//维度
        var longitude = res.longitude//经度
        ///设置当前地理位置
        that.setData({
          latitude: latitude,
          longitude: longitude,
        });

        var data = {
          "longitude": that.data.longitude,//经度
          "latitude": that.data.latitude,//纬度
        };
        util.request(api.QueryMerchants, data, "POST").then(function (res) {
          console.log('------商户信息', res);
          if (res.rs === 1) {
            var merchantList = res.data;
            var merchant = null;
            let currentIndex = 0;
            if (null != merchantList) {
              for (var i = 0; i < merchantList.length; i++) {
                if (merchantList[i].merchantId == merchantId) {
                  currentIndex = i;
                  merchant = merchantList[i];
                }
              }
              //缓存当前商户信息
              wx.setStorageSync(currentMerchat, merchant);
              //缓存当前商户的index值，方便首页读取，设置选中状态
              wx.setStorageSync('currIndex', currentIndex);
            }
          }
        });

      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示
    let userInfo = wx.getStorageSync('userInfo');

    if (null != userInfo || userInfo != "" || undefined != userInfo) {
      this.setData({
        userInfo: userInfo,
      });
    }

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      title: that.data.detail.title,
      imageUrl: that.data.detail.goodsPic,
      path: '/pages/details/details?source=1&id=' + that.data.id + "&mid=" + that.data.merchant.merchantId,
    }
  },

  //参团好友
  friends: function () {
    let that = this;
    util.request(api.Friends, { id: that.data.id }, "POST").then(function (res) {
      if (res.rs === 1) {
        var data = res.data;
        var friensList = data.list;
       
        that.setData({
          friensList: friensList,
        });
      }
    });
    console.log()
  },

  ////获取货品信息
  queryGroupPurchaseDetail: function () {
    let that = this;
    util.request(api.QueryGroupPurchaseGoodsDetail, { id: that.data.id }, "POST").then(function (res) {
      if (res.rs == 1) {
        var data = res.data;
        console.log("queryGroupPurchaseDetail --- " + JSON.stringify(data));
        var detail = data.detail;
        that.setData({
          detail: detail, //团购详情
          merchant: data.merchant,//商家
        });
        WxParse.wxParse('goodsDetail', 'html', res.data.detail.content, that);
        that.countDown();
      }
    });

  },

  addCart: function () {
    let _this = this;
    if (_this.data.detail.status != 1) {
      wx.showToast({
        title: '未在团购中!',
      })
      return;
    }
    var goods = {
      "id": _this.data.detail.id, //id
      "name": _this.data.detail.title, //团购名称
      "url": _this.data.detail.goodsPic, //展示url
      "price": _this.data.detail.price, //团购价
      "marketPrice": _this.data.detail.marketPrice,//市场价/原价
      "status": _this.data.detail.status, //0 未开始 1 进行中 2 已成团 3 已过期
      "productType": _this.data.detail.productType, //商品类型 1.普通团品 2. 一元购 3. 店长自营产品
    };

    var g = cart.loadCartGoods(goods.id);
    console.log("购物无车商品---" + JSON.stringify(g));
    if (g == null) {//如果没有则加入购物车
      goods.number = 1;
      cart.add2Cart(goods);
    } else {//如果购物车以前有则更新购物车商品数量
      var num = g.number;
      g.number = num + 1;
      cart.updateCart(g);
    }
    wx.showToast({
      title: '添加购物车成功!',
    })
  },

  //小于10的格式化函数
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let countDownArr = [];
   //0 未开始 1 进行中 2 已成团 3 已过期
    let o = this.data.detail;
    if (o != null & o != undefined) {
      //console.log("1 o.status---" + o.status);
      if (o.status == 0 || o.status == 1) {
        // 对结束时间进行处理渲染到页面
        let startTime = new Date(o.startTime).getTime();
        let endTime = new Date(o.endTime).getTime();

        if (newTime - startTime >= 0) {
          // 如果活动未结束，对时间进行处理
          if (endTime - newTime > 0) {
            let time = (endTime - newTime) / 1000;
            // 获取天、时、分、秒
            let day = parseInt(time / (60 * 60 * 24));
            let hou = parseInt(time % (60 * 60 * 24) / 3600) + 24 * day;
            let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
            let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);

            o.day = this.timeFormat(day);
            o.hour = this.timeFormat(hou);
            o.min = this.timeFormat(min);
            o.sec = this.timeFormat(sec);
            o.status = 1; // 设置状态为进行中
          } else {//活动已结束，全部设置为'00'
            o.status = 2;
            o.day = this.timeFormat(0);
            o.hour = this.timeFormat(0);
            o.min = this.timeFormat(0);
            o.sec = this.timeFormat(0);
          }
        } 
      }

       //console.log("o.status---" + o.status);


      this.setData({ detail: o })
    }
    // 渲染，然后每隔一秒执行一次倒计时函数
    setTimeout(this.countDown, 1000);
  },
  //跳转首页(知道了)
  toIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //去订单确认页
  toOrderConfirm: function () {
    let _this = this;
    if (_this.data.detail.status != 1) {
      wx.showToast({
        title: '未在团购中!',
      })
      return;
    }
    _this.addCart();
    wx.navigateTo({
      url: '/pages/orderConfirm/orderConfirm'
    });
  },

})
