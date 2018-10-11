var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const statusArr = ["即将开始", "距结束", "已成团", "已过期"];//0 未开始 1 进行中 2 已成团 3 已过期
Page({
  data: {
    id: 0,
    tabIndex:0,
    detail:{}, //团购详情
    merchant:{},//商家
    goodsList:[],
    friensList:[],
    joinNum:0,
    number: 1,
    totalPay: 0.00,//共付
    needPay: 0.00,// 应付
    checkedSpecText: '请选择规格数量',
    openAttr: false,
    noCollectImage: "/static/images/icon_collect.png",
    hasCollectImage: "/static/images/icon_collect_checked.png",
    collectBackImage: "/static/images/icon_collect.png"
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.$wuxLoading = app.Wux().$wuxLoading //加载
    this.$wuxToast = app.Wux().$wuxToast
    this.setData({
      id: parseInt(options.id)
    });
    var that = this;
    this.queryGroupPurchaseDetail();
   
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: that.data.detail.title,
      imageUrl: that.data.detail.pics[0],
      path: "/pages/index/index"
    }
  },
  //参团
  joinGroup: function(){
    //1.创建订单
    let _this = this;
    var order = _this.getOrderDatas();
    if(null == order){
      return;
    }
    util.request(api.CreateOrder, order ,"POST").then(function (res) {
      if (res.rs === 1) { //创建成功
        var data = res.data;
        //2.调用微信支付
        util.request(api.Pay, _this.getPayDatas() , "POST").then(function (res1) {
          if (res1.rs === 1) { //支付成功
            var data1 = res1.data;
            //3.确认参团
            util.request(api.FirmOrder, _this.getFirmOrderDatas(data.id), "POST").then(function (res2) {
              if (res2.rs === 1) { //参团成功
                var data2 = res2.data;
                
                //跳转成功页
                wx.redirectTo({
                  url: '/pages/details/success',
                })

              }else{
                _this.$wuxToast.show({ type: 'text', text: "参团失败请重试!", });
                return false;
              }
            });

          }else{
            _this.$wuxToast.show({ type: 'text', text: "参团失败请重试!", });
            return false;
          }
        });
      }else{
        _this.$wuxToast.show({ type: 'text', text: "参团失败请重试!", });
        return false;
      }
    });
  },

  getFirmOrderDatas : function(orderId){
    return {
      "token": "773b8bde7ed698bc2cc2227d5c765704", //token
      "id": orderId,  //订单id
      "userId": 1,  //用户ID
      "payStatus": 0,  //支付状态 0 成功 1 失败
      "openid": "P90FDeUdnFMZkwZ274fEWnWqE",        // openid
    };
  },

  //支付数据
  getPayDatas: function (){
    var data = {
      "userId": 1,	      //微信昵称
      "openid": "P90FDeUdnFMZkwZ274fEWnWqE",        // openid
      "type": 0,        // 支付方式 0 微信 1 银行卡 2 支付宝
      "pay": this.data.needPay,        // 支付金额
    };

    return data;

  },
  //获取订单数据
  getOrderDatas :function(){
    let _this = this;
    var order = {
      id: _this.data.id,  //团购id
      userId: 1,  //用户ID
      openid: "P90FDeUdnFMZkwZ274fEWnWqE",        // openid
      totalPay: _this.data.totalPay,//共付
      needPay: _this.data.needPay,// 应付

    };

    var goodsListArr = [];
    var goodsList = _this.data.goodsList;
    var hasBuy = false;
    if (goodsList != null && goodsList.length > 0) {
      goodsList.forEach(o => {
        if (o.number > 0){
          hasBuy =  true;
        }
        var g = {
          "id": o.id, // 商品id
          "buyNum": o.number,//购买数量
        }
        goodsListArr.push(g);
      });
    }

    if(!hasBuy){
      _this.$wuxToast.show({ type: 'text', text: "请选择想要参团的商品，谢谢！", });
      return null;
    }
    order.goodsList = goodsListArr;
    return order;
  },

 
  //切换Tab
  clickTab:function(e){
    let _this = this;
    var id = e.target.dataset.id;
    _this.setData({
      tabIndex: id,
    });

    if(id == 1){
      _this.friends();
    }
  },

  //参团好友
  friends: function(){
    let that = this;
    util.request(api.Friends, { id: that.data.id }).then(function (res) {
      if (res.rs === 1) {
        var data = res.data;
        that.setData({
          friensList: data.list, 
          joinNum: data.joinNum, 
          "detail.joinNum": data.joinNum, 
        });
      }
    });
  },

  ////获取货品信息
  queryGroupPurchaseDetail: function () {
    let that = this;
    util.request(api.QueryGroupPurchaseDetail, { id: that.data.id }).then(function (res) {
      if (res.rs === 1) {
        var data = res.data;
        var goodsList = data.goodsList;
        if (goodsList != null && goodsList.length > 0){
          goodsList.forEach(o => {
             o.number = 0;
          });
        }
        that.setData({
          detail: data.detail, //团购详情
          merchant: data.merchant,//商家
          goodsList: goodsList,
        });
        that.countDown();
      }
    });

  },
   cutNumber: function (e) {
     let _this = this;
     var id = e.currentTarget.dataset.id;
     var goodsList =  _this.data.goodsList;
     var totalPay =  0.00;//共付
     var needPay = 0.00;// 应付
     if (goodsList != null && goodsList.length > 0) {
       goodsList.forEach(o => {
         if(o.id == id){
           o.number = o.number - 1;
           if(o.number < 0){
             o.number = 0;
           }
         }
         totalPay += o.number * o.marketPrice;
         needPay += o.number * o.price;
       });
     }
     _this.setData({
       goodsList: goodsList,
       totalPay: totalPay.toFixed(2),//共付
       needPay: needPay.toFixed(2),// 应付
     });
  },
  addNumber: function (e) {
    let _this = this;
    var id = e.currentTarget.dataset.id;
    var goodsList = _this.data.goodsList;
    var totalPay = 0.00;//共付
    var needPay = 0.00;// 应付
    if (goodsList != null && goodsList.length > 0) {
      goodsList.forEach(o => {
        if (o.id == id) {
          o.number = o.number + 1;
        }
        totalPay += o.number * o.marketPrice;
        needPay += o.number * o.price;
      });
    }
    _this.setData({
      goodsList: goodsList,
      totalPay: totalPay.toFixed(2),//共付
      needPay: needPay.toFixed(2),// 应付
    });
  },
  //小于10的格式化函数
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let countDownArr = [];

    let o = this.data.detail;
    if (o != null & o  != undefined) {
      
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
      } else {
        o.status = 0;
      }
      // console.log("o.status---" + o.status);
      o.statusStr = statusArr[o.status];
     
      this.setData({ detail: o })
    }
    // 渲染，然后每隔一秒执行一次倒计时函数
    setTimeout(this.countDown, 1000);
  }
})