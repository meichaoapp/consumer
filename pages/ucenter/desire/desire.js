var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    array: ['请选择反馈类型', '商品相关', '物流状况', '客户服务', '优惠活动', '功能异常', '产品建议', '其他'],
    index: 0,
    content:"",
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function (options) {
    this.$wuxToast = app.Wux().$wuxToast

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  //提交
  submit:function(){
    var _this = this;
    if ("" == _this.data.content || _this.data.content == null){
      _this.$wuxToast.show({ type: 'forbidden', text: "内容不能为空，请填写后提交！", });
      return;
    }
    var data ={
       content: _this.data.content,
    }
    util.request(api.Desire, data,"POST").then(function (res) {
      if (res.rs === 1) {
        _this.setData({
          content: "",
        });
        _this.$wuxToast.show({ type: 'success', text: "提交成功!", });
      }
    });
  },

  //绑定愿望
  bindContent: function (e) {
    var _this = this;
    this.setData({
      content: e.detail.value,
    })
  },
})