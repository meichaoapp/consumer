var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
const cart = require('../../../services/cart.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchantId:0,
    merchant:{},
    selectedType: "shop_1",
    selectedSubType: "",
    goodsList: [], //商品信息集合
    start: 1, // 页码
    totalPage: 0, // 共有页
    limit: 10,//每页条数
    hideHeader: true, //隐藏顶部提示
    hideBottom: true, //隐藏底部提示
    srollViewHeight: 0, //滚动分页区域高度
    refreshTime: '', // 刷新的时间
    loadMoreData: '上滑加载更多',
    classifyList: [],//分类导航
    cartselfGoodsList: [],//购物车自营商品列表
    cartmerchatGoodsList: [],//购物车团购商品列表
    cartcouponGoodsList: [], //优惠券商品列表
    cartb2cGoodsList: [],//电商购物车商品列表
    needPay: 0.00, // 购物车核算价格
    goodsNums: 0, //商品数量
    showModal: false,
    pid: 0,//分享携带的页面ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    var mid = options.mid;
    var pid = options.pid;
    if (mid == undefined) { mid = null; }
    if (pid == undefined) { pid = 0; }
    _this.setData({
      merchantId: mid,
      pid: pid,
    });
    _this.checkUser(mid);
    _this.queryList();
  },

  //检查用户
  checkUser: function (mid) {
    let _this = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (util.isNotNULL(userInfo)) {
      _this.setData({ userInfo: userInfo, });
    } else {
      wecache.put("pid", _this.data.pid, 0);
      wecache.put("mid", mid != null ? mid : 0, 0);
      wx.redirectTo({
        url: '/pages/auth/wxLogin/wxLogin'
      });
    }

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.refreshCartRef();
  },

  
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.refresh();
  },

  //触底后加载更多
  lower() {
    this.loadMore();
  },
  // 上拉加载更多
  loadMore: function () {
    let _this = this;
    // 当前页是最后一页
    if (_this.data.start >= _this.data.totalPage) {
      _this.setData({
        loadMoreData: '我是有底线的',
        hideBottom: false
      })
      return;
    }
    setTimeout(function () {
      _this.setData({
        start: _this.data.start + 1,
        hideBottom: false
      })
      _this.queryList();
    }, 300);
  },

  // 下拉刷新
  refresh: function (e) {
    let _this = this;
    setTimeout(function () {
      _this.setData({
        start: 1,
        refreshTime: new Date().toLocaleTimeString(),
        hideHeader: false
      })
      _this.queryList();
      wx.stopPullDownRefresh();
    }, 300);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let _this = this;
    return {
      title: '美超电商分享',
      desc: '美超电商',
      path: '/pages/b2c/index/index?pid=5&mid=' + _this.data.merchantId,
    }
  },

  /**
  * 去个人中心
  */
  toUserCenter: function () {
    wx.switchTab({
      url: '/pages/ucenter/index/index',
    })
  },

  /**
   * 订单中心
   */
  toOrder: function () {
    wx.navigateTo({
      url: '/pages/ucenter/b2cOrder/orders',
    })
  },


  /**
   * 去详情页
   */
  toDetail:function(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/b2c/details/details?id=' + id,
    })
  },

  /**
    * 去客服聊天界面
    */
  toCustomerServiceBox: function () {
    let _this = this;
    wx.navigateTo({
      url: '/pages/b2c/customerService/customerService?mid=' + _this.data.merchant.merchantId,
    })
  },


  queryList: function () {
    let _this = this;
    let data = {
      merchantId: _this.data.merchantId,//店铺id
      start: _this.data.start,     //分页开始页  必填
      limit: _this.data.limit,    //当前页共显示多少条  必填
     //type: _this.data.selectedType,  // 分类值
      //subType: _this.data.selectedSubType,  // 子分类值
      searchTxt: "",  // 搜索
    };

    util.request(api.QueryShopList, data, "POST").then(function (res) {
      var goodsList = res.data.list;
      if (goodsList) {
        if (_this.data.start == 1) { // 下拉刷新
          _this.setData({
            merchant: res.data.merchant,
            goodsList: goodsList,
            hideHeader: true,
            totalPage: res.data.totalPage,
          })
        } else {
          var tempArray = _this.data.goodsList;
          if (tempArray != null && goodsList != null) {
            tempArray = tempArray.concat(goodsList);
          }
          _this.setData({
            merchant: res.data.merchant,
            goodsList: tempArray,
            totalPage: res.data.totalPage,
          })
        }
      }
    })

  },

  //刷新购物车相关
  refreshCartRef: function () {
    let _this = this;
    var _arr = cart.loadCart();//购物车商品
    var cartselfGoodsList = [];
    var cartmerchatGoodsList = [];
    var cartcouponGoodsList = [];
    var cartb2cGoodsList = [];

    var cartselfGoodsListTmp = [];
    var cartmerchatGoodsListTmp = [];
    var cartcouponGoodsListTmp = [];
    var cartb2cGoodsListTmp = [];
    console.log("cart goods ---" + JSON.stringify(_arr));
    if (null != _arr && _arr.length > 0) {
      var len = _arr.length;
      for (var i = 0; i < len; i++) {
        var productType = _arr[i].productType;
        if (productType == 1) {
          cartmerchatGoodsListTmp.push(_arr[i]);
        } else if (productType == 3) {
          cartselfGoodsListTmp.push(_arr[i]);
        } else if (productType == 5) {
          cartcouponGoodsListTmp.push(_arr[i]);
        } else if (productType == 6) {
          cartb2cGoodsListTmp.push(_arr[i]);
        }
      }
    }

    _this.setData({
      needPay: cart.loadPrice().toFixed(2), // 购物车核算价格
      goodsNums: cart.loadGooodsNums(), //商品数量
      cartselfGoodsList: _this.createCartInfo(cartselfGoodsListTmp, cartselfGoodsList),//购物车自营商品列表
      cartmerchatGoodsList: _this.createCartInfo(cartmerchatGoodsListTmp, cartmerchatGoodsList),//购物车团购商品列表
      cartcouponGoodsList: _this.createCartInfo(cartcouponGoodsListTmp, cartcouponGoodsList), //优惠券列表
      cartb2cGoodsList: _this.createCartInfo(cartb2cGoodsListTmp, cartb2cGoodsList),
    });
  },
  //组装购物车信息
  createCartInfo: function (tmpList, cartList) {
    let _this = this;
    if (tmpList) {
      tmpList.forEach(goods => {
        cartList = _this.checkAndFill(goods, cartList);
      })
    }
    return cartList;
  },
  //检查和填充
  checkAndFill: function (item, cartList) {
    var obj = {
      merchantId: item.merchantId,
      merchantName: item.merchantName,
    };
    if (cartList.length > 0) {
      var inCar = false;
      cartList.forEach(o => {
        if (o.merchantId == item.merchantId) {
          var list = o.list;
          list.push(item);
          obj.list = list;
          inCar = true;
        }
      });
      if (!inCar) {
        var list = [];
        list.push(item);
        obj.list = list;
        cartList.push(obj);
      }
    } else {
      var list = [];
      list.push(item);
      obj.list = list;
      cartList.push(obj);
    }

    return cartList;
  },
  //减
  cutNumber: function (e) {
    let _this = this;
    var sid = e.currentTarget.dataset.sid;
    var type = e.currentTarget.dataset.type;
    var id = cart.appendPrefix(type, sid);
    var g = cart.loadCartGoods(id);
    if (g != null) {//如果购物车以前有则更新
      g.number = (g.number - 1);
      if (g.number <= 0) {
        cart.removeCart(id);
      } else {
        cart.updateCart(g);
      }
    }

    _this.refreshCartRef();
  },
  //加
  addNumber: function (e) {
    let _this = this;
    var sid = e.currentTarget.dataset.sid;
    var type = e.currentTarget.dataset.type;
    var id = cart.appendPrefix(type, sid);

    var g = cart.loadCartGoods(id);
    //console.log("购物无车商品---" + JSON.stringify(g));
    var number = g.number + 1;
    if (g.limitNum) {
      if ((g.joinNum + number) > g.limitNum) {
        wx.showToast({
          icon: "none",
          title: '已超过库存!',
        })
        return;
      }
    }

    if (null != g.buyLimitNum &&
      0 != g.buyLimitNum && number > g.buyLimitNum) {
      wx.showToast({
        icon: "none",
        title: '此商品每人只能买' + g.buyLimitNum + "份",
      })
      return;
    }
    g.number = g.number + 1;
    cart.updateCart(g);

    _this.refreshCartRef();
  },
  ///清除购物车商品
  clearCart: function () {
    let _this = this;
    cart.cleanCart();
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