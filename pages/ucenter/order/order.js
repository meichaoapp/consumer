var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
//获取应用实例
const app = getApp()
Page({
  data:{
    orderList: [],
    start: 1, // 页码
    totalPage: 0, // 共有页
    limit: 3,//每页条数
    hideHeader: true, //隐藏顶部提示
    hideBottom: true, //隐藏底部提示
    srollViewHeight: 0, //滚动分页区域高度
    refreshTime: '', // 刷新的时间 
    loadMoreData: '加载更多……',
  },
  onLoad:function(options){
    this.$wuxLoading = app.Wux().$wuxLoading //加载
    this.getOrderList();
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
      _this.getOrderList();
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
      _this.getOrderList();
    }, 300);
  },

  getOrderList(){
    let _this = this;
    // util.request(api.QueryTGList).then(function (res) {
    //   if (res.rs === 1) {
    //     var list = res.data.list;
    //     if (_this.data.start == 1) { // 下拉刷新
    //       _this.setData({
    //         orderList: list,
    //         hideHeader: true,
    //         totalPage: res.data.totalPage,
    //       })
    //     } else { // 加载更多
    //       //console.log('加载更多');
    //       var tempArray = _this.data.list;
    //       tempArray = tempArray.concat(list);
    //       _this.setData({
    //         totalPage: res.data.totalPage,
    //         orderList: tempArray,
    //         hideBottom: true
    //       })
    //     }

    //   }
    // });
    var list = [
      {
        "id": 1,  //id	
        "merchantId": 1,  //商户ID	
        "name": "快乐的蛋 出厂价团 只为宣传",	   //团购名称
        "url": "https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/3299989615/TB1baFLaOrpK1RjSZFhXXXSdXXa_!!0-item_pic.jpg_250x250.jpg",	   //展示url
        "price": "15元", //团购价
        "status": 0, //0 未开始 1 进行中 2 已成团 3 已过期
        "statusStr":"即将到货",
        "comments": "精品羊排新鲜出厂", //简述
        "limitNum": 99, //参团人数上限
        "joinNum": 90, //参团人数
        "startTime": "2018/09/16 00:00:00", //开始时间，注意格式
        "endTime": "2018/09/16 00:00:00", //结束时间，注意格式
      },
      {
        "id": 2,  //id	
        "merchantId": 1,  //商户ID	
        "name": "快乐的蛋 出厂价团 只为宣传",	   //团购名称
        "url": "https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/3299989615/TB1baFLaOrpK1RjSZFhXXXSdXXa_!!0-item_pic.jpg_250x250.jpg",	   //展示url
        "price": "15元", //团购价
        "status": 0, //0 未开始 1 进行中 2 已成团 3 已过期
        "statusStr": "已完成",
        "comments": "精品羊排新鲜出厂", //简述
        "limitNum": 99, //参团人数上限
        "joinNum": 90, //参团人数
        "startTime": "2018/09/16 00:00:00", //开始时间，注意格式
        "endTime": "2018/09/18 23:00:00", //结束时间，注意格式
      },
    ];

    this.setData({
      orderList: list,
    });
  },

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})