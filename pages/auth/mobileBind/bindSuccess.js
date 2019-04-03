const util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
const wecache = require('../../../utils/wecache.js');
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
    code_isFocus: false,
    time: 60,
    isShowTime: false,
    code: [],
    focus_status: [],
    length: 0,//已经输入的长度
    showModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mobile: options.mobile,
      phone: options.phone,
      count: 0, //提交计数
    });

    let _this = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (util.isNotNULL(userInfo)) {
      _this.setData({
        userInfo: userInfo,
      });
    }

    _this.getCode();

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
          icon:"none",
          title: res.info,
          duration: 3000
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
  bindFinish() {
    let _this = this;
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
    if ("" == _this.data.code || _this.data.code == null) {
      _this.setData({
        count: 0,
      });
      wx.showToast({
        title: '验证码不能为空！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var data = {
      "userId": _this.data.userInfo.id, // id 用户id
      "wxPhone": _this.data.mobile, //从微信获取的手机号
      "phone": _this.data.phone, // 用户自主填的手机号
      "type": "mc_1002",
      "verifyCode": _this.data.code
    }
    var userInfo = _this.data.userInfo;
    util.request(api.BindMobile, data, "POST").then(function (res) {
      if (res.rs == 1) {
        //更新缓存信息
        _this.setData({
          showModal: true
        })
        userInfo.bindingPhone = _this.data.phone;
        wx.setStorageSync('userInfo', userInfo);
        //选择进入通道
        var pid = wecache.get("pid", 0);
        var mid = wecache.get("mid", 0);
        var did = wecache.get("did", 0);
        if (0 == pid) { //正常搜索进入
          //选择进入通道
          wx.redirectTo({
            url: '/pages/auth/selectEntry/selectEntry',
          })
        } else if (1 == pid || pid == 2) { //拼团首页和拼团详情页
          wx.redirectTo({
            url: '/pages/auth/choiceMerchant/choiceMerchant',
          })
        } else if (3 == pid) { // 电商首页
          wx.redirectTo({
            url: '/pages/b2c/index/index',
          })
        } else if (4 == pid) {// 电商详情页
          wecache.remove("did"); //清除
          wx.redirectTo({
            url: '/pages/b2c/details/details?id' = did,
          })
        } else if (5 == pid) {// 电商详情页
          wecache.remove("mid"); //清除
          wx.redirectTo({
            url: '/pages/b2c/shopIndex/shopIndex?mid' = mid,
          })
        } else {
          wx.redirectTo({
            url: '/pages/auth/choiceMerchant/choiceMerchant',
          })
        }
      } else {
        wx.showToast({
          icon: "none",
          title: res.info
        })
      }
    });


  },
  closeFloat() {
    this.setData({
      showModal: false
    })
    //跳转首页
    wx.switchTab({
      url: '/pages/index/index',
    })
  }

  
})