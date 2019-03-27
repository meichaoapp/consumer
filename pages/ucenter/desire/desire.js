var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const maps = require('../../../utils/maps.js');
var app = getApp();

Page({
  data: {
    basePath: app.globalData._base_path, //基础路径
    userInfo: {},
    latitude: 0.00,
    longitude: 0.00,
    address: "",	   //地址
    name: "", //商户姓名
    phone: "", //电话
    content:"",
  },

  onLoad: function (options) {

    this.$wuxToast = app.Wux().$wuxToast
    this.getCurrentLocation();
  },
  onReady: function () {

  },
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
    if (null == userInfo || userInfo == "" || undefined == userInfo) {
      wx.navigateTo({
        url: '/pages/auth/login/login'
      });
    }
    this.setData({
      userInfo: userInfo,
    });

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  //提交
  submit: function () {
    var _this = this;
    if (!_this.validate()) {
      return;
    }
    var data = {
      //token: wx.getStorageSync('token'),
      userId: _this.data.userInfo.id,
      openid: _this.data.userInfo.openid,
      latitude: _this.data.latitude,
      longitude: _this.data.longitude,
      address: _this.data.address,
      name: _this.data.name,
      phone: _this.data.phone,
      type:1,
      remark:_this.data.content,
    }
    util.request(api.Partner, data, "POST").then(function (res) {
      if (res.rs === 1) {
        _this.setData({
          name: "",
          phone: "",
          content:"",
        });
        _this.$wuxToast.show({ type: 'success', text: "提交成功!", });
      } else {
        _this.$wuxToast.show({ type: 'forbidden', text: res.info, });
      }

    }).catch((err) => {
      _this.$wuxToast.show({ type: 'forbidden', text: "提交失败，请重试！", });
      console.log(err)
    });
  },

  //选择位置
  selectLocation: function () {
    let _this = this;
    maps.getLocation().then(res => {
      _this.setData({
        address: res.name,//具体的出发地点
        longitude: res.longitude,
        latitude: res.latitude,
      })
    });
  },


  /**
   * 获取当前地理位置信息
   */
  getCurrentLocation: function () {
    var that = this;
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
            address: res.poisData[0].address,
          });

        });
      }
    })
  },

  bindContent: function (e) {
    var _this = this;
    this.setData({
      content: e.detail.value,
    })
  },

  bindName: function (e) {
    var _this = this;
    this.setData({
      name: e.detail.value,
    })
  },

  bindPhone: function (e) {
    var _this = this;
    this.setData({
      phone: e.detail.value,
    })
  },

  validate: function () {
    var _this = this;
    if ("" == _this.data.name || _this.data.name == null) {
      _this.$wuxToast.show({ type: 'forbidden', text: "商户名不能为空，请填写后提交！", });
      return false;
    }

    if (_this.data.name.length > 100) {
      _this.$wuxToast.show({ type: 'forbidden', text: "商户名不能大于100个字符！", });
      return false;
    }

    if ("" == _this.data.phone || _this.data.phone == null) {
      _this.$wuxToast.show({ type: 'forbidden', text: "联系电话不能为空，请填写后提交！", });
      return false;
    }
    var exp = new RegExp("^0?(13|15|18|14)[0-9]{9}$");
    var exp1 = new RegExp("^[0-9\-()（）]{7,18}$");
    if ((!exp.test(_this.data.phone)) && (!exp1.test(_this.data.phone))) {
      _this.$wuxToast.show({ type: 'forbidden', text: "联系电话格式不正确！", });
      return false;
    }
    if ("" == _this.data.phone || _this.data.phone == null) {
      _this.$wuxToast.show({ type: 'forbidden', text: "商超位置不能为空，请填写后提交！", });
      return false;
    }

    return true;
  }
})