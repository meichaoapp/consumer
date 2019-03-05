var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    basePath: app.globalData._base_path, //基础路径
    userInfo: {},
    couponList : [] , //用户优惠券列表
    start: 1, // 页码
    totalPage: 0, // 共有页
    limit: 6,//每页条数
    hideHeader: true, //隐藏顶部提示
    hideBottom: true, //隐藏底部提示
    srollViewHeight: 0, //滚动分页区域高度
    refreshTime: '', // 刷新的时间
    loadMoreData: '上滑加载更多',
  },
  onLoad: function (options) {
      let that = this;
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
      });

      that.getCouponList();
  },
  onReady: function () {

  },
  onShow: function () {
   
  },

  toDetail:function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/ucenter/coupon/couponOrderDetail?id=' + id,
    })
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
    //console.log('上拉加载更多');
    let _this = this;
    // 当前页是最后一页
    if (_this.data.start == _this.data.totalPage) {
      _this.setData({ loadMoreData: '我是有底线的' })
      return;
    }
    setTimeout(function () {
      //console.log('上拉加载更多');
      _this.setData({
        start: _this.data.start + 1,
        hideBottom: false
      })
      _this.getCouponList();
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
      _this.getCouponList();
      wx.stopPullDownRefresh();
    }, 300);
  },

  //获取优惠券列表
  getCouponList() {
    let _this = this;
    util.request(api.QueryMyCouponList,{
      userId: _this.data.userInfo.id,
      start: _this.data.start, // 页码
      limit: _this.data.limit,//每页条数
    }, 'POST').then(function (res) {
      var list = res.data.list;
      if (list != null) {
        for(var i = 0; i < list.length; i++) {
          if (list[i].title.length > 28) {
            list[i].title = list[i].title.substring(0,28) + "...";
          }
        }
      }
      if (_this.data.start == 1) { // 下拉刷新
        _this.setData({
          couponList: list,
          hideHeader: true,
          totalPage: res.data.totalPage,
        })
      } else { // 加载更多
        var tempArray = _this.data.couponList;
        tempArray = tempArray.concat(list);
        _this.setData({
          totalPage: res.data.totalPage,
          couponList: tempArray,
        })
      }
     
    });
  },

  //跳转首页(知道了)
  toIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

})