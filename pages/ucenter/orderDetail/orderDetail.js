var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderId:0,
    status: 0, // 订单状态 0 待支付 1 已支付 2 待领取 3 已完成 4 放弃 5 退货
    totalPay: 0.00,//共付
    needPay: 0.00,// 应付
    orderQRcode: "",// 订单二维码（包含订单id）
    code: "", //订单识别码
    orderNums: "", //订单数量
    groupPurchase:{},
    merchant:{},
    goodsList: [],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  getOrderDetail() {
    let that = this;
    util.request(api.QueryOrderDetail, {
      orderId: that.data.orderId
    },"POST").then(function (res) {
      if (res.rs == 1) {
     //   console.log(res.data);
        that.setData({
          orderId: res.data.id, //订单ID
          status: res.data.status, // 订单状态 0 待支付 1 已支付 2 待领取 3 已完成 4 放弃 5 退货
          totalPay: res.data.totalPay,//共付
          needPay: res.data.needPay,// 应付
          orderQRcode: res.data.orderQRcode,// 订单二维码（包含订单id）
          code: res.data.code, //订单识别码
          //orderNums: res.data.orderNums,
          merchant: res.data.merchant,
          groupPurchase: res.data.groupPurchase,
          goodsList: res.data.goodsList
        });
        //that.payTimer();
      }
    });
  },
  // payTimer() {
  //   let that = this;
  //   let orderInfo = that.data.orderInfo;

  //   setInterval(() => {
  //     console.log(orderInfo);
  //     orderInfo.add_time -= 1;
  //     that.setData({
  //       orderInfo: orderInfo,
  //     });
  //   }, 1000);
  // },
  // payOrder() {
  //   let that = this;
  //   util.request(api.PayPrepayId, {
  //     orderId: that.data.orderId
  //   }).then(function (res) {
  //     if (res.errno === 0) {
  //       const payParam = res.data;
  //       wx.requestPayment({
  //         'timeStamp': payParam.timeStamp,
  //         'nonceStr': payParam.nonceStr,
  //         'package': payParam.package,
  //         'signType': payParam.signType,
  //         'paySign': payParam.paySign,
  //         'success': function (res) {
  //           console.log(res)
  //         },
  //         'fail': function (res) {
  //           console.log(res)
  //         }
  //       });
  //     }
  //   });

  // },
  // //取消订单
  // cancelOrder :function(){
  //   let that = this;
  //   wx.showModal({
  //     title: '',
  //     content: '您确定要取消该订单吗？',
  //     success: function (res) {
  //       if (res.confirm) {
  //         util.request(api.OrderCancel, {
  //           orderId: that.data.orderId
  //         }, 'POST').then(function (res) {
  //           if (res.errno === 0) {
  //             that.getOrderDetail();
  //             wx.showToast({
  //               title: "取消订单成功！"
  //             })
  //           } else {
  //             util.showErrorToast(res.errmsg);
  //           }
  //         });
  //       }
  //     }
  //   })
  // },



  
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})