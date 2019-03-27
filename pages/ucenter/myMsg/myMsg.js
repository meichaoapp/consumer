var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var timeUtil = require('../../../utils/timeUtils.js');
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.globalData._base_path, //基础路径
    userInfo: {},
    list: [],
    start: 1, // 页码
    totalPage: 0, // 共有页
    limit: 6,//每页条数
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
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
    });
    this.getList();
    _this.refreshTimer(); //刷新timer
    //开启刷新
    if (this.interval) clearInterval(this.interval);;
    this.interval = setInterval(function () {
      _this.refreshTimer();
    }, 10000);//10秒刷新
    this.interval = setInterval(function () {
      _this.refresh();
    }, 10000*6*3);//3分钟刷新
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
      _this.setData({ loadMoreData: '我是有底线的' })
      return;
    }
    setTimeout(function () {
      //console.log('上拉加载更多');
      _this.setData({
        start: _this.data.start + 1,
        hideBottom: false
      })
      _this.getList();
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
      _this.getList();
      wx.stopPullDownRefresh();
    }, 300);
  },

  /**
 * 刷新时间
 */
  refreshTimer: function () {
    var _this = this;
    if (_this.data.list) {
      for (var i = 0; i < _this.data.list.length; i++) {
        _this.data.list[i].timer = timeUtil.getDateDiff(new Date(_this.data.list[i].createTime).getTime());
      }
      _this.setData({
        list: _this.data.list,
      });
    }
  },

  getList() {
    let _this = this;
    util.request(api.QueryMessageList, {
      userId: _this.data.userInfo.id,
      start: _this.data.start, // 页码
      limit: _this.data.limit,//每页条数
    }, "POST").then(function (res) {
      if (res.rs === 1) {
        if(res.data) {
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
              //hideBottom: true
            })
          }
          _this.refreshTimer();
        }
      }
    });

  },
 
})