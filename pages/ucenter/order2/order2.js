var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
//获取应用实例
const app = getApp()
Page({
    data:{
        userInfo: {},
        orderList: [],
        start: 1, // 页码
        totalPage: 0, // 共有页
        limit: 6,//每页条数
        hideHeader: true, //隐藏顶部提示
        hideBottom: true, //隐藏底部提示
        srollViewHeight: 0, //滚动分页区域高度
        refreshTime: '', // 刷新的时间
        loadMoreData: '加载更多',
    },
    onLoad:function(options){
        this.$wuxLoading = app.Wux().$wuxLoading //加载
        let userInfo = wx.getStorageSync('userInfo');
        let token = wx.getStorageSync('token');

        if (null == userInfo || userInfo == "" || undefined == userInfo) {
            wx.navigateTo({
                url: '/pages/auth/login/login'
            });
        }
        this.setData({
            userInfo: userInfo,
        });
        this.getOrderList();
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
            wx.stopPullDownRefresh();
        }, 300);
    },

    getOrderList(){
        let _this = this;
        util.request(api.QueryOrderList,{
            userId:_this.data.userInfo.id,
            start: _this.data.start, // 页码
            limit: _this.data.limit ,//每页条数
        },"POST").then(function (res) {
            if (res.rs === 1) {
                var list = res.data.list;
                if (_this.data.start == 1) { // 下拉刷新
                    _this.setData({
                        orderList: list,
                        hideHeader: true,
                        totalPage: res.data.totalPage,
                    })
                } else { // 加载更多
                    //console.log('加载更多');
                    var tempArray = _this.data.orderList;
                    tempArray = tempArray.concat(list);
                    _this.setData({
                        totalPage: res.data.totalPage,
                        orderList: tempArray,
                        //hideBottom: true
                    })
                }

            }
        });

    },
    //跳转首页(知道了)
    toIndex: function () {
        wx.switchTab({
            url: '/pages/index/index',
        })
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
