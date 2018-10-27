var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');



var app = getApp();

Page({
  data: {
    list: [], // 中奖列表
    winTreasure:{},
    start: 1, // 页码
    totalPage: 0, // 共有页
    limit: 6,//每页条数
    hideHeader: true, //隐藏顶部提示
    hideBottom: true, //隐藏底部提示
    srollViewHeight: 0, //滚动分页区域高度
    refreshTime: '', // 刷新的时间 
    loadMoreData: '加载更多……',
  },
  onLoad: function (options) {
    this.$wuxLoading = app.Wux().$wuxLoading //加载
    this.queryList();
  },
  onReady: function () {

  },
  onShow: function () {
    
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
      wx.stopPullDownRefresh();
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
      start: _this.data.start,
      limit: _this.data.limit,
    }
    util.request(api.QueryWinList, data, "POST").then(function (res) {
      _this.$wuxLoading.hide(); //隐藏加载动画
      if (res.rs === 1) {
        var list = res.data.list;
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
 

  
  

})