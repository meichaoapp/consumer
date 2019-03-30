var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      merchantId: 10,//options.mid,
    });
    _this.queryList();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    wx.navigateTo({
      url: '/xxx/xx?mid=' + _this.data.merchant.merchantId,
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

})