var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const user = require('../../../services/user.js');
var app = getApp();

const countTime = 120; // 120 s

Page({
  data: {
    basePath: app.globalData._base_path, //基础路径
    tag:0,
    userInfo: {},
    region: ['北京市', '北京市', '海淀区'],
    customItem: '全部',
    tabIndex: 0,
    userId: 0,  //用户id
    userInfoId: 0,  //用户信息id
    phone: "",  //手机号
    name: "",  //联系人
    province: "北京市",  //省code
    city: "北京市",  //市code
    area: "海淀区",  //地区code
    address: "",  //详细地址
    verifiCode:"",//验证码
    refreshTime:0,
    count: 0, //提交计数
  },
  onLoad: function (options) {
    this.setData({
      tag: options.tag
    });
    // 页面初始化 options为页面跳转所带来的参数
    this.$wuxToast = app.Wux().$wuxToast
    let userInfo = wx.getStorageSync('userInfo');
    if (null == userInfo || userInfo == "" || undefined == userInfo) {
      wx.navigateTo({
        url: '/pages/auth/login/login'
      });
    }
    this.setData({
      userInfo: userInfo,
      userId: userInfo.id,
    });
  
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    let userInfo = wx.getStorageSync('userInfo');
    if (null == userInfo || userInfo == "" || undefined == userInfo) {
      wx.navigateTo({
        url: '/pages/auth/login/login'
      });
    }
    this.setData({
      userInfo: userInfo,
      userId:userInfo.id,
    });
    //查询用户信息
    this.queryUserInfo();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  bindRegionChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    var region = e.detail.value;
    this.setData({
      region: e.detail.value,
      province: region[0],
      city: region[1],
      area: region[2],

    })
  },
    //查询用户信息
  queryUserInfo: function(){
    let  _this = this;
    var data = {
      userId: _this.data.userId,
    };
    util.request(api.QueryUserInfo, data, "POST").then(function (res) {
      if (res.rs === 1) {
        console.log("QueryUserInfo------" + JSON.stringify(res.data));
        var region = [];
        var province = res.data.province;
        var city = res.data.city;
        var area = res.data.area;
        region[0] = (province != null && province != "" ) ? province : _this.data.province;
        region[1] = (city != null && city != "" ) ? city : _this.data.city;
        region[2] = (area != null && area != "" ) ? area : _this.data.area;
        _this.setData({
          userInfoId: res.data.userInfoId,  //用户信息id
          phone: res.data.phone,  //手机号
          name: res.data.name,  //联系人
          province: region[0],  //省code
          city: region[1],  //市code
          area: region[2],  //地区code
          address: res.data.address,  //详细地址
          region: region,
        });
      }
    });
  },
  //获取验证码
  getVerifiCode: function () {
    let _this = this;
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
      _this.$wuxToast.show({ type: 'forbidden', text: "手机号码不能为空，请填写后提交！", });
      return;
    }
    var exp = new RegExp("^0?(13|15|18|14|17)[0-9]{9}$");
    if (!exp.test(_this.data.phone)) {
      _this.setData({
        count: 0,
      });
      _this.$wuxToast.show({ type: 'forbidden', text: "手机号码格式不正确！", });
      return;
    }
    

    var data = {
      userId: _this.data.userInfo.id,
      phone: _this.data.phone,  //电话	      
      type: "mc_1001",  //类型 1001 添加、修改个人信息验证码	    
    };
    util.request(api.GetVerifiCode, data, "POST").then(function (res) {
      if (res.rs === 1) {
        console.log("获取验证码请求成功！");
        _this.setData({
          refreshTime: countTime,
        })
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
        _this.$wuxToast.show({ type: 'forbidden', text: res.info, });
      }
    });
  },
  //倒计时
  countDown:function(){
    let _this = this;
    if (_this.data.refreshTime <= 0){
      _this.setData({
        count: 0,
        refreshTime: 0,
      })
      return;
    }
    _this.setData({
      refreshTime: _this.data.refreshTime - 1,
    })
    setTimeout(_this.countDown,1000);
  },

  //提交用户信息
  submitUserInfo: function () {
    let _this = this;
    if (!_this.validate()) { return; }
    var data = {
      userId: _this.data.userInfo.id,
      userInfoId: _this.data.userInfoId,  //用户信息id
      phone: _this.data.phone,  //手机号
      name: _this.data.name,  //联系人
      province: _this.data.province,  //省code
      city: _this.data.city,  //市code
      area: _this.data.area,  //地区code
      address: _this.data.address,  //详细地址
      verifiCode: _this.data.verifiCode,
    };
    util.request(api.SubmitUserInfo, data, "POST").then(function (res) {
      if (res.rs === 1) {
        console.log("提交用户信息请求成功！");
        //设置缓存
        var userInfo = _this.data.userInfo;
        userInfo.completionInfo = true;
        userInfo.phone = _this.data.phone;
        userInfo.name = _this.data.name;
        user.province = _this.data.province;  //省code
        user.city =  _this.data.city;  //市code
        user.area =  _this.data.area;  //地区code
        userInfo.address =  _this.data.address; //详细地址

        wx.setStorageSync('userInfo', userInfo);
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1
        })
      } else {
        _this.$wuxToast.show({ type: 'forbidden', text: res.info, });
      }
    });
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

  bindVerifiCode: function (e) {
    var _this = this;
    this.setData({
      verifiCode: e.detail.value,
    })
  },

  bindAddress: function (e) {
    var _this = this;
   
    this.setData({
      address: e.detail.value,
    })
  },

  validate: function () {
    var _this = this;
    // if ("" == _this.data.verifiCode || _this.data.verifiCode == null) {
    //   _this.$wuxToast.show({ type: 'forbidden', text: "验证码不能为空，请填写后提交！", });
    //   return false;
    // }

    if ("" == _this.data.name || _this.data.name == null) {
      _this.$wuxToast.show({ type: 'forbidden', text: "收货人姓名不能为空，请填写后提交！", });
      return false;
    }

    if (_this.data.name.length > 100) {
      _this.$wuxToast.show({ type: 'forbidden', text: "收货人姓名不能大于100个字符！", });
      return false;
    }

    if ("" == _this.data.phone || _this.data.phone == null) {
      _this.$wuxToast.show({ type: 'forbidden', text: "手机号码不能为空，请填写后提交！", });
      return false;
    }
    var exp = new RegExp("^0?(13|15|18|14)[0-9]{9}$");
    if (!exp.test(_this.data.phone)) {
      _this.$wuxToast.show({ type: 'forbidden', text: "手机号码格式不正确！", });
      return false;
    }
    if ("" == _this.data.address || _this.data.address == null) {
      _this.$wuxToast.show({ type: 'forbidden', text: "详细地址不能为空，请填写后提交！", });
      return false;
    }

    if (null == _this.data.city || "" == _this.data.city || "全部" == _this.data.city
      || null == _this.data.area || "" == _this.data.area || "全部" == _this.data.area
      || null == _this.data.province || "" == _this.data.province || "全部" == _this.data.province
    ) {
      _this.$wuxToast.show({ type: 'forbidden', text: "请选择完整的地区！", });
      return false;
    }

    return true;
  }
})