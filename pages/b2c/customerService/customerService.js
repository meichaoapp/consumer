var app = getApp();
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var WxParse = require('../../../lib/wxParse/wxParse.js');
var timeUtil = require('../../../utils/timeUtils.js');

const inputHeight = 54;
const emojiHeight = 224;
const timeouts = [];
let windowHeight;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        merchantId:0,
        merchant:{},
        userInfo:{},
        content:"", // 消息内容
        connectEmotion: ['😊', '😅', '😲', '😭', '😂', '😄', '😩', '😞', '😵', '😒', '😍',
            '😤', '😜', '😝', '😋', '😘', '😚', '😷', '😳', '😃', '😆', '😁', '😢', '😨',
            '😠', '😣', '😌', '😖', '😔', '😰', '😱', '😪', '😏', '😓'
        ],
        isShowEmotion: false,
        isFocus:false,
        sysInfo: {},
        scrollHeight: '0',
        scrollTop: 9999,
        bottom:0,//输入框距离底部的距离
        list: [], //消息集合
        start: 1, // 页码
        totalPage: 0, // 共有页
        limit: 10,//每页条数
        showMore: false, //显示更多历史消息提示
        loadType:0, //加载最新消息 0  历史消息 1
     
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let _this = this;
      _this.setData({
        merchantId:options.mid,
      });
      const sysInfo = wx.getSystemInfoSync()
      windowHeight = sysInfo.windowHeight
      const scrollHeight = `${windowHeight - inputHeight}px`
      _this.setData({
          scrollHeight: scrollHeight,
      });
      let userInfo = wx.getStorageSync('userInfo');
      if (null != userInfo && userInfo != "" && undefined != userInfo) {
        _this.setData({
          userInfo: userInfo,
        });
      }
      _this.loadMerchat(); //加载商户信息

      //开启刷新
      if (this.interval0) clearInterval(this.interval0);;
      this.interval0 = setInterval(function () {
        _this.refreshTimer();
      }, 30000);//30秒刷新

      //开启刷新
      if (this.interval) clearInterval(this.interval);;
      this.interval = setInterval(function () {
        _this.queryMessageHistory(); // 加载聊天信息
      }, 10000);//10秒刷新
    },

    //查询商户信息
    loadMerchat: function (merchant) {
      let that = this;
      var data = {
        "merchantId": that.data.merchantId,//商户ID
      };
      util.request(api.QueryMerchants, data, "POST").then(function (res) {
        //console.log('------商户信息', res);
        if (res.rs === 1) {
          var merchantList = res.data;
          if (null != merchantList && merchantList.length > 0) {
            that.setData({
              merchant: merchantList[0],
            })
          } 
          that.queryMessageHistory();
        }
      });
    },

   
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    onUnload: function () {
      if (this.interval0) clearInterval(this.interval0);
      if (this.interval) clearInterval(this.interval);
    },
   
    /**
     * 消息输入
     */
    msgInput: function (e) {
      var _this = this;
      this.setData({
        content: e.detail.value,
      })
    },

    /**
     * 发送聊天信息
     */
    sendMessage:function() {
      let _this = this;
      var content = _this.data.content ;
      if (content == "" || content == null) {
        wx.showToast({
          icon:'none',
          title: '发送内容不能为空!',
        })
        return;
      }
      var data = {
        "merchantId": _this.data.merchant.merchantId, //商户ID
        "userId": _this.data.userInfo.id, //用户ID
        "type": 2, // 1商户 2 用户,
        "merchantAvatar": _this.data.merchant.logo, // 商户头像
        "userAvatar": _this.data.userInfo.avatar, // 用户头像
        "content": content //内容
      };
      console.log("sendMessage-------" + JSON.stringify(data));
      util.request(api.SendMessage, data, "POST").then(function (res) {
        if (res.rs == 1) {
          //重新加载最近一页条消息
          _this.setData({
            list: [], //消息集合
            start: 1, // 页码
            totalPage: 0, // 共有页
            content:"",
          });
          _this.goBottom(500);
          _this.queryMessageHistory(); // 加载聊天信息
        }
      });
    },

    /**
     * 加载更多历史消息
     */
    loadMore: function() {
      let _this = this;
      // 当前页是最后一页
      if (_this.data.start >= _this.data.totalPage) {
        _this.setData({
          showMore: false, //显示更多历史消息提示
        })
        return;
      }
      setTimeout(function () {
        _this.setData({
          loadType: 1,
          start: _this.data.start + 1,
        })
        _this.queryMessageHistory();
      }, 300);
    },
    /**
     * 查询历史消息
     */
    queryMessageHistory:function() {
      let _this = this;
      var start = _this.data.start;
      var loadType = _this.data.loadType;
      if(loadType == 0) { start = 1;}
      let data = {
        merchantId: _this.data.merchant.merchantId,//店铺id
        userId: _this.data.userInfo.id, //用户ID
        start: start,     //分页开始页  必填
        limit: _this.data.limit,    //当前页共显示多少条  必填
      };
      util.request(api.QueryMessageHistory, data, "POST").then(function (res) {
        var list = res.data.list;
        if(loadType == 1) {
          if (_this.data.start == 1) {
            _this.setData({
              list: list,
              hideHeader: true,
              totalPage: res.data.totalPage,
              loadType: 0,
            })
          } else {
            var tempArray = _this.data.list;
            var fliterArr = [];
            if (tempArray != null && list != null) {
              list.forEach(m => {
                var isIn = false;
                tempArray.forEach(t => {
                  if (m.id == t.id) {
                    isIn = true;
                  }
                });
                if (!isIn) {
                  fliterArr.push(m);
                }
              });
              if (fliterArr) {
                tempArray = fliterArr.concat(tempArray);
              }
            }
            _this.setData({
              list: tempArray,
              totalPage: res.data.totalPage,
              loadType: 0,
            })
          }
          if (_this.data.start < _this.data.totalPage) {
            _this.setData({
              showMore: true, //显示更多历史消息提示
            })
          }
        }else {
          var tempArray = _this.data.list;
          var fliterArr = [];
          if (tempArray != null && list != null) {
             list.forEach(m => {
               var isIn = false;
               tempArray.forEach(t => {
                  if(m.id == t.id) {
                    isIn = true;
                  }
               });
               if(!isIn) {
                 fliterArr.push(m);
               }
             });
            if (fliterArr) {
              tempArray = tempArray.concat(fliterArr);
            }
          }else {
            tempArray = list;
          }
          _this.setData({
            list: tempArray,
            totalPage: res.data.totalPage,
          })
        }

        _this.refreshTimer();
      })
      
    },

    /**
    * 刷新时间
    */
    refreshTimer: function () {
      var _this = this;
      if (_this.data.list) {
        for (var i = 0; i < _this.data.list.length; i++) {
          var time = _this.data.list[i].createTimeStr;
          if (time == null || time == undefined || time == "") {
            time = new Date().toLocaleDateString();
          }
          _this.data.list[i].timer = timeUtil.getDateDiff(new Date().getTime());
        }
        _this.setData({
          list: _this.data.list,
        });
      }
    },


    showEmotion:function(){
        console.log('显示表情了');
        this.setData({
            isShowEmotion:true,
            scrollHeight: `${windowHeight - inputHeight - emojiHeight}px`,
        })
        this.goBottom(50);
        console.log('isShowEmotion',this.data.isShowEmotion);
    },
    showKey(){
        this.setData({
            isFocus:true,
            isShowEmotion:false,
            scrollHeight: `${windowHeight - inputHeight}px`,
        })
    },
    onUnload: function () {
        // 清除定时器
        timeouts.forEach(item => {
            clearTimeout(item)
        })
    },
    // 滚动聊天
    goBottom: function (n = 0) {
        timeouts.push(setTimeout(() => {
            this.setData({
                scrollTop: 9999
            })
        }, n))
    },
    getFocus(e){
        console.log('333333',e.detail);
        this.setData({
            bottom:e.detail.height
        })
        if(this.data.isShowEmotion){
            this.setData({
                isShowEmotion:false,
                scrollHeight: `${windowHeight - inputHeight}px`,
            })
        }
    },
    blur(e){
        console.log('失去焦点');
        this.setData({
            isShowEmotionIcon:false,
            content: e.detail.value
        })
    },
    insertEmotion(e){
        const { key } = e.currentTarget.dataset;
        this.setData({ content: this.data.content + key });
    },
    // 点击滚动框
    scrollClick: function () {
        const { isShowEmotion } = this.data;
        if (isShowEmotion) {
            this.setData({
                scrollHeight: `${windowHeight - inputHeight}px`,
                isShowEmotion: false
            });
        }
    },
})