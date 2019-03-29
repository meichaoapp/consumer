// pages/b2c/details/details.js
var app = getApp();
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        basePath: app.globalData._base_path, //基础路径
        detail: {}, //商品详情
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.queryShopDetail();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    queryShopDetail : function() {
        let that = this;
        util.request(api.QueryShopDetail, {id: 1}, "POST").then(function (res) {
            if (res.rs == 1) {
                var data = res.data;
                let detail = data.detail
                that.setData({
                    detail:detail
                })
            }
        });
    },
    //打开规格弹窗
    openSpecsBox: function () {
        let that = this;
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        that.animation = animation
        animation.translateY(300).step()
        that.setData({
            animationData: animation.export(),
            specsStatus: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    hideSpecsBox: function () {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                specsStatus: false,
            })
        }.bind(this), 200)
    },
})