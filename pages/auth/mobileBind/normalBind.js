// pages/auth/normalBind/normalBind.js
var interval = null //倒计时函数
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: "",
        userInfo: null,
        code_isFocus:false,
        time: 10,
        isShowTime:false,
        code: [],
        focus_status: [],
        length: 0,//已经输入的长度
        showModal:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let _this = this;
      let userInfo = wx.getStorageSync('userInfo');
      console.log("userinfo----" + userInfo);
      if (util.isNotNULL(userInfo)) {
        _this.setData({
          userInfo: userInfo,
        });
      }
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

  
    set_Focus() { //聚焦input
        var that = this
        that.setData({
            code_isFocus: true
        })
    },
    get_code(e) {
        var that = this;
        that.setData({
            code: e.detail.value
        });
        if (that.data.code.length == 0) {
            that.setData({
                focus_status: "1000"
            });
        }
        if (that.data.code.length == 1) {
            that.setData({
                length: e.detail.value.length,
                focus_status: "0100"
            });
        }
        if (that.data.code.length == 2) {
            that.setData({
                length: e.detail.value.length,
                focus_status: "0010"
            });
        }
        if (that.data.code.length == 3) {
            that.setData({
                length: e.detail.value.length,
                focus_status: "0001"
            });
        }
        if (that.data.code.length == 4) {
            that.setData({
                length: e.detail.value.length,
                // code_isFocus: false
            })
            console.log(that.data.code)
            //...
        }
    },
    //倒计时函数
    getCode: function (options) {
        var that = this;
        var currentTime = that.data.time
        that.setData({
            isShowTime:true
        });
        interval = setInterval(function () {
            currentTime--;
            that.setData({
                time: currentTime
            })
            if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                    time: 10,
                    isShowTime:false,
                    disabled: false
                })
            }
        }, 1000)
    },
    bindFinish(){
        this.setData({
            showModal:true
        })
    },
    closeFloat(){
        this.setData({
            showModal: false
        })
    }
})