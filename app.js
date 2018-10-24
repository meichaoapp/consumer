//全局对象 可以通过 var app = getApp()获取到  设置 ：app.属性= xx
import Wux from 'components/wux'
import WxValidate from 'assets/plugins/WxValidate'
var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

App({
  onLaunch: function () {
  },

  Wux: Wux,
  WxValidate: (rules, messages) => new WxValidate(rules, messages), 
  
  globalData: {
    _version:"v1.0",
    _platformName:"美超",
    userInfo: {
      id:0,
      nickName: 'Hi,游客',
      userName: '点击去登录',
      avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    token: '',
  }
})