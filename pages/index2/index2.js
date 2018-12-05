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
        userInfo: null,
        latitude: 0.00,
        longitude: 0.00,
        cityname: "",
        banners: [],
        start: 1, // 页码
        totalPage: 0, // 共有页
        limit: 3,//每页条数
        hideHeader: true, //隐藏顶部提示
        hideBottom: true, //隐藏底部提示
        srollViewHeight: 0, //滚动分页区域高度
        refreshTime: '', // 刷新的时间
        loadMoreData: '加载更多',
        classifyList: [
            {
                logo: '../../static/images/classify_01.png',
                name: '鲜嫩果蔬',
                index: 0
            },
            {
                logo: '../../static/images/classify_02.png',
                name: '休闲零食',
                index: 1
            },
            {
                logo: '../../static/images/classify_03.png',
                name: '家居用品',
                index: 2
            },
            {
                logo: '../../static/images/classify_04.png',
                name: '日用百货',
                index: 3
            }
        ],
        treasures:[],//一元购物
        sellList:[],//拼团店铺列表
        list: [], // 团购列表
    },
    onShareAppMessage: function () {
        return {
            title: '美超团购分享',
            desc: '美超团购',
            path: '/pages/index/index'
        }
    },

    onLoad: function (options) {
        if (options.id != undefined && options.source == 1) {
            wx.navigateTo({
                url: '/pages/shopping/dollarTreasureDetail/dollarTreasureDetail?tag=0&id=' + options.id + '&orderId=0'
            });
        }

        if (options.id != undefined && options.source == 0) {
            wx.navigateTo({
                url: '/pages/details/details?id=' + options.id
            });
        }

        this.$wuxLoading = app.Wux().$wuxLoading //加载
        //this.queryBanner();
        this.queryIndexInfo();
        this.queryTGList();
        let userInfo = wx.getStorageSync('userInfo');
        if (null != userInfo || userInfo != "" || undefined != userInfo) {
            this.setData({
                userInfo: userInfo,
            });
        }

    },

    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
        let userInfo = wx.getStorageSync('userInfo');

        if (null != userInfo || userInfo != "" || undefined != userInfo) {
            this.setData({
                userInfo: userInfo,
            });
        }
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

    // 上拉加载更多
    loadMore: function () {
        let _this = this;
        // 当前页是最后一页
        if (_this.data.start == _this.data.totalPage) {
            _this.setData({loadMoreData: '我是有底线的'})
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
            //_this.queryTGList();
            wx.stopPullDownRefresh();
        }, 300);
    },
    /**
     * 查询首页信息
     */
    queryIndexInfo: function () {
        let that = this;
        util.request(api.QueryIndexInfo, {token: ""}, "POST").then(function (res) {
            console.log('------首頁信息',res);
            if(res.rs === 1){
                that.setData({
                    banners:res.data.banners,
                    //classifyList:res.data.classifys
                    treasures:res.data.treasures
                })
            }
            // for(let item of that.treasures){
            //     item.ss = item.limitNum;
            // }
        });
    },
    /**
     * 团购信息
     */
    queryTGList: function (){
        let _this = this;
        _this.$wuxLoading.show({text: '数据加载中',});
        let data = {
            "merchantId": 1,//店铺id
            "start": 0,
            "limit": 20,
            "previewFlag": -1
        }
        util.request(api.QueryTGListv, data, "GET").then(function (res) {
            _this.$wuxLoading.hide(); //隐藏加载动画
            console.log('======团购信息======',res.data);
            _this.setData({
                sellList:res.data.sellList,
                list:res.data.list
            })
        })

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
})
