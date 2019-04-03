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
    _this.loadCartOrders();
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

    // util.request(api.LoadCartOrder, data, "POST").then(function (res) {
    //   if (res.rs === 1) {
    //     var orderInfo = res.data;
    //     var merchantOrders = orderInfo.merchantOrder;
    //     var oneselfOrders = orderInfo.oneselfOrder;
    //     var couponOrders = orderInfo.discountCouponOrder;
    //     var b2cOrders = orderInfo.shopOrder;
    //     ////判断是否拆单
    //     var isSplitOrder = false;
    //     if ((merchantOrders != null && oneselfOrders != null) ||
    //       (merchantOrders != null && b2cOrders != null) ||
    //       (oneselfOrders != null && b2cOrders != null) ||
    //       (merchantOrders != null && couponOrders != null) ||
    //       (b2cOrders != null && couponOrders != null) ||
    //       (couponOrders != null && oneselfOrders != null)) {
    //       isSplitOrder = true;
    //     }
    //     var isShowPostInfo = false;
    //     if (b2cOrders != null) {
    //       isShowPostInfo = true;
    //     }else {
    //       if (oneselfOrders != null) {
    //         oneselfOrders.forEach(o => {
    //           if (o.isDelivery == 2){
    //             isShowPostInfo = true;
    //           }
    //         });
    //       }
    //     }
    //     _this.setData({
    //       totalPay: orderInfo.totalPay,//共付
    //       needPay: orderInfo.needPay,// 应付
    //       preferential: 0.00,//优惠
    //       merchantOrders: merchantOrders,// 团购订单
    //       oneselfOrders: oneselfOrders, // 自营订单
    //       couponOrders: couponOrders,
    //       b2cOrders: b2cOrders,//电商商品
    //       isShowPostInfo: isShowPostInfo,  // 是否显示邮寄信息
    //       isSplitOrder: isSplitOrder, //是否拆单
    //     });
    //   }
    // });

    var orderInfo = {
      "key": "1_123456",
      "totalPay": 210.1,
      "needPay": 210.1,
      "userId": 1,
      "merchantOrder": [
        {
          "productId": 1,
          "needDeliveryPay": 10,
          "merchantId": 1,
          "merchantName": "三好鲜生",
          "address": "山东省日照市大连路540号",
          "merchantPhone": "18310722959",
          "isDelivery": 2,
          "deliveryCost": 10,
          "expenditure": 100,
          "deliveryType":1,
          "totalPay": 210.1,
          "needPay": 210.1,
          "goodsList": [
            {
              "id": 1,
              "price": 10,
              "url": "https://meichaooss1.oss-cn-beijing.aliyuncs.com/mc/material/img/2019-03-10/1552209717227.jpg",
              "title": "【俄罗斯大牛威化饼干】纯正俄罗斯风味，再次击穿低价！",
              "buyNum": 10,
              "comments":"纯正俄罗斯风味，再次击穿低价",
            }
          ]
        }
      ],
      "oneselfOrder": [
        {
          "productId": 1,
          "needDeliveryPay": 10,
          "merchantId": 1,
          "merchantName": "三好鲜生",
          "merchantPhone":"18310722959",
          "address": "山东省日照市大连路540号",
          "isDelivery": 2,
          "deliveryCost": 10,
          "expenditure": 100,
          "deliveryType": 1,
          "totalPay": 210.1,
          "needPay": 210.1,
          "goodsList": [
            {
              "id": 1,
              "price": 10,
              "url": "https://meichaooss1.oss-cn-beijing.aliyuncs.com/mc/material/img/2019-03-10/1552209717227.jpg",
              "title": "【俄罗斯大牛威化饼干】纯正俄罗斯风味，再次击穿低价！",
              "buyNum": 10,
              "comments": "纯正俄罗斯风味，再次击穿低价",
            }
          ]
        }
      ],
      "discountCouponOrder": [
        {
          "productId": 1,
          "needDeliveryPay": 10,
          "merchantId": 1,
          "merchantName": "三好鲜生",
          "address": "山东省日照市大连路540号",
          "merchantPhone": "18310722959",
          "isDelivery": 2,
          "deliveryCost": 10,
          "expenditure": 100,
          "deliveryType": 1,
          "totalPay": 210.1,
          "needPay": 210.1,
          "goodsList": [
            {
              "id": 1,
              "price": 10,
              "url": "https://meichaooss1.oss-cn-beijing.aliyuncs.com/mc/material/img/2019-03-10/1552209717227.jpg",
              "title": "【俄罗斯大牛威化饼干】纯正俄罗斯风味，再次击穿低价！",
              "buyNum": 10,
              "comments": "纯正俄罗斯风味，再次击穿低价",
            }
          ]
        },
        {
          "productId": 1,
          "needDeliveryPay": 10,
          "merchantId": 1,
          "merchantName": "三好鲜生",
          "address": "山东省日照市大连路540号",
          "merchantPhone": "18310722959",
          "isDelivery": 2,
          "deliveryCost": 10,
          "expenditure": 100,
          "deliveryType": 1,
          "totalPay": 210.1,
          "needPay": 210.1,
          "goodsList": [
            {
              "id": 1,
              "price": 10,
              "url": "https://meichaooss1.oss-cn-beijing.aliyuncs.com/mc/material/img/2019-03-10/1552209717227.jpg",
              "title": "【俄罗斯大牛威化饼干】纯正俄罗斯风味，再次击穿低价！",
              "buyNum": 10,
              "comments": "纯正俄罗斯风味，再次击穿低价",
            }
          ]
        }
      ],
      "shopOrder": [
        {
          "productId": 1,
          "needDeliveryPay": 10,
          "merchantId": 1,
          "merchantName": "三好鲜生",
          "merchantPhone": "18310722959",
          "address": "",
          "isDelivery": 1,
          "deliveryCost": 10,
          "expenditure": 100,
          "deliveryType": 1,
          "totalPay": 210.1,
          "needPay": 210.1,
          "goodsList": [
            {
              "id": 1,
              "price": 10,
              "url":"https://meichaooss1.oss-cn-beijing.aliyuncs.com/mc/material/img/2019-03-10/1552209717227.jpg",
              "title": "【俄罗斯大牛威化饼干】纯正俄罗斯风味，再次击穿低价！",
              "buyNum": 10,
              "comments": "纯正俄罗斯风味，再次击穿低价",
              "specsStr":"选择颜色: 红色 尺码： M",
            }
          ]
        },
        {
          "productId": 2,
          "needDeliveryPay": 10,
          "merchantId": 1,
          "merchantName": "三好鲜生",
          "address": "",
          "isDelivery": 1,
          "deliveryCost": 10,
          "expenditure": 100,
          "deliveryType": 1,
          "totalPay": 210.1,
          "needPay": 210.1,
          "goodsList": [
            {
              "id": 1,
              "price": 10,
              "url": "https://meichaooss1.oss-cn-beijing.aliyuncs.com/mc/material/img/2019-03-10/1552209717227.jpg",
              "title": "【俄罗斯大牛威化饼干】纯正俄罗斯风味，再次击穿低价！",
              "buyNum": 10,
              "comments": "纯正俄罗斯风味，再次击穿低价",
              "specsStr": "选择颜色: 红色 尺码： M",
            }
          ]
        }
      ]
    }

    var merchantOrders = orderInfo.merchantOrder;
    var oneselfOrders = orderInfo.oneselfOrder;
    var couponOrders = orderInfo.discountCouponOrder;
    var b2cOrders = orderInfo.shopOrder;

    var totalPay = orderInfo.totalPay;
    var needPay = orderInfo.needPay;
    totalPay = (totalPay != null && !isNaN(totalPay)) ? totalPay : 0;
    needPay = (needPay != null && !isNaN(needPay)) ? needPay : 0;
    var preferential = totalPay - needPay;
    preferential = (preferential >= 0) ? preferential : 0;

    _this.setData({
      totalPay: totalPay,//共付
      needPay: needPay,// 应付
      preferential: preferential,//优惠
      merchantOrders: merchantOrders,// 团购订单
      oneselfOrders: oneselfOrders, // 自营订单
      couponOrders: couponOrders,
      b2cOrders: b2cOrders,//电商商品
    });

    _this.setData({
      isShowPostInfo: _this.isShowPostInfo(),  // 是否显示邮寄信息
      isSplitOrder: _this.isSplitOrders(), //是否拆单
    });

      
  },

  /**
   * 改变Order,并重新计算价格
   */
  changeOrderAndCalCost: function(_order, _gid, _num, _post) {
      
    if (_order && _gid ) {
      var _list = _order.goodsList;
      var _tList = [];
      if(_list) {
        _list.forEach(g =>{
          if(g.id == _gid) {
            var num = g.buyNum + _num;
            if ((_order.joinNum + num) > _order.limitNum) {
              wx.showToast({
                icon: "none",
                title: '已超过库存!',
              })
              return _order;
            }
            if (null != _order.buyLimitNum && num > _order.buyLimitNum) {
              wx.showToast({
                icon: "none",
                title: '此商品每人只能买' + _order.buyLimitNum + "份",
              })
              return _order;
            }
            if (num > 0) {
              g.buyNum += num;
              _tList.push(g);
            }
          }
        });
      }
      if (_tList.length == 0) {
        _order = null;
      }
    }
   
    if (_order && _post) {
      _order.productType = _post;
    }

    if(_order) {
      var _list = _order.goodsList;
      var totalPay = 0;
      var needPay = 0;
      _list.forEach(g => {
        totalPay += g.marketPrice * g.buyNum;
        needPay += g.price * g.buyNum;
      });

      if (_order.deliveryType == 2 && needPay < expenditure ) { //邮寄
        _order.deliveryCost = _order.needDeliveryPay;
        needPay += _order.deliveryCost;
      }
    }
    return _order;
  },

  /**
   * 是否显示邮寄地址
   */
  isShowPostInfo: function() {
    let _this = this;
    var oneselfOrders = _this.data.oneselfOrders;
    var b2cOrders = _this.data.b2cOrders;
    var isShowPostInfo = false;
    if (b2cOrders != null) {
      isShowPostInfo = true;
    } else {
      if (oneselfOrders != null) {
        oneselfOrders.forEach(o => {
          if (o.deliveryType == 2) {
            isShowPostInfo = true;
          }
        });
      }
    }
    return isShowPostInfo;
  },
  
  /**
   * 判断是否拆单
   */
  isSplitOrders: function() {
    ////判断是否拆单
    var isSplitOrder = false;
    var merchantOrders = _this.data.merchantOrders;
    var oneselfOrders = _this.data.oneselfOrders;
    var couponOrders = _this.data.couponOrders;
    var b2cOrders = _this.data.b2cOrders;
    ////判断是否拆单
    var isSplitOrder = false;
    if ((merchantOrders != null && oneselfOrders != null) ||
      (merchantOrders != null && b2cOrders != null) ||
      (oneselfOrders != null && b2cOrders != null) ||
      (merchantOrders != null && couponOrders != null) ||
      (b2cOrders != null && couponOrders != null) ||
      (couponOrders != null && oneselfOrders != null)) {
      isSplitOrder = true;
    }
   return isSplitOrder;
  },

  /**
   * 计算花费
   */
  calCosts:function(orders) {
    var totalPay = 0;
    var needPay = 0;
    if (orders) {
       orders.forEach(o => {
         totalPay += o.totalPay;
         needPay += o.needPay;
       });
    }
    return {
      totalPay: totalPay,
      needPay: needPay,
    };

  },

  /**
   * 刷新订单信息
   */
  refresh: function() {
     let _this = this;

    var merchantOrders = _this.data.merchantOrders;
    var oneselfOrders = _this.data.oneselfOrders;
    var couponOrders = _this.data.couponOrders;
    var b2cOrders = _this.data.b2cOrders;
   
    /**计算花费 */
    var totalPay = 0;
    var needPay = 0;

    var merchantOrdersCost = _this.calCosts(merchantOrders);
    totalPay += merchantOrdersCost.totalPay;
    needPay += merchantOrdersCost.needPay;

    var oneselfOrdersCost = _this.calCosts(oneselfOrders);
    totalPay += oneselfOrdersCost.totalPay;
    needPay += oneselfOrdersCost.needPay;

    var couponOrdersCost = _this.calCosts(couponOrders);
    totalPay += couponOrdersCost.totalPay;
    needPay += couponOrdersCost.needPay;

    var b2cOrdersCost = _this.calCosts(b2cOrders);
    totalPay += b2cOrdersCost.totalPay;
    needPay += b2cOrdersCost.needPay;

    totalPay = (totalPay != null && !isNaN(totalPay)) ? totalPay : 0;
    needPay = (needPay != null && !isNaN(needPay)) ? needPay : 0;
    var preferential = totalPay - needPay;
    preferential = (preferential >= 0) ? preferential : 0;

    _this.setData({
      totalPay: totalPay,//共付
      needPay: needPay,// 应付
      preferential: preferential,//优惠
      isShowPostInfo: _this.isShowPostInfo(),  // 是否显示邮寄信息
      isSplitOrder: _this.isSplitOrders(), //是否拆单
    });
  },

  /**
   * 监听
   */
  lisentWords: function (e) {
    let _this = this;
    let pid = e.currentTarget.dataset.pid;
    let val = e.detail.value;
    var b2cOrders = _this.data.b2cOrders;
    if (b2cOrders) {
      b2cOrders.forEach(order => {
        if (order.productId == pid) {
          order.remark = val;
        }
      });
    }
    _this.setData({
      b2cOrders: b2cOrders
    });
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
   
  
   
  
})
