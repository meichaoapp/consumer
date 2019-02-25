// pages/details/details.js
var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const wecache = require('../../utils/wecache.js');
const cart = require('../../services/cart.js');
const currentMerchat = "currentMerchat";
const currIndex = "currIndex";
const buyGoodsCache = "buyGoodsCache";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.globalData._base_path, //基础路径
    userInfo: {},
    id: 0,
    count: 0, //提交计数
    detail: {}, //团购详情
    merchant: {},//商家
    friensList: [],
    showModal: false,
    modalTitle: "",
    disabledOpt: false,
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

    var merchantId = 0;
    let merchant = wx.getStorageSync(currentMerchat);
    if (null != merchant && undefined != merchant) {
      if (merchant.merchantId == undefined
        || merchant.merchantId == null
        || merchant.merchantId == "") {
        //清空缓存
        wx.clearStorageSync();
        wx.clearStorage();
        wx.navigateTo({
          url: '/pages/auth/login/login'
        });
      } else {
        merchantId = merchant.merchantId;
      }
    } else {
      //清空缓存
      wx.clearStorageSync();
      wx.clearStorage();
      wx.navigateTo({
        url: '/pages/auth/login/login'
      });
    }
    console.log("merchantId-------------" + merchantId);
    this.queryCouponDetail(merchantId);
    //this.friends();


    // 页面显示
    let userInfo = wx.getStorageSync('userInfo');
    if (null != userInfo && userInfo != "" && undefined != userInfo) {
      this.setData({
        userInfo: userInfo,
      });
    } else {
      wx.navigateTo({
        url: '/pages/auth/login/login'
      });
    }


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
        if (undefined != friensList) {
          that.setData({
            friensList: friensList,
          });
        }

      }
    });
    console.log()
  },

  ////获取货品信息
  queryCouponDetail: function (merchantId) {
    let that = this;
    util.request(api.QueryCouponDetails, { id: that.data.id }, "POST").then(function (res) {
      if (res.rs == 1) {
        var data = res.data;
        console.log("QueryCouponDetails --- " + JSON.stringify(data));
        var detail = data.detail;
        var disabledOpt = false;
        if (detail.detailStatus == 1) { disabledOpt = true; }
        if (detail.joinNum >= detail.limitNum) { disabledOpt = true; }
        that.setData({
          detail: detail, //团购详情
          disabledOpt: disabledOpt,
        });
        WxParse.wxParse('goodsDetail', 'html', res.data.detail.content, that);
        that.countDown();

        var merchant = data.merchant;
        that.setData({
          merchant: merchant,//商家
        });
      }
    });

  },

  addCart: function () {
    let _this = this;
    var goods = {
      "id": _this.data.detail.id, //id
      "name": _this.data.detail.name, //团购名称
      "url": _this.data.detail.url, //展示url
      "price": _this.data.detail.price, //团购价
      "marketPrice": _this.data.detail.marketPrice,//市场价/原价
      "status": _this.data.detail.status, //0 未开始 1 进行中 2 已成团 3 已过期
      "productType": _this.data.detail.productType, //商品类型 1.普通团品 2. 一元购 3. 店长自营产品
      "limitNum": _this.data.detail.limitNum, //参团人数上限
      "joinNum": _this.data.detail.joinNum, //参团人数
      "buyLimitNum": _this.data.detail.buyLimitNum, // 单品购买限制
      "merchantId": _this.data.merchant.merchantId,
      "merchantName": _this.data.merchant.merchantName,
      "address": _this.data.merchant.address,
      "merchantPhone": _this.data.merchant.merchantPhone,
    };

    var g = cart.loadCartGoods(goods.id);
    console.log("购物无车商品---" + JSON.stringify(g));
    if (g == null) {//如果没有则加入购物车
      if ((goods.joinNum + 1) > goods.limitNum) {
        wx.showToast({
          icon: "none",
          title: '已超过库存!',
        })
        return;
      }
      goods.number = 1;
      cart.add2Cart(goods);
    } else {//如果购物车以前有则更新购物车商品数量
      g.number = g.number + 1;
      if ((g.joinNum + g.number) > g.limitNum) {
        wx.showToast({
          icon: "none",
          title: '已超过库存!',
        })
        return;
      }
      if (null != g.buyLimitNum && g.number > g.buyLimitNum) {
        wx.showToast({
          icon: "none",
          title: '此商品每人只能买' + o.buyLimitNum + "份",
        })
        return;
      }
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
            let hou = parseInt(time % (60 * 60 * 24) / 3600);
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
    //_this.addCart();
    var goods = {
      "id": _this.data.detail.id, //id
      "name": _this.data.detail.title, //团购名称
      "url": _this.data.detail.goodsPic, //展示url
      "price": _this.data.detail.price, //团购价
      "marketPrice": _this.data.detail.marketPrice,//市场价/原价
      "status": _this.data.detail.status, //0 未开始 1 进行中 2 已成团 3 已过期
      "productType": _this.data.detail.productType, //商品类型 1.普通团品 2. 一元购 3. 店长自营产品
      "number": 1,
    };
    var goodsList = [];
    goodsList.push(goods);
    wx.setStorageSync(buyGoodsCache, goodsList);
    wx.navigateTo({
      url: '/pages/orderConfirm/orderConfirm?type=1'
    });
  },
  copyPhone() {
    let that = this;
    //复制到剪切板
    wx.setClipboardData({
      data: that.data.merchant.merchantPhone,
      success() {
        wx.hideToast();
        that.setData({
          modalTitle: "您已复制团长手机号",
          showModal: true
        });
      }
    })
  },
  copyWxCode() {
    let that = this;
    //复制到剪切板
    wx.setClipboardData({
      data: that.data.merchant.merchantPhone,
      success() {
        wx.hideToast();
        that.setData({
          modalTitle: "您已复制团长微信",
          showModal: true
        });
      }
    })
  },

  closeFloat() {
    this.setData({
      modalTitle: "",
      showModal: false
    });
  }

})
