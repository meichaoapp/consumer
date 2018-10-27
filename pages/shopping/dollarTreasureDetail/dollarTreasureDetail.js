var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();

Page({
  data: {
    sourceTag: 0, //0 表示首页跳转  1 我的
    userInfo: {},
    id: 0,
    orderId:0,
    detail: {},
    list: [], // 参加列表
    winTreasure: {},
    start: 1, // 页码
    totalPage: 0, // 共有页
    limit: 10,//每页条数
    hideHeader: true, //隐藏顶部提示
    hideBottom: true, //隐藏底部提示
    srollViewHeight: 0, //滚动分页区域高度
    refreshTime: '', // 刷新的时间 
    loadMoreData: '加载更多……',
    CalculationFlag:false,//计算方法弹框
    prizecodes:[10021,10022,10023],//模拟中奖codes
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.$wuxLoading = app.Wux().$wuxLoading //加载
    this.$wuxToast = app.Wux().$wuxToast
    this.setData({
      id: parseInt(options.id),
      sourceTag: parseInt(options.tag),
      orderId: parseInt(options.orderId),
    });
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    if (null == userInfo || userInfo == "" || undefined == userInfo) {
      wx.navigateTo({
        url: '/pages/auth/login/login'
      });
    }else{
      this.setData({
        userInfo: userInfo,
      });

      this.queryDetail();
    }
    this.queryList();
  },
  onReady: function () {

  },
  onShow: function () {

  },
  
  //参与
  join: function () {
    //1.创建订单
    let _this = this;
    if (_this.data.detail.status != 1) {
      return;
    }
    util.request(api.JoinTreasure, {
        id: _this.data.id,  //夺宝id
        userId: _this.data.userInfo.id,  //用户ID
        needPay: _this.data.detail.price, 
        buyNum: 1,
        detailId: _this.data.detail.detailId,
        openid: _this.data.userInfo.openid,
    }, "POST").then(function (res) {
      if (res.rs === 1) { //创建成功
        var data = res.data;

        console.log(res.data.wxPayResponse);

        // wx.redirectTo({
        //   url: '/pages/shopping/dollarTreasureDetail/success?id=' + data.id + "&code=1233443" ,
        // })


       var wxPayResponse = res.data.wxPayResponse;
        wx.requestPayment(
          {
            'timeStamp': wxPayResponse.timeStamp,
            'nonceStr': wxPayResponse.nonceStr,
            'package': "prepay_id=" + wxPayResponse.prepayId,
            'signType': 'MD5',
            'paySign': wxPayResponse.sign,
            'success': function (res) {
              //跳转成功页
              wx.redirectTo({
                url: '/pages/shopping/dollarTreasureDetail/success?id=' + data.id,
              })
            },
            'fail': function (res) {
              _this.$wuxToast.show({ type: 'text', text: "参与失败请重试!", });
              return false;
            },
            'complete': function (res) {
            }
          })

      } else {
        _this.$wuxToast.show({ type: 'text', text: res.info, });
        return false;
      }
    }).catch((err) => {
      _this.$wuxToast.show({ type: 'forbidden', text: err.info, });
      console.log(err)
    });
  },
  //查询详情
  queryDetail:function(){
    let that = this;
    util.request(api.QueryTreasureDetails, 
      { 
        id: that.data.id, 
        userId:that.data.userInfo.id,
        sourceTag : that.data.sourceTag,
        orderId: that.data.orderId,
      }, "POST").then(function (res) {
      if (res.rs === 1) {
        var data = res.data;
        console.log("detail.status : " + data.detail.status );
        that.setData({
          detail: data.detail, //详情
          joinHistories: data.joinHistories,//参与历史
        });
        that.countDown();
      }
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
    if (o != null & o != undefined) {
      if (o.status != 2) {
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
            o.status = 3;
            o.day = this.timeFormat(0);
            o.hour = this.timeFormat(0);
            o.min = this.timeFormat(0);
            o.sec = this.timeFormat(0);
          }
        } else {
          o.status = 0;
        }
      }

      // console.log("o.status---" + o.status);

      this.setData({ detail: o })
    }
    // 渲染，然后每隔一秒执行一次倒计时函数
    setTimeout(this.countDown, 1000);
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

  // 上拉加载更多
  loadMore: function () {
    let _this = this;
    // 当前页是最后一页
    if (_this.data.start == _this.data.totalPage) {
      _this.setData({ loadMoreData: '已加载全部内容' })
      return;
    }
    setTimeout(function () {
      //console.log('上拉加载更多');
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
      //console.log('下拉刷新');
      _this.setData({
        start: 1,
        refreshTime: new Date().toLocaleTimeString(),
        hideHeader: false
      })
      _this.queryList();
    }, 300);
  },
  //获取一元夺宝列表
  queryList: function () {
    let _this = this;
    _this.$wuxLoading.show({ text: '数据加载中', })
    var data = {
      id: _this.data.id,
      start: _this.data.start,
      limit: _this.data.limit,
    }
    util.request(api.JoinHistories, data, "POST").then(function (res) {
      _this.$wuxLoading.hide(); //隐藏加载动画
      if (res.rs === 1) {
        var list = res.data.list;

        console.log(list);


        if (_this.data.start == 1) { // 下拉刷新
          _this.setData({
            list: list,
            hideHeader: true,
            totalPage: res.data.totalPage,
          })

        } else { // 加载更多
          //console.log('加载更多');
          var tempArray = _this.data.list;
          tempArray = tempArray.concat(list);
          _this.setData({
            totalPage: res.data.totalPage,
            list: tempArray,
            hideBottom: true
          })
        }

      }
    }).catch((err) => {
      _this.$wuxLoading.hide(); //隐藏加载动画
      console.log(err)
    });

  },
//计算方法
  Calculation:function(){
    let _this = this;
    var CalculationFlag = _this.data.CalculationFlag;
    var nCalculationFlag = !CalculationFlag;
    _this.setData({
      CalculationFlag: nCalculationFlag
    })
  },



})