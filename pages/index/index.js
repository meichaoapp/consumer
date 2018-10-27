const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const maps = require('../../utils/maps.js');
const wecache = require('../../utils/wecache.js');

const pointKey = "userLocation";

//获取应用实例
const app = getApp()
const statusArr = ["即将开始", "距结束", "已成团", "已成团"];//0 未开始 1 进行中 2 已成团 3 已结束
Page({
  data: {
    latitude:0.00,
    longitude:0.00,
    cityname:"",
    pointName:"",
    merchants:[], // 附近商家
    banners: [],
    list:[], // 团购列表
    start: 1, // 页码
    totalPage: 0, // 共有页
    limit: 3,//每页条数
    hideHeader: true, //隐藏顶部提示
    hideBottom: true, //隐藏底部提示
    srollViewHeight: 0, //滚动分页区域高度
    refreshTime: '', // 刷新的时间 
    loadMoreData: '加载更多……',
  },
  onShareAppMessage: function () {
    return {
      title: '美超团购分享',
      desc: '美超团购',
      path: '/pages/index/index'
    }
  },

  onLoad: function (options) {
    this.$wuxLoading = app.Wux().$wuxLoading //加载
    this.getCurrentLocation();
    this.queryBanner();
    this.countDown();
  },

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

  //选择位置
  selectLocation: function () {
    let _this = this;
    maps.getLocation().then(res => {
      _this.setData({
        pointName: res.name,//具体的出发地点
        longitude: res.longitude,
        latitude: res.latitude,
      })
      //设置缓存信息
      var userLocation = {
        pointName: res.name,
        longitude: res.longitude,
        latitude: res.latitude,
      };
      wecache.put(pointKey, userLocation, -1);
    });
    _this.refresh(); // 加载行程信息
  },


  /**
   * 获取当前地理位置信息
   */
  getCurrentLocation: function () {
    var that = this;
    var userLocation = wecache.get(pointKey, null);
    if(userLocation == null){
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          var latitude = res.latitude//维度
          var longitude = res.longitude//经度
          ///设置当前地理位置
          that.setData({
            latitude: latitude,
            longitude: longitude,
          });
          maps.getRegeo(latitude, longitude).then(res => {
            that.setData({
              pointName: res.poisData[0].address,
            });

          });
        }
      })
    }else{
      that.setData({
        pointName: userLocation.pointName,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
      })
    }
   
    that.refresh(); // 加载行程信息
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
      console.log('上拉加载更多');
      _this.setData({
        start: _this.data.start + 1,
        hideBottom: false
      })
      _this.queryTGList();
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
      _this.queryTGList();
      wx.stopPullDownRefresh();
    }, 300);
  },


  /**
   * 查询附近商户信息
   */
  queryAround:function(){
    let _this = this;
    var data = {
      latitude: _this.data.latitude,
      longitude: _this.data.longitude,
    }
    util.request(api.QueryMerchants,data).then(function (res) {
      if (res.rs === 1) {
        _this.setData({
           merchants: res.data.merchants,
        });
      }
    });

  },

  /**
  * 查询首页录播图
  */
  queryBanner: function () {
    let that = this;
    util.request(api.QueryBanner,{token:""},"POST").then(function (res) {
      if (res.rs === 1) {
        that.setData({
          banners: res.data.banners
        });
      }
    });
    
  },

  queryTGList: function () {
    let _this = this;
    _this.$wuxLoading.show({ text: '数据加载中', })
    var data = {
      start: _this.data.start,
      limit: _this.data.limit,
      latitude: _this.data.latitude,
      longitude: _this.data.longitude,
    }
    util.request(api.QueryTGList,data,"POST").then(function (res) {
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
            //hideBottom: true
          })
        }
        
      }
    }).catch((err) => {
      _this.$wuxLoading.hide(); //隐藏加载动画
      console.log(err)
    });
  
  },

  //导航跳转
  navTo: function (e) {
    //跳转TabBar路径
    if (e.currentTarget.dataset.way == 1) {
      wx.switchTab({
        url: e.currentTarget.dataset.url
      });
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
        success: function (res) {
        },
        fail: function (e) {
          console.log("error--", e);
        }
      })
    }
  },
  //小于10的格式化函数
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let list = this.data.list;
    let countDownArr = [];

    if(list != null &&list.length > 0){
      // 对结束时间进行处理渲染到页面
      list.forEach(o => {
        if(o.status != 2){

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
        o.statusStr = statusArr[o.status];
      })
     
      this.setData({ list: list })
    }
    // 渲染，然后每隔一秒执行一次倒计时函数
    setTimeout(this.countDown, 1000);
  }

 
})
