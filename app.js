//全局对象 可以通过 var app = getApp()获取到  设置 ：app.属性= xx
import Wux from 'components/wux'
import WxValidate from 'assets/plugins/WxValidate'
var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好,重启应用',
        showCancel: false,//是否显示取消按钮
        success: function (res) {
          if (res.confirm) {
            //清空缓存
            wx.clearStorageSync();
            wx.clearStorage();
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败,请手动删除，并重新搜索使用',
        showCancel: false
      })
    })
  },

  Wux: Wux,
  WxValidate: (rules, messages) => new WxValidate(rules, messages), 
  
  globalData: {
    _version:"v1.1",
    _platformName:"美超",
    userInfo: {
      id:0,
      nickName: 'Hi,游客',
      userName: '点击去登录',
      avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    token: '',
    _base_path:"https://wxpic.iliangpin.cn/meichao/mini-program/consumer/",
  }
})