// pages/b2c/customerService/customerService.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        connectEmotion: ['😊', '😅', '😲', '😭', '😂', '😄', '😩', '😞', '😵', '😒', '😍',
            '😤', '😜', '😝', '😋', '😘', '😚', '😷', '😳', '😃', '😆', '😁', '😢', '😨',
            '😠', '😣', '😌', '😖', '😔', '😰', '😱', '😪', '😏', '😓'
        ],
        isShowEmotion: false,
        isFocus:false,
        bottom:0//输入框距离底部的距离
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
    showEmotion:function(){
        console.log('显示表情了');
        this.setData({
            isShowEmotion:true,
        })
        console.log('isShowEmotion',this.data.isShowEmotion);
    },
    showKey(){
        // if(this.data.isFocus){
        //
        // }
        this.setData({
            isFocus:true,
            isShowEmotion:false
        })
    },
    getFocus(e){
        console.log('333333',e.detail);
        this.setData({
            bottom:e.detail.height
        })
        if(this.data.isShowEmotion){
            this.setData({
                isShowEmotion:false
            })
        }
    },
    blur(){
        console.log('失去焦点');
        this.setData({
            isShowEmotionIcon:false
        })
    },
    insertEmotion(){

    },
})