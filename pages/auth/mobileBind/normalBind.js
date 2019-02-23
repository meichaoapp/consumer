// pages/auth/normalBind/normalBind.js
const util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();
var interval = null //倒计时函数
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: "",
        phone: "",
        userInfo: null,
        code_isFocus:false,
        time: 100,
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
      this.setData({
        mobile: options.mobile,
        phone: options.mobile,
        count: 0, //提交计数
      });
      let _this = this;
      let userInfo = wx.getStorageSync('userInfo');
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

  submit: function () {
    let _this = this;
    var data = {
      "userId": _this.data.userInfo.id, // id 用户id
      "wxPhone": _this.data.mobile, //从微信获取的手机号
      "phone": _this.data.phone, // 用户自主填的手机号
      "type": "mc_1002",
      "verifyCode":_this.data.code.join(",")
    }
    util.request(api.BindMobile, data, "POST").then(function (res) {
      if (res.rs == 1) {
        wx.showToast({
          title: '恭喜您绑定成功！',
        })
        //更新缓存信息
        userInfo.bindingPhone = _this.data.mobile;
        wx.setStorageSync('userInfo', userInfo);
        //跳转首页
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        wx.showToast({
          icon: "none",
          title: res.info
        })
      }
    });
  },

    bindPhone: function (e) {
      var _this = this;
      this.setData({
        phone: e.detail.value,
      })
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
      var _this = this;
      if (_this.data.count > 0) {
        return;
      }
      _this.setData({
        count: _this.data.count + 1,
      });

      if ("" == _this.data.phone || _this.data.phone == null) {
        _this.setData({
          count: 0,
        });
        wx.showToast({
          title: '手机号码不能为空，请填写后提交！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      var exp = new RegExp("^0?(13|15|18|14)[0-9]{9}$");
      if (!exp.test(_this.data.phone)) {
        _this.setData({
          count: 0,
        });
        wx.showToast({
          title: '手机号码格式不正确！',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      var data = {
        userId: _this.data.userInfo.id,
        phone: _this.data.phone,  //电话	      
        type: "mc_1002",  //类型 1001 添加、修改个人信息验证码	    
      };
      util.request(api.GetVerifiCode, data, "POST").then(function (res) {
        if (res.rs === 1) {
          console.log("获取验证码请求成功！");
          wx.showToast({
            title: '发送验证码成功！',
            icon: 'success',
            duration: 2000
          })
          _this.countDown();
        } else {
          _this.setData({
            count: 0,
          });
          wx.showToast({
            title: res.info,
            duration: 2000
          })
        }
      });
       
    },
  //倒计时
  countDown: function () {
    let that = this;
    var currentTime = that.data.time
    that.setData({
      isShowTime: true
    });
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: 100,
          isShowTime: false,
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