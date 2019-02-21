// pages/orderConfirm/orderConfirm.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const cart = require('../../services/cart.js');
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
    count: 0, //提交计数
    orderGoods:[]
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
      }else{
        _this.reloadMerchat(merchant); //重新加载选中的商户信息
      }
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
  //减
  cutNumber: function (e) {
    let _this = this;
    var id = e.currentTarget.dataset.id;
    var goodsList = _this.data.orderGoods;
    if (goodsList != null && goodsList.length > 0) {
      goodsList.forEach(o => {
        if (o.id == id) {
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
        if (o.id == id) {
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
  //查询商户列表信息
  reloadMerchat: function (merchant) {
    let that = this;
    var data = {
      "merchantId": merchant.merchantId,//商户ID
    };
    util.request(api.QueryMerchants, data, "POST").then(function (res) {
      console.log('------商户信息', res);
      if (res.rs === 1) {
        var merchantList = res.data;
        if (null != merchantList && merchantList.length > 0) {
          that.setData({
            merchant: merchantList[0],
          })
        }else {
          that.setData({
            merchant: merchant,
          })
        }
        that.loadOrderInfo();
      }
    });
  },
  //切换取货方式
  switchDeliveryType: function(e) {
    let _this = this;
    let type = e.currentTarget.dataset.type;
    _this.setData({
      deliveryType: type,
    });
    _this.loadOrderInfo();
  },
  /**
   * 加载订单信息
   */
  loadOrderInfo:function(){
    let _this = this;
    var _data = cart.createOrder(0, _this.data.merchant.merchantId, _this.data.userInfo, _this.data.deliveryType, _this.data.merchant, _this.data.orderGoods );
    //console.log("loadOrderInfo----" + JSON.stringify(_data));
    _this.setData({
      totalPay: _data.totalPay.toFixed(2),//共付
      needPay: _data.needPay.toFixed(2),// 应付
      preferential: (_data.totalPay - _data.needPay).toFixed(2),
      merchantOrder: _data.merchantOrder,// 团购订单
      oneselfOrder: _data.oneselfOrder, // 自营订单
    });
  },

  getOrderDatas: function(){
    let _this = this;
    var _data = cart.createOrder(1, _this.data.merchant.merchantId, _this.data.userInfo, _this.data.deliveryType, _this.data.merchant, _this.data.orderGoods);
    return {
      merchantId: _this.data.merchant.merchantId,
      totalPay: _data.totalPay.toFixed(2),//共付
      needPay: _data.needPay.toFixed(2),
      merchantOrder: _data.merchantOrder,// 团购订单
      oneselfOrder: _data.oneselfOrder, // 自营订单
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
    util.request(api.CreateOrder, order, "POST").then(function (res) {

      if (res.rs === 1) { //创建成功
        var data = res.data;

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
