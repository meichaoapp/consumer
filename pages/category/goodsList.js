// pages/category/goodsList.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const wecache = require('../../utils/wecache.js');
const cart = require('../../services/cart.js');
const pointKey = "userLocation";
const currentMerchat = "currentMerchat";

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.globalData._base_path, //基础路径
    goodsName:"",
    merchant: {},//选中的团长信息
    classify:1,
    start: 1, // 页码
    totalPage: 0, // 共有页
    limit: 10,//每页条数
    hideHeader: true, //隐藏顶部提示
    hideBottom: true, //隐藏底部提示
    srollViewHeight: 0, //滚动分页区域高度
    refreshTime: '', // 刷新的时间
    loadMoreData: '上滑加载更多',
    goodsList: [],//团购商品列表
    userInfo: null,
    classifyList: [],//分类导航
    cartselfGoodsList: [],//购物车自营商品列表
    cartmerchatGoodsList: [],//购物车团购商品列表
    needPay: 0.00, // 购物车核算价格
    goodsNums: 0, //商品数量
    showModal: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      classify: parseInt(options.classify),
      count: 0, //提交计数
    });
    this.$wuxLoading = app.Wux().$wuxLoading //加载
    let userInfo = wx.getStorageSync('userInfo');
    console.log("userinfo----" + userInfo);
    if (null != userInfo && userInfo != "" && undefined != userInfo) {
      this.setData({
        userInfo: userInfo,
      });
    }
    this.queryClassifyList();
    

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
    this.refreshCartRef();
    let userInfo = wx.getStorageSync('userInfo');
    console.log("userinfo----" + userInfo);
    if (null != userInfo && userInfo != "" && undefined != userInfo) {
      this.setData({
        userInfo: userInfo,
      });
    }
    let merchant = wx.getStorageSync(currentMerchat);
    if (null != merchant && undefined != merchant) {
      this.setData({
        merchant: merchant,
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    this.refresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  search:function() {
    let _this = this;
    _this.setData({
      start: 1,
      goodsList: [],
    })
    _this.queryTGList();
  },

  goodsNameInput:function(e) {
    var _this = this;
    this.setData({
      goodsName: e.detail.value,
    })
  },

  // 上拉加载更多
  loadMore: function () {
    let _this = this;
    // 当前页是最后一页
    if (_this.data.start == _this.data.totalPage) {
      _this.setData({ loadMoreData: '我是有底线的' })
      return;
    }
    setTimeout(function () {
      console.log('上拉加载更多');
      _this.setData({
        start: _this.data.start + 1,
        hideBottom: false
      })
      _this.queryTGList();
    }, 300);
  },

  // 下拉刷新
  refresh: function (e) {
    let _this = this;
    setTimeout(function () {
      console.log('下拉刷新');
      _this.setData({
        start: 1,
        refreshTime: new Date().toLocaleTimeString(),
        hideHeader: false
      })
      //_this.queryTGList();
      wx.stopPullDownRefresh();
    }, 300);
  },
  //切换分类
  switchClassifyList:function(e){
    let _this = this;
    let type = e.currentTarget.dataset.type;
    _this.setData({
      start: 1,
      classify: type,
      goodsList: [],
    })
    _this.queryTGList();
  },
  /**
   * 查询首页信息
   */
  queryClassifyList: function () {
    let that = this;
   
    util.request(api.QueryClassifys, {token:""}, "POST").then(function (res) {
      if (res.rs === 1) {
        console.log("queryClassifyList --- " + JSON.stringify(res.data));
        that.setData({
          classifyList: res.data,
        })
        that.queryTGList();
      }
    });

  },

  /**
    * 团购信息
    */
  queryTGList: function () {
    let _this = this;
    let classify = 1;
    _this.$wuxLoading.show({ text: '数据加载中', });
    classify = _this.data.classify;
    //console.log("sellType--"+sellType);
    let data = {
      "merchantId": _this.data.merchant.merchantId,//店铺id
      "start": _this.data.start,     //分页开始页  必填
      "limit": _this.data.limit,    //当前页共显示多少条  必填
      "previewFlag": -1,// 用于查询previewFlag为-1时，则可以预览新添的团品信息
      "classify": classify, // 销售类型被选中，默认为1
      "name": _this.data.goodsName,
    }
    util.request(api.QueryClassifyList, data, "POST").then(function (res) {
      _this.$wuxLoading.hide(); //隐藏加载动画
      var goodsList = res.data.list;
      if (goodsList != null && goodsList.length > 0) {
        goodsList.forEach(o => {
          o.number = 0;
        });
        var _arr = cart.loadCart();//购物车商品
        //console.log("cart goods ---" + JSON.stringify(_arr));
        if (null != _arr && _arr.length > 0) {
          var len = _arr.length;
          for (var i = 0; i < len; i++) {
            var gid = _arr[i].id;
            goodsList.forEach(o => {
              if (o.id == gid) {
                o.number = _arr[i].number;
              }
            });
          }
        }

      }
      if (_this.data.start == 1) { // 下拉刷新
        _this.setData({
          goodsList: goodsList,
          hideHeader: true,
          totalPage: res.data.totalPage,
        })
      } else {
        var tempArray = _this.data.goodsList;
        tempArray = tempArray.concat(goodsList);
        _this.setData({
          goodsList: tempArray,
          totalPage: res.data.totalPage,
        })
      }

      _this.refreshCartRef();
    })

  },
  //刷新购物车相关
  refreshCartRef: function () {

    let _this = this;

    var _arr = cart.loadCart();//购物车商品
    var cartselfGoodsList = [];
    var cartmerchatGoodsList = [];
    //console.log("cart goods ---" + JSON.stringify(_arr));
    if (null != _arr && _arr.length > 0) {
      var len = _arr.length;
      for (var i = 0; i < len; i++) {
        var productType = _arr[i].productType;
        if (productType == 1) {
          cartmerchatGoodsList.push(_arr[i]);
        } else if (productType == 3) {
          cartselfGoodsList.push(_arr[i]);
        }
      }
    }
    _this.setData({
      needPay: cart.loadPrice().toFixed(2), // 购物车核算价格
      goodsNums: cart.loadGooodsNums(), //商品数量
      cartselfGoodsList: cartselfGoodsList,//购物车自营商品列表
      cartmerchatGoodsList: cartmerchatGoodsList,//购物车团购商品列表
    });
  },
  //减
  cutNumber: function (e) {
    let _this = this;
    var id = e.currentTarget.dataset.id;
    var goodsList = _this.data.goodsList;
    if (goodsList != null && goodsList.length > 0) {
      goodsList.forEach(o => {
        if (o.id == id) {
          o.number = o.number - 1;
          if (o.number < 0) {
            o.number = 0;
          }
        }
      });
    }
    var g = cart.loadCartGoods(id);
    if (g != null) {//如果购物车以前有则更新
      g.number = (g.number - 1);
      if (g.number <= 0) {
        cart.removeCart(id);
      } else {
        cart.updateCart(g);
      }
    }

    _this.setData({
      goodsList: goodsList,
    });
    _this.refreshCartRef();
  },
  //加
  addNumber: function (e) {
    let _this = this;
    var id = e.currentTarget.dataset.id;
    var goodsList = _this.data.goodsList;
    var goods = null;
    if (goodsList != null && goodsList.length > 0) {
      goodsList.forEach(o => {
        if (o.id == id) {
          o.number = o.number + 1;
          goods = o;
        }
      });
    }

    var g = cart.loadCartGoods(id);
    //console.log("购物无车商品---" + JSON.stringify(g));
    if (g == null && goods != null) {//如果没有则加入购物车
      if ((goods.joinNum + 1) > goods.limitNum) {
        wx.showToast({
          icon: "none",
          title: '已超过库存!',
        })
        return;
      }
      cart.add2Cart(goods);
    } else {//如果购物车以前有则更新购物车商品数量
      g.number = g.number + 1;
      if ((goods.joinNum + g.number) > goods.limitNum) {
        wx.showToast({
          icon: "none",
          title: '已超过库存!',
        })
        return;
      }
      if (null != goods.buyLimitNum && g.number > goods.buyLimitNum) {
        wx.showToast({
          icon: "none",
          title: '此商品每人只能买' + goods.buyLimitNum + "份",
        })
        return;
      }
      cart.updateCart(g);
    }

    _this.setData({
      goodsList: goodsList,
    });
    _this.refreshCartRef();
  },
  ///清除购物车商品
  clearCart: function () {
    let _this = this;
    cart.cleanCart();
    var goodsList = _this.data.goodsList;
    if (goodsList != null && goodsList.length > 0) {
      goodsList.forEach(o => {
        o.number = 0;
      });
    }
    _this.setData({
      goodsList: goodsList,
    });
    _this.refreshCartRef();
  },
  //打开购物车详情
  openshopCar: function () {
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
      shopCarStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏购物车详情
  hideshopCar: function () {
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
        shopCarStatus: false,
      })
    }.bind(this), 200)
  },
  //去订单确认页
  toOrderConfirm: function () {
    let _this = this;
    if (_this.data.goodsNums <= 0) {
      return;
    }
    wx.navigateTo({
      url: '/pages/orderConfirm/orderConfirm?type=0'
    });
  },
})
