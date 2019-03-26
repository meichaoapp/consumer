// pages/auth/login2/login2.js
const util = require('../../../utils/util.js');
const auth = require('../../../utils/auth.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
const maps = require('../../../utils/maps.js');
const wecache = require('../../../utils/wecache.js');
const cart = require('../../../services/cart.js');
var app = getApp();
const pointKey = "userLocation";
const currentMerchat = "currentMerchat";
const currIndex = "currIndex";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.globalData._base_path, //基础路径
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 查看用户微信版本是否支持
    userInfo: null,
    latitude: 0.00,
    longitude: 0.00,
    cityname: "",
    pointName: "",
    count: 0, //提交计数
    merchantList: [], // 团长列表
    merchat: {},//选中的团长信息
    merchantSelected: {},//选中的团长信息
    currentIndex:0,
    tmpCurrentIndex: 0,
    searchText: '', // 搜索店铺名称、地址
    isAuthLocation:false, //是否授权位置信息
    mid:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.$wuxToast = app.Wux().$wuxToast
    let that = this;
    var mid = wecache.get("mid",0);
    that.setData({
      mid: mid,
    });

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
    let _this = this;
    // 页面显示
    this.setData({
      count: 0, //提交计数
    });
    auth.authLocation().then(function (res) {
      _this.setData({
        isAuthLocation: res, 
      });
      if (res) {
        _this.getCurrentLocation();
      }
    }).catch((res) => {
      _this.setData({
        isAuthLocation: res,
      });
    });
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
        that.queryMerchats(); // 加载商户信息
      },
      fail: function (res){
        console.log("error-----------" + res);
      }
    })



  },
  //绑定改变
  bindSearchText: function (e) {
    var _this = this;
    this.setData({
      searchText: e.detail.value,
    })
  },
  //查询商户列表信息
  queryMerchats:function() {
    let that = this;
    var data = {
      "longitude": that.data.longitude,//经度
      "latitude": that.data.latitude,//纬度
      "searchText": that.data.searchText,
    };
    util.request(api.QueryMerchants, data , "POST").then(function (res) {
      console.log('------商户信息', res);
      if (res.rs === 1) {
        var merchantList = res.data;
        let merchant = wx.getStorageSync(currentMerchat);
        let currentIndex = wx.getStorageSync(currIndex);
        if (that.data.mid != 0) {
          for(var j = 0; j < merchantList.length ; j++) {
            if (merchantList[j].merchantId == that.data.mid){
              merchant = merchantList[j];
              currentIndex = j;
            }
          }
        }
        var i = 0;
        if (null == merchant || merchant == "") {
          merchant = merchantList[0];
        }
        if (currentIndex != null || currentIndex != "") {
          i = currentIndex;
        }
      
        if( null != merchantList) {
          that.setData({
            merchantList: merchantList,
            merchat: merchant,
            currentIndex: currentIndex,
          })
        }
      }
    });
  },
  //选择团长，打开modal
  choiceMerchant(){
      let _this = this;
      this.setData({
          tmpCurrentIndex: _this.data.currentIndex,
          showModal:true,
          searchText: '', // 搜索店铺名称、地址
      })
    this.queryMerchats();
  },
  closeModal() {
    this.setData({
      merchantSelected: {}, //清空临时
      showModal: false,
      tmpCurrentIndex: 0,
    })
  },
  //确认选中商户
  modalConfirm:function(){
      let _this = this;
      _this.setData({
          showModal: false,
          merchat: _this.data.merchantSelected,
          currentIndex: _this.data.tmpCurrentIndex,
      });

    //将选中的商户写入缓存
    wx.setStorageSync(currentMerchat, _this.data.merchat);
    wx.setStorageSync(currIndex, _this.data.currentIndex);

  },
  //选中商户
  clickMerchant(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index;
      _this.setData({
        tmpCurrentIndex: index,
      })
    var merchantList = _this.data.merchantList;
    var merchat = {};
    if (null != merchantList) {
      merchantList.forEach(o => {
        if (o.merchantId == id) {
          merchat = o;
        }
      });
      _this.setData({
        merchantSelected: merchat
      })
    }
  },
  //确认商户授权用户
  submit: function () {
    var _this = this;
    if(!_this.data.isAuthLocation) { // 未授权位置信息
      wx.showModal({
        title: '提示',
        content: '您未开通权限，部分功能无法正常使用，请先开通权限',
        showCancel: false,
        confirmColor: "#c00",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return;
    }
    if (_this.data.merchat == null) {
      _this.$wuxToast.show({ type: 'forbidden', text: "请选择商户信息", });
    }
    //缓存当前商户信息
    wx.setStorageSync(currentMerchat, _this.data.merchat);
        //缓存当前商户的index值，方便首页读取，设置选中状态
    var index = _this.data.currentIndex;
    if (util.isNotNULL(index) == false) { index = 0; }
    wx.setStorageSync(currIndex, index);
    wecache.remove("mid"); //清除
    wx.switchTab({
      url: '/pages/index/index',
    })

  
  },
})
