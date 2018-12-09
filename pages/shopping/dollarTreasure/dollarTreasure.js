var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');



var app = getApp();

Page({
    data: {
        id:0,
        list: [], // 团购列表
        winTreasure:{},
        start: 1, // 页码
        totalPage: 0, // 共有页
        limit: 3,//每页条数
        hideHeader: true, //隐藏顶部提示
        hideBottom: true, //隐藏底部提示
        srollViewHeight: 0, //滚动分页区域高度
        refreshTime: '', // 刷新的时间
        loadMoreData: '加载更多',
        shareImage: "/static/images/logo.png",
    },
    // onShareAppMessage: function () {
    //   var that = this;
    //   return {
    //     title: '一元夺宝',
    //     imageUrl: that.data.shareImage,
    //     path: '/pages/shopping/dollarTreasureDetail/dollarTreasureDetail?tag=0&id='+that.data.id+'&orderId=0',
    //   }
    // },
    onLoad: function (options) {
        this.$wuxLoading = app.Wux().$wuxLoading //加载
        this.queryList();
        this.countDown();
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
        console.log('上拉加载更多');
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
            console.log('上拉加载更多');
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
            console.log('下拉刷新');
            _this.setData({
                start: 1,
                refreshTime: new Date().toLocaleTimeString(),
                hideHeader: false
            })
            _this.queryList();
            wx.stopPullDownRefresh();
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
        util.request(api.QueryTreasureList, data, "POST").then(function (res) {
            _this.$wuxLoading.hide(); //隐藏加载动画
            if (res.rs === 1) {
              //console.log("QueryTreasureList-0---" + JSON.stringify(res.data));
                var list = res.data.list;
                if (_this.data.start == 1) { // 下拉刷新
                    _this.setData({
                        winTreasure: res.data.winTreasure,
                        list: list,
                        hideHeader: true,
                        totalPage: res.data.totalPage,
                    })
                } else { // 加载更多
                    //console.log('加载更多');
                    var tempArray = _this.data.list;
                    tempArray = tempArray.concat(list);
                    _this.setData({
                        winTreasure: res.data.winTreasure,
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
    //小于10的格式化函数
    timeFormat(param) {
        return param < 10 ? '0' + param : param;
    },
    countDown() {//倒计时函数
        // 获取当前时间，同时得到活动结束时间数组
        let newTime = new Date().getTime();
        let list = this.data.list;
        let countDownArr = [];

        if (list != null && list.length > 0) {
            // 对结束时间进行处理渲染到页面
            list.forEach(o => {
                if (o.status != 2) {

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
                            o.status = 0; // 设置状态为进行中
                        } else {//活动已结束，全部设置为'00'
                            o.status = 1;
                            o.day = this.timeFormat(0);
                            o.hour = this.timeFormat(0);
                            o.min = this.timeFormat(0);
                            o.sec = this.timeFormat(0);
                        }
                    } else {
                        o.status = 1;
                    }
                }
                // console.log("o.status---" + o.status);

            })

            this.setData({ list: list })
        }
        // 渲染，然后每隔一秒执行一次倒计时函数
        setTimeout(this.countDown, 1000);
    }





})
