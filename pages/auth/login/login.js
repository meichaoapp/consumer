// pages/auth/login2/login2.js
const util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
const maps = require('../../../utils/maps.js');
const wecache = require('../../../utils/wecache.js');
var app = getApp();
const pointKey = "userLocation";
const currentMerchat = "currentMerchat";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 查看用户微信版本是否支持
    userInfo: null,
    latitude: 0.00,
    longitude: 0.00,
    cityname: "",
    pointName: "",
    count: 0, //提交计数
    merchantList: [], // 团长列表
    merchat: {},//选中的团长信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.$wuxToast = app.Wux().$wuxToast
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
    // 页面显示
    this.setData({
      count: 0, //提交计数
    });
    this.getCurrentLocation();
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
   * 获取当前地理位置信息
   */
  getCurrentLocation: function () {
    var that = this;
    var userLocation = wecache.get(pointKey, null);
    if (userLocation == null) {
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
              pointName: res.poisData[0].address,
            });

          });
        }
      })
    } else {
      that.setData({
        pointName: userLocation.pointName,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
      })
    }

    that.queryMerchats(); // 加载商户信息
  },

  //查询商户列表信息
  queryMerchats:function() {
    let that = this;
    var data = {
      "longitude": that.data.longitude,//经度
      "latitude": that.data.latitude,//纬度
    };
    util.request(api.QueryMerchants, data , "POST").then(function (res) {
      console.log('------商户信息', res);
      if (res.rs === 1) {
        var merchantList = res.data.list;
        if( null != merchantList) {
          that.setData({
            merchantList: merchantList,
            merchat: merchantList[0]
          })
        }
      }
    });
  },
  //选择团长，打开modal
  choiceMerchant(){
      this.setData({
          showModal:true
      })
  },
  closeMerchant() {
    this.setData({
      showModal: false
    })
  },
  //选中商户
  clickMerchant(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    console.log("clickMerchant id -- " + id);
    var merchantList = _this.data.merchantList;
    var merchat = {};
    if (null != merchantList) {
      merchantList.forEach(o => {
        if (o.merchantId == id) {
          merchat = o;
        }
      });
      _this.setData({
        merchat: merchat
      })
    }
  },
  //确认商户授权用户
  login: function (e) {
    var _this = this;
    if (_this.data.count > 0) {
      return;
    }
    if (_this.data.merchat == null) {
      _this.$wuxToast.show({ type: 'forbidden', text: "请选择商户信息", });
      _this.setData({
        count: 0,
      });
    }
    _this.setData({
      count: _this.data.count + 1,
    });
    var wxUser = e.detail.userInfo;
    console.log("userInfo" + wxUser)
    user.wxLogin(wxUser).then(res => {
      if (res.rs == 1) {
        _this.setData({
          userInfo: res.data.user
        });
        //缓存当前商户信息
        wx.setStorageSync(currentMerchat, _this.data.merchat);
        app.globalData.userInfo = res.data.user;
        app.globalData.token = res.data.token;
        wx.setStorageSync('userInfo', res.data.user);
        wx.setStorageSync('token', res.data.token);
        wx.navigateBack({
          delta: 1
        })
      } else {
        _this.setData({
          count: 0,
        });
        _this.$wuxToast.show({ type: 'forbidden', text: res.info, });
      }

    }).catch((err) => {
      _this.setData({
        count: 0,
      });
      _this.$wuxToast.show({ type: 'forbidden', text: "提交失败，请重试！", });
      console.log(err)
    });
  },
})
