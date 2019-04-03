// pages/orderConfirm/orderConfirm.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const cart = require('../../services/cart.js');
const log = require('../../services/log.js');
const currentMerchat = "currentMerchat";
const buyGoodsCache = "buyGoodsCache";

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.globalData._base_path, //基础路径
    userInfo: null,
    merchant:null,
    deliveryType:1,
    totalPay: 0.00,//共付
    needPay: 0.00,// 应付
    preferential:0.00,//优惠
    merchantId: 1,// 店铺id
    merchantOrder: {},// 团购订单
    oneselfOrder: {}, // 自营订单
    couponOrders:[],
    couponOrder:{},
    b2cOrders:[],//电商商品
    count: 0, //提交计数
    orderGoods:[],
    isShowPostInfo:false, // 是否显示邮寄信息
    isSplitOrder:false, //是否拆单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    this.setData({
      count: 0, //提交计数
      orderGoods: (options.type == 0) ? cart.loadCart() : wx.getStorageSync(buyGoodsCache),
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      count: 0, //提交计数
    });
    let _this = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (null != userInfo && userInfo != "" && undefined != userInfo) {
      _this.setData({
        userInfo: userInfo,
      });
    }
    _this.loadOrderInfo();
  },

  /**
   * 加载订单确认页信息
   */
  loadCartOrders:function() {
      let _this = this;
      var orders = [];
      var orderGoods = _this.data.orderGoods;
      orderGoods.forEach(o => {
         var order = {
           "productId": o.sid, // 团购id
           "detailId": o.sid, // 商品id
           "merchantId": o.merchantId,// 店铺id
           "productType": o.productType,// 类型 1 团购 3 自营 5 优惠券 6 电商 
           "buyNum": o.number, //购买总数量
         };
         orders.push(order);
      });
      var data = {
        order:orders,
      };
      
  },

  //减
  cutNumber: function (e) {
    let _this = this;
    var id = e.currentTarget.dataset.id;
    var goodsList = _this.data.orderGoods;
    if (goodsList != null && goodsList.length > 0) {
      goodsList.forEach(o => {
        if (o.id == sid) {
          o.number = o.number - 1;
          if (o.number <= 1) {
            o.number = 1;
          }
        }
      });
    }
    _this.setData({
      orderGoods: goodsList,
    });
    _this.loadOrderInfo();
  },
  //加
  addNumber: function (e) {
    let _this = this;
    var id = e.currentTarget.dataset.id;
    var goodsList = _this.data.orderGoods;
    if (goodsList != null && goodsList.length > 0) {
      goodsList.forEach(o => {
        if (o.id == sid) {
          var num = o.number + 1;
          if ((o.joinNum + num) > o.limitNum) {
            wx.showToast({
              icon: "none",
              title: '已超过库存!',
            })
            return;
          }
          if (null != o.buyLimitNum && num > o.buyLimitNum) {
            wx.showToast({
              icon: "none",
              title: '此商品每人只能买' + o.buyLimitNum + "份",
            })
            return;
          }
          o.number = num;
        }
      });
    }
    _this.setData({
      orderGoods: goodsList,
    });
    _this.loadOrderInfo();
  },
 
  //切换取货方式
  switchDeliveryType: function(e) {
    let _this = this;
    let type = e.currentTarget.dataset.type;
    _this.setData({
      deliveryType: type,
      isShowPostInfo: ((_this.data.b2cOrders.length > 0) || (type==2)), 
    });
    _this.loadOrderInfo();
  },
  /**
   * 加载订单信息
   */
  loadOrderInfo:function(){
    let _this = this;

    var _data = cart.createOrder(0, _this.data.merchant.merchantId,
     _this.data.userInfo, _this.data.deliveryType, _this.data.merchant, _this.data.orderGoods );
    //console.log("loadOrderInfo----" + JSON.stringify(_data));
    var merchantOrder = _data.merchantOrder;
    var oneselfOrder = _data.oneselfOrder;
    var couponOrders = [];
    var couponOrder = _data.couponOrder;
    var b2cOrders = [];
    var b2cOrder = _data.b2cOrder;

    ////处理优惠券订单
    if (null != _data.couponOrder){
      var gList = couponOrder.goodsList;
      var merchants = _this.getGoodsMerchants(gList);
      if (merchants.length > 0) {
        for (var i = 0; i < merchants.length; i++) {
          var order = {
            merchant: merchants[i],
          }
          var  list = []
          gList.forEach(o => {
            if (merchants[i].merchantId == o.merchantId) {
              list.push(o)
            }
          });
          order.goodsList = list;
          couponOrders.push(order);
        }
      }
    }
    ////处理电商
    if (b2cOrder) {
      var gList = b2cOrder.goodsList;
      var merchants = _this.getGoodsMerchants(gList);
      if (merchants.length > 0) {
        for (var i = 0; i < merchants.length; i++) {
          var order = {
            merchant: merchants[i],
          }
          var list = []
          gList.forEach(o => {
            if (merchants[i].merchantId == o.merchantId) {
              list.push(o)
            }
          });
          order.goodsList = list;
          b2cOrders.push(order);
        }
      }
    }

    ////判断是否拆单
    var isSplitOrder = false;
    if ((merchantOrder != null && oneselfOrder != null) ||
      (merchantOrder != null && b2cOrders.length > 0) ||
      (oneselfOrder != null && b2cOrders.length > 0) ||
      (merchantOrder != null && couponOrders.length > 0) ||
      (b2cOrders.length > 0 && couponOrders.length > 0) ||
      (couponOrders.length > 0 && oneselfOrder != null)) {
      isSplitOrder = true;
    }

    _this.setData({
      totalPay: _data.totalPay.toFixed(2),//共付
      needPay: _data.needPay.toFixed(2),// 应付
      preferential: (_data.totalPay - _data.needPay).toFixed(2),
      merchantOrder: merchantOrder,// 团购订单
      oneselfOrder: oneselfOrder, // 自营订单
      couponOrders: couponOrders,// 优惠券
      b2cOrders:b2cOrders,//电商订单
      isShowPostInfo: ((b2cOrders.length > 0) || (_this.data.deliveryType == 2)), 
      isSplitOrder: isSplitOrder,
    });
  },
  

  /**
   * 获取商品中的商户集合
   */
  getGoodsMerchants: function (gList) {
    var merchants = [];
    gList.forEach(o => {
      var m = {
        "merchantId": o.merchantId,
        "merchantName": o.merchantName,
        "address": o.address,
        "merchantPhone": o.merchantPhone,
      }
      var isUiq = true;
      if (merchants.length > 0) {
        for (var i = 0; i < merchants.length; i++) {
          if (merchants[i].merchantId == m.merchantId) {
            isUiq = false;
            break;
          }
        }
      }
      if (isUiq) {
        merchants.push(m);
      }
    });
    return merchants;
  },

  getOrderDatas: function(){
    let _this = this;
    var _data = cart.createOrder(1, _this.data.merchant.merchantId, _this.data.userInfo, _this.data.deliveryType, _this.data.merchant, _this.data.orderGoods);
    ////组装电商商品
    var shopOrder = null;
   
    return {
      userId: _this.data.userInfo.id,
      merchantId: _this.data.merchant.merchantId,
      totalPay: _data.totalPay.toFixed(2),//共付
      needPay: _data.needPay.toFixed(2),
      merchantOrder: _data.merchantOrder,// 团购订单
      oneselfOrder: _data.oneselfOrder, // 自营订单
      discountCouponOrder: _data.couponOrder,//优惠券订单
      shopOrder: _data.b2cOrders,
    };
  },

  //参团
  joinGroup: function () {
    //1.创建订单
    let _this = this;
    if (_this.data.count > 0) {
      return;
    }
    _this.setData({
      count: _this.data.count + 1,
    });

    if (_this.data.deliveryType == 2 && (_this.data.userInfo.address == "" || _this.data.userInfo.address == null) ){
      _this.setData({
        count: 0,
      });
      wx.showToast({
        icon: "none",
        title: '送货上门，请完善用户信息!',
      })
      return false;
    }

    var order = _this.getOrderDatas();
    console.log("order--- " + JSON.stringify(order));
    util.request(api.CreateOrderNew, order, "POST").then(function (res) {

      if (res.rs === 1) { //创建成功
        var data = res.data;
        log.collectLog(0, "订单确认页-创建订单返回", "groupPurchase/createorder", JSON.stringify(order), JSON.stringify(res), "", _this.data.userInfo.id);
        //console.log(res.data.wxPayResponse);

        // wx.redirectTo({
        //   url: '/pages/details/success?id=' + data.id,
        // })
        // cart.cleanCart();
        // return;


        var wxPayResponse = res.data.wxPayResponse;
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        wx.requestPayment(
          {
            'timeStamp': wxPayResponse.timeStamp,
            'nonceStr': wxPayResponse.nonceStr,
            'package': "prepay_id=" + wxPayResponse.prepayId,
            'signType': 'MD5',
            'paySign': wxPayResponse.sign,
            'success': function (res) {
              cart.cleanCart();
              //跳转成功页
              wx.redirectTo({
                url: '/pages/details/success?id=' + data.id,
              })
            },
            'fail': function (res) {
              _this.setData({
                count: 0,
              });
              wx.showToast({
                icon: "none",
                title: '参团失败请重试!',
              })
              return false;
            },
            'complete': function (res) {

            }
          })

      } else {
        _this.setData({
          count: 0,
        });
        wx.showToast({
          icon: "none",
          title: res.info,
        })
        return false;
      }
    }).catch((err) => {
      _this.setData({
        count: 0,
      });
      wx.showToast({
        icon: "none",
        title: err.info,
      })
      console.log(err)
    });
  },
  toEditUser:function() {
     wx.navigateTo({
       url: '/pages/ucenter/yourinfor/yourinfor?tag=0',
     })
  },
  //跳转首页
    toIndex: function () {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
   
  
   
   /**
    * 监听
    */
  lisentWords:function(e) {
    let _this = this;
    let mid = e.currentTarget.dataset.mid;
    let val = e.detail.value;
    var b2cOrders = _this.data.b2cOrders;
    if(b2cOrders) {
      b2cOrders.forEach(order => {
        if(order.merchant.merchantId == mid) {
          order.remark = val;
        }
      });
    }
    _this.setData({
      b2cOrders:b2cOrders
    });
  },
})
