var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
    data: {
        basePath: app.globalData._base_path, //基础路径
        userInfo: {},
        isShowContactBox: true,
        list: [],// 优惠券列表
        appVersion: "0.0.1",
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        console.log(app.globalData);
        let userInfo = wx.getStorageSync('userInfo');

        // 页面显示
        if (userInfo) {
          app.globalData.userInfo = userInfo;
        }

        this.setData({
          userInfo: app.globalData.userInfo,
          appVersion: app.globalData._version
        });

        this.queryGifts();
    },
    onReady: function () {

    },
    onShow: function () {

        let userInfo = wx.getStorageSync('userInfo');

        // 页面显示
        if (userInfo) {
            app.globalData.userInfo = userInfo;
        }

        this.setData({
            userInfo: app.globalData.userInfo,
        });

    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭
    },
    //拨打客服电话
    callCFPhone: function (event) {
        //console.log("debug: 客服电话-----" + event.currentTarget.dataset.phone);
        wx.makePhoneCall({
            phoneNumber: event.currentTarget.dataset.phone, //客服电话
            success: function () {
                console.log("拨打电话成功！")
            },
            fail: function () {
            }
        })
        // wx.showModal({
        //   title: '提示',
        //   content: '即将为您拨通客服电话（' + event.currentTarget.dataset.phone + '）？',
        //   success: function (sm) {
        //     if (sm.confirm) {

        //     } else if (sm.cancel) {
        //       console.log('用户点击取消')
        //     }
        //   }
        // })

    },
    toShowContactBox() {
        wx.hideTabBar({})
        this.setData({
            isShowContactBox: false
        });
    },
    toHideContactBox() {
        wx.showTabBar({})
        this.setData({
            isShowContactBox: true
        });
    },
    goLogin(){
        let userInfo = wx.getStorageSync('userInfo');
        if (null == userInfo || userInfo == "" || undefined == userInfo) {
            wx.navigateTo({
                url: '/pages/auth/login/login'
            });
        }
    },
    exitLogin: function () {
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function (res) {
                if (res.confirm) {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
            }
        })

    },
    //获取流量超市优惠券
    queryGifts: function () {
        let that = this;
        util.request(api.QueryGifts,
            {
              "token": "",
              "nickName": that.data.userInfo.nickName,  //用户昵称      
              "type": "mc-customer",  //类型 mc-customer/ mc-merchant      
              "phone": that.data.userInfo.phone //用户绑定的手机号
            },
            "POST").then(function (res) {
            if (res.rs === 1) {
                that.setData({
                    list: res.data.list
                });
            }
        });
    },
    //导航跳转
    navTo: function (e) {
        var url = e.currentTarget.dataset.url;
        if (url == "null" || url == null) {
            return;
        }
        //跳转TabBar路径
        if (e.currentTarget.dataset.way == 1) {
            wx.switchTab({
                url: e.currentTarget.dataset.url
            });
        } else {
            wx.navigateTo({
                url: "/pages/thirdPage/thirdPage?url=" + url,
            })
        }
    },
})
