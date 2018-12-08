const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const maps = require('../../utils/maps.js');
const wecache = require('../../utils/wecache.js');
const cart = require('../../services/cart.js');
const pointKey = "userLocation";
const currentMerchat = "currentMerchat";

//获取应用实例
const app = getApp()
Page({
    data: {
        userInfo: null,
        latitude: 0.00,
        longitude: 0.00,
        merchantList: [], // 团长列表
        merchat: {},//选中的团长信息
        cityname: "",
        banners: [],
        start: 1, // 页码
        totalPage: 0, // 共有页
        limit: 3,//每页条数
        hideHeader: true, //隐藏顶部提示
        hideBottom: true, //隐藏底部提示
        srollViewHeight: 0, //滚动分页区域高度
        refreshTime: '', // 刷新的时间
        loadMoreData: '加载更多',
        classifyList: [],//分类导航
        treasures:[],//一元购物
        sellList:[],//拼团店铺列表
        goodsList: [],//团购商品列表
        cartselfGoodsList: [],//购物车自营商品列表
        cartmerchatGoodsList: [],//购物车团购商品列表
        needPay:0.00, // 购物车核算价格
        goodsNums:0, //商品数量
        num:0,//和index相比，控制左侧显示激活状态样式
        showModal:false,

    },
    onShareAppMessage: function () {
        return {
            title: '美超团购分享',
            desc: '美超团购',
            path: '/pages/index/index'
        }
    },

    onLoad: function (options) {
        if (options.id != undefined && options.source == 1) {
            wx.navigateTo({
                url: '/pages/shopping/dollarTreasureDetail/dollarTreasureDetail?tag=0&id=' + options.id + '&orderId=0'
            });
        }

        if (options.id != undefined && options.source == 0) {
            wx.navigateTo({
                url: '/pages/details/details?id=' + options.id
            });
        }

        let userInfo = wx.getStorageSync('userInfo');
        console.log("userinfo----" + userInfo);
        if (null != userInfo && userInfo != "" && undefined != userInfo) {
          this.setData({
            userInfo: userInfo,
          });
        }else{
          wx.navigateTo({
            url: '/pages/auth/login/login'
          });
        }

        this.$wuxLoading = app.Wux().$wuxLoading //加载
        this.queryIndexInfo();
        //this.queryTGList();
        this.countDown();

    },

    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
        let userInfo = wx.getStorageSync('userInfo');

        if (null != userInfo || userInfo != "" || undefined != userInfo) {
            this.setData({
                userInfo: userInfo,
            });
        }

      let merchant = wx.getStorageSync(currentMerchat);
      if (null != merchant && undefined != merchant) {
        this.setData({
          merchat: merchant,
        });
      }
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.refresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.loadMore();
    },

    // 上拉加载更多
    loadMore: function () {
        let _this = this;
        // 当前页是最后一页
        if (_this.data.start == _this.data.totalPage) {
            _this.setData({loadMoreData: '我是有底线的'})
            return;
        }
        setTimeout(function () {
            console.log('上拉加载更多');
            _this.setData({
                start: _this.data.start + 1,
                hideBottom: false
            })
             _this.queryTGList();
        }, 300);
    },

    // 下拉刷新
    refresh: function (e) {
        let _this = this;
        setTimeout(function () {
            console.log('下拉刷新');
            _this.setData({
                start: 1,
                refreshTime: new Date().toLocaleTimeString(),
                hideHeader: false
            })
            //_this.queryTGList();
            wx.stopPullDownRefresh();
        }, 300);
    },
    /**
     * 查询首页信息
     */
    queryIndexInfo: function () {
        let that = this;
        util.request(api.QueryIndexInfo, {token: ""}, "POST").then(function (res) {
            if(res.rs === 1){
                that.setData({
                    banners:res.data.banners,
                    classifyList:res.data.classifys,
                    treasures:res.data.treasures,
                    merchantList:res.data.merchantList,
                    sellList: res.data.sellList,
                })
              that.queryTGList();
            }
        });

    },
    /**
     * 团购信息
     */
    queryTGList: function (){
        let _this = this;
        let sellType = 1;
        _this.$wuxLoading.show({text: '数据加载中',});
        sellType = _this.data.sellList[_this.data.num].sellType;
        //console.log("sellType--"+sellType);
        let data = {
            "merchantId": _this.data.merchat.merchantId,//店铺id
            "start": 0,     //分页开始页  必填
            "limit": 20,    //当前页共显示多少条  必填
            "previewFlag": -1,// 用于查询previewFlag为-1时，则可以预览新添的团品信息
            "sellType": sellType, // 销售类型被选中，默认为1
        }
       util.request(api.QueryTGNewList, data, "POST").then(function (res) {
            _this.$wuxLoading.hide(); //隐藏加载动画
            var goodsList = res.data.list;
            if (goodsList != null && goodsList.length > 0) {
              goodsList.forEach(o => {
                o.number = 0;
              });
              var _arr = cart.loadCart();//购物车商品
              //console.log("cart goods ---" + JSON.stringify(_arr));
              if (null != _arr && _arr.length > 0){
                var len = _arr.length;
                for (var i = 0; i < len; i++) {
                  var gid = _arr[i].id;
                  goodsList.forEach(o => {
                    if (o.id == gid){
                      o.number = _arr[i].number;
                    }
                  });
                }
              }

            }
            _this.setData({
              goodsList: goodsList,
            })
            _this.refreshCartRef();
        })

    },
    showList: function(e){
        let that = this;
        let index = e.currentTarget.dataset.index;
        let id = e.currentTarget.dataset.id;
        that.setData({
            num: index
        });
        that.queryTGList(id)
    },
    //选择团长，打开modal
    choiceMerchant(){
        this.setData({
            showModal:true
        })
    },

  modalCancel:function(){
    this.setData({
      showModal: false
    })
  },
  modalConfirm:function(){
    let _this = this;
    //console.log("modalConfirm-----");
    //将选中的商户写入缓存
    wx.setStorageSync(currentMerchat, _this.data.merchat);
    //刷新和重置数据
    _this.setData({
      goodsList: [],//团购商品列表
      cartGoodsList: [],//购物车商品列表
      needPay: 0.00, // 购物车核算价格
      goodsNums: 0, //商品数量
      num: 0,//和index相比，控制左侧显示激活状态样式
    });
    
    _this.queryTGList();

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
    //导航跳转
    navTo: function (e) {
        //跳转TabBar路径
        if (e.currentTarget.dataset.way == 1) {
            wx.switchTab({
                url: e.currentTarget.dataset.url
            });
        } else {
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
                success: function (res) {
                },
                fail: function (e) {
                    console.log("error--", e);
                }
            })
        }
    },
    //刷新购物车相关
    refreshCartRef:function(){

      let _this = this;
      
      var _arr = cart.loadCart();//购物车商品
      var cartselfGoodsList = [];
      var cartmerchatGoodsList = [];
      //console.log("cart goods ---" + JSON.stringify(_arr));
      if (null != _arr && _arr.length > 0) {
        var len = _arr.length;
        for (var i = 0; i < len; i++) {
          var productType = _arr[i].productType;
          if (productType == 1){
            cartmerchatGoodsList.push(_arr[i]);
          } else if (productType == 3) {
            cartselfGoodsList.push(_arr[i]);
          }
        }
      }
      _this.setData({
        needPay: cart.loadPrice().toFixed(2), // 购物车核算价格
        goodsNums: cart.loadGooodsNums(), //商品数量
        cartselfGoodsList: cartselfGoodsList,//购物车自营商品列表
        cartmerchatGoodsList: cartmerchatGoodsList,//购物车团购商品列表
      });
    },
    //减
  cutNumber: function (e) {
    let _this = this;
    var id = e.currentTarget.dataset.id;
    var goodsList = _this.data.goodsList;
    if (goodsList != null && goodsList.length > 0) {
      goodsList.forEach(o => {
        if (o.id == id) {
          o.number = o.number - 1;
          if (o.number < 0) {
            o.number = 0;
          }
          var g = cart.loadCartGoods(o.id);
          if (g != null) {//如果购物车以前有则更新
            if (o.number == 0) {
              cart.removeCart(o.id);
            }else {
              cart.updateCart(o);
            }

          }
        }
      });
    }
    _this.setData({
      goodsList: goodsList,
    });
    _this.refreshCartRef();
  },
  //加
  addNumber: function (e) {
    let _this = this;
    var id = e.currentTarget.dataset.id;
    var goodsList = _this.data.goodsList;
    if (goodsList != null && goodsList.length > 0) {
      goodsList.forEach(o => {
        if (o.id == id) {
          o.number = o.number + 1;
          var g = cart.loadCartGoods(o.id);
          console.log("购物无车商品---" + JSON.stringify(g));
          if (g == null) {//如果没有则加入购物车
            cart.add2Cart(o);
          } else {//如果购物车以前有则更新购物车商品数量
            cart.updateCart(o);
          }

        }
      });
    }

    _this.setData({
      goodsList: goodsList,
    });
    _this.refreshCartRef();
  },
  ///清除购物车商品
  clearCart:function(){
     let _this = this;
     cart.cleanCart();
    var goodsList = _this.data.goodsList;
    if (goodsList != null && goodsList.length > 0) {
      goodsList.forEach(o => {
        o.number = 0;
      });
    }
    _this.setData({
      goodsList: goodsList,
    });
    _this.refreshCartRef();
  },

    //打开购物车详情
  openshopCar:function() {
      let that = this;
      // 显示遮罩层
      var animation = wx.createAnimation({
          duration: 200,
          timingFunction: "linear",
          delay: 0
      })
      that.animation = animation
      animation.translateY(300).step()
          that.setData({
              animationData: animation.export(),
              shopCarStatus: true
          })
      setTimeout(function () {
          animation.translateY(0).step()
          that.setData({
              animationData: animation.export()
          })
      }.bind(this), 200)
  },
    //隐藏购物车详情
  hideshopCar: function() {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
          duration: 200,
          timingFunction: "linear",
          delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
          animationData: animation.export(),
      })
      setTimeout(function() {
          animation.translateY(0).step()
          this.setData({
              animationData: animation.export(),
              shopCarStatus: false,
          })
      }.bind(this), 200)
  },
  //小于10的格式化函数
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let list = this.data.treasures;
    let countDownArr = [];

    if (list != null && list.length > 0) {
      // 对结束时间进行处理渲染到页面
      list.forEach(o => {
        if (o.status == 0) {

          let startTime = new Date(o.startTime).getTime();
          let endTime = new Date(o.endTime).getTime();

          if (newTime - startTime >= 0) {
            // 如果活动未结束，对时间进行处理
            if (endTime - newTime > 0) {
              let time = (endTime - newTime) / 1000;
              // 获取天、时、分、秒
              let day = parseInt(time / (60 * 60 * 24));
              let hou = parseInt(time % (60 * 60 * 24) / 3600) + 24 * day;
              let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
              let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);

              o.day = this.timeFormat(day);
              o.hour = this.timeFormat(hou);
              o.min = this.timeFormat(min);
              o.sec = this.timeFormat(sec);
            } else {//活动已结束，全部设置为'00'
              o.status = 1;
              o.day = this.timeFormat(0);
              o.hour = this.timeFormat(0);
              o.min = this.timeFormat(0);
              o.sec = this.timeFormat(0);
            }
          } else {
            o.day = this.timeFormat(0);
            o.hour = this.timeFormat(0);
            o.min = this.timeFormat(0);
            o.sec = this.timeFormat(0);
            o.status = 1;
          }
        } else {
          o.day = this.timeFormat(0);
          o.hour = this.timeFormat(0);
          o.min = this.timeFormat(0);
          o.sec = this.timeFormat(0);
          o.status = 1;
        }
        //console.log("o.status---" + o.status);
      })

      this.setData({ treasures: list })
    }
    // 渲染，然后每隔一秒执行一次倒计时函数
    setTimeout(this.countDown, 1000);
  }
})
