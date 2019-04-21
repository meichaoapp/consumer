const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const log = require('../../services/log.js');
const mt = require('../../services/merchant.js');
const maps = require('../../utils/maps.js');
const wecache = require('../../utils/wecache.js');
const cart = require('../../services/cart.js');
const pointKey = "userLocation";
const currentMerchat = "currentMerchat";
const currIndex = "currIndex";
//获取应用实例
const app = getApp()
Page({
    data: {
        basePath: app.globalData._base_path, //基础路径
        userInfo: null,
        latitude: 0.00,
        longitude: 0.00,
        merchantList: [], // 团长列表
        merchant: {},//选中的团长信息
        merchantSelected: {},//选中的团长信息
        cityname: "",
        banners: [],
        start: 1, // 页码
        totalPage: 0, // 共有页
        limit: 10,//每页条数
        hideHeader: true, //隐藏顶部提示
        hideBottom: true, //隐藏底部提示
        srollViewHeight: 0, //滚动分页区域高度
        refreshTime: '', // 刷新的时间
        loadMoreData: '上滑加载更多',
        classifyList: [],//分类导航
        treasures: [],//一元购物
        sellList: [],//拼团店铺列表
        goodsList: [],//团购商品列表
        cartselfGoodsList: [],//购物车自营商品列表
        cartmerchatGoodsList: [],//购物车团购商品列表
        cartcouponGoodsList: [],//优惠券商品列表
        cartb2cGoodsList: [],//电商购物车商品列表
        needPay: 0.00, // 购物车核算价格
        goodsNums: 0, //商品数量
        num: 0,//和index相比，控制左侧显示激活状态样式
        currentIndex: 0,
        tmpCurrentIndex: 0,
        showModal: false,
        searchText: '', // 搜索店铺名称、地址
        swithModal: false,
        merchantId: null, //分享携带的商户ID
        pid:0,//分享携带的页面ID
        scrollTop: '',    //滑动的距离
        navFixed: false,  //导航是否固定

    },
    onShareAppMessage: function () {
        let _this = this;
        return {
            title: '美超团购分享',
            desc: '美超团购',
            path: '/pages/index/index?mid=' + _this.data.merchant.merchantId + "&pid=1"
        }
    },

    onLoad: function (options) {
        this.$wuxLoading = app.Wux().$wuxLoading //加载
        let that = this;
        var mid = options.mid;
       
        var pid = options.pid;
        if (typeof (mid) == "undefined") {
          mid = null;
        }
        if (pid == undefined) {pid = 0;}
        that.setData({
            merchantId: mid,
            pid:pid,
        });

       that.checkUser(mid);  //检查用户
       
        
        /** 设备信息 */
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth,
                    height:res.screenHeight  //屏幕高度
                })
            },
        })

    },


    //检查用户
    checkUser: function (mid) {
        let _this = this;
        let userInfo = wx.getStorageSync('userInfo');
        //console.log("checkUser-000000000------" + JSON.stringify(userInfo));
        if (util.isNotNULL(userInfo)) {
            _this.setData({userInfo: userInfo,});
             wx.setStorageSync('userInfo', userInfo);
            _this.checkMerchant(mid); //检查商户
        } else {
            wecache.put("pid", _this.data.pid, 0);
            wecache.put("mid", mid != null ? mid : 0, 0);
            wx.redirectTo({
              url: '/pages/auth/wxLogin/wxLogin' 
            });
        }
     
    },

    //检查商户
    checkMerchant: function (mid) {
        let that = this;
        let merchant = wx.getStorageSync(currentMerchat);
        let currentIndex = wx.getStorageSync(currIndex);

        if (null != merchant && undefined != merchant
            && null != currentIndex && undefined != currentIndex) {
            console.log("mid--------" + mid + "----merchant.merchantId-------" + merchant.merchantId);
            if (merchant.merchantId == undefined
                || merchant.merchantId == null
                || merchant.merchantId == "") {
                //清空缓存
                //wx.clearStorageSync();
                //wx.clearStorage();
                cart.cleanCart2();
                wecache.put("mid", mid != null ? mid : 0, 0);
                wx.redirectTo({
                  url: '/pages/auth/choiceMerchant/choiceMerchant'
                });
              
            }

            this.setData({
                merchant: merchant,
                currentIndex: currentIndex
            });
            console.log("mid--------" + mid + "----merchant.merchantId-------" + that.data.merchant.merchantId);

            if (null != mid && "" != mid && undefined != mid && mid != that.data.merchant.merchantId) {
                console.log("mid--------" + mid);
                that.setData({
                    swithModal: true,
                });
            }
        } else {

          wecache.put("mid", mid != null ? mid : 0, 0);
          wx.redirectTo({
            url: '/pages/auth/choiceMerchant/choiceMerchant'
          });
        }
    },

    //不切换社区
    cancleSwitchMerchant: function () {
        this.setData({
            swithModal: false,
        });
    },


    //切换商户列表信息
    swithchMerchats: function () {
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

                var data = {
                    "longitude": that.data.longitude,//经度
                    "latitude": that.data.latitude,//纬度
                };

                util.request(api.QueryMerchants, data, "POST").then(function (res) {
                    //console.log('------商户信息', res);
                    if (res.rs === 1) {
                        var merchantList = res.data;
                        var merchant = null;
                        let currentIndex = 0;
                        if (null != merchantList) {
                            for (var i = 0; i < merchantList.length; i++) {
                                if (merchantList[i].merchantId == that.data.merchantId) {
                                    currentIndex = i;
                                    merchant = merchantList[i];
                                }
                            }
                            that.setData({
                                swithModal: false,
                                merchant: merchant,
                                currentIndex: currentIndex,
                                start: 1, // 页码
                                totalPage: 0, // 共有页
                                goodsList: [],//团购商品列表
                                num: 0,
                            });
                            //缓存当前商户信息
                            wx.setStorageSync(currentMerchat, merchant);
                            //缓存当前商户的index值，方便首页读取，设置选中状态
                            wx.setStorageSync('currIndex', currentIndex);

                            //清空购物车
                            cart.cleanCart2();
                            that.refreshCartRef();
                            wx.showToast({
                                title: '切换成功',
                            })

                            that.queryTGList();

                        }
                    } else {
                        log.collectLog(0, "首页-切换商户", "groupPurchase/merchants", JSON.stringify(data), JSON.stringify(res), "", that.data.userInfo.id);
                    }
                });

            }
        })


    },

    onShow: function () {
      let _this = this;
      let userInfo = wx.getStorageSync('userInfo');
      //console.log("checkUser-011111111------" + JSON.stringify(userInfo));
      if (util.isNotNULL(userInfo)) {
        _this.setData({ userInfo: userInfo, });
        let merchant = wx.getStorageSync(currentMerchat);
        let currentIndex = wx.getStorageSync("currIndex");
        if (util.isNotNULL(merchant)) {
          this.setData({
            merchant: merchant,
            currentIndex: currentIndex
          });
          _this.queryIndexInfo(); // 查询首页信息
          _this.getCurrentLocation();
        } else {
          wecache.put("mid", 0, 0);
          wx.redirectTo({
            url: '/pages/auth/choiceMerchant/choiceMerchant'
          });
        }
      } else {
        wx.redirectTo({
          url: '/pages/auth/wxLogin/wxLogin'
        });
      }

      this.refreshCartRef();
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.refresh();
        this.refreshCartRef();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    // onReachBottom: function () {
    //     this.loadMore();
    // },
    //触底后加载更多
    lower() {
        this.loadMore();
    },
    // 上拉加载更多
    loadMore: function () {
        let _this = this;
        // 当前页是最后一页
        if (_this.data.start >= _this.data.totalPage) {
            _this.setData({
                loadMoreData: '我是有底线的',
                hideBottom: false
            })
            console.log('---我是有底线的哦---')
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
            _this.getCurrentLocation();
            wx.stopPullDownRefresh();
        }, 300);
    },

    /**
     * 监听类型点击事件
     */
    listenerSellTypeClick:function(e) {
      let that = this;
      let id = e.currentTarget.dataset.id;
      let type = e.currentTarget.dataset.type;
      if (type == 1){
        let index = e.currentTarget.dataset.index;
        that.setData({
          num: index,
          goodsList: [],
          start: 1,
          loadMoreData: '上滑加载更多'
        });
        that.queryTGList(id)
      }else {
        wx.redirectTo({
          url: '/pages/b2c/index/index?type=' + id,
        })
      }
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
            },
            fail: function (res) {
            },
            complete: function (res) {
                that.queryMerchats();
            }
        })
    },
    /**
     * 跳转详情页
     */
    toDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        var type = e.currentTarget.dataset.type;
        if (5 == type) {
            wx.navigateTo({
                url: '/pages/details/couponDetail?id=' + id,
            })
        } else {
            wx.navigateTo({
                url: '/pages/details/details?source=0&id=' + id,
            })
        }

    },
    //监听滑动
    layoutScroll: function (e) {

        this.data.scrollTop = this.data.scrollTop * 1 + e.detail.deltaY * 1;
        console.log(this.data.scrollTop)
        console.log(this.data.navFixed)
        var navtopHeight = 61;
        if (this.data.scrollTop <= -navtopHeight) {
            this.setData({
                navFixed: true
            })
        } else {
            this.setData({
                navFixed: false
            })
        }
    },
    /**
     * 查询首页信息
     */
    queryIndexInfo: function () {
        let that = this;
        var data = {
            "token": "",
        };
        util.request(api.QueryIndexInfo, data, "POST").then(function (res) {
            if (res.rs === 1) {
                that.setData({
                    banners: res.data.banners,
                    classifyList: res.data.classifys,
                    sellList: res.data.sellList,
                    //start: 1, // 页码
                    //totalPage: 0, // 共有页
                    //goodsList: [],//团购商品列表
                })
                that.queryTGList();
            } else {
                log.collectLog(0, "首页-轮播图、分类信息", "consumer/info", JSON.stringify(data), JSON.stringify(res), "", that.data.userInfo.id);
            }
        });

    },
  
    /**
     * 团购信息
     */
    queryTGList: function () {
        let _this = this;
        let sellType = 1;
        _this.$wuxLoading.show({text: '数据加载中',});
        sellType = (_this.data.sellList != null && _this.data.sellList.length > 0)
            ? _this.data.sellList[_this.data.num].sellType : 1;
        //console.log("sellType--"+sellType);
        let data = {
            "merchantId": _this.data.merchant.merchantId,//店铺id
            "start": _this.data.start,     //分页开始页  必填
            "limit": _this.data.limit,    //当前页共显示多少条  必填
            "userId": _this.data.userInfo.id,// 用于查询previewFlag为-1时，则可以预览新添的团品信息
            "sellType": sellType, // 销售类型被选中，默认为1
            "longitude": _this.data.longitude,//经度
            "latitude": _this.data.latitude,//纬度
            "mlongitude": _this.data.merchant.mlongitude,//经度
            "mlatitude": _this.data.merchant.mlatitude,//纬度
        }
        util.request(api.QueryTGNewList, data, "POST").then(function (res) {
            _this.$wuxLoading.hide(); //隐藏加载动画
            if (res.data) {
              var goodsList = res.data.list;
              //console.log("goodsList------" + JSON.stringify(goodsList));
              if (goodsList != null && goodsList.length > 0) {
                goodsList.forEach(o => {
                  o.number = 0;
                });

                var _arr = cart.loadCart();//购物车商品
                //console.log("cart goods ---" + JSON.stringify(_arr));
                if (null != _arr && _arr.length > 0) {
                  var len = _arr.length;
                  for (var i = 0; i < len; i++) {
                    var gid = _arr[i].sid;
                    goodsList.forEach(o => {
                      if (o.id == gid) {
                        o.number = _arr[i].number;
                      }
                    });
                  }
                }

              }
              if (_this.data.start == 1) { // 下拉刷新
                _this.setData({
                  goodsList: goodsList,
                  hideHeader: true,
                  totalPage: res.data.totalPage,
                })
              } else {
                var tempArray = _this.data.goodsList;
                var list =  _this.fliterItems(goodsList, tempArray);
                if (tempArray != null && list.length > 0) {
                  tempArray = tempArray.concat(list);
                }
                _this.setData({
                  goodsList: tempArray,
                  totalPage: res.data.totalPage,
                })
              }
              _this.refreshCartRef();
            }
           
        })

    },
    /***
     * 过滤重复
     */
    fliterItems: function(_list, _list_) {
        var list = [];
        if(_list) {
          if(_list_) {
            _list.forEach(item => {
              var isIn = false;
              _list_.forEach(ol => {
                if(item.id == ol.id) {
                  isIn = true;
                }
              });
              if(!isIn){
                list.push(item);
              }
            });
          }else {
            list = _list;
          }
        }
        return list;
    },
  
    //选择团长，打开modal
    choiceMerchant() {
        let _this = this;
        this.setData({
            tmpCurrentIndex: _this.data.currentIndex,
            showModal: true,
            searchText: '', // 搜索店铺名称、地址
        })
        this.queryMerchats();
    },
    closeModal: function () {
        this.setData({
            merchantSelected: {}, //清空临时
            showModal: false,
            tmpCurrentIndex: 0,
        })
    },
    modalConfirm: function () {
        let _this = this;
        //刷新和重置数据
        _this.setData({
            start: 1, // 页码
            totalPage: 0, // 共有页
            goodsList: [],//团购商品列表
            cartGoodsList: [],//购物车商品列表
            needPay: 0.00, // 购物车核算价格
            goodsNums: 0, //商品数量
            num: 0,//和index相比，控制左侧显示激活状态样式
            showModal: false,
            merchant: _this.data.merchantSelected,
            currentIndex: _this.data.tmpCurrentIndex,
            loadMoreData: '上滑加载更多'
        });

        //将选中的商户写入缓存
        wx.setStorageSync(currentMerchat, _this.data.merchant);
        wx.setStorageSync(currIndex, _this.data.currentIndex);
        cart.cleanCart2();
        _this.queryTGList();

    },
    //选中商户
    clickMerchant(e) {
        let _this = this;
        let id = e.currentTarget.dataset.id,
            index = e.currentTarget.dataset.index
        _this.setData({
            tmpCurrentIndex: index,
        })
       // console.log("clickMerchant id -- " + id);
        var merchantList = _this.data.merchantList;
        var merchant = {};
        if (null != merchantList) {
            merchantList.forEach(o => {
                if (o.merchantId == id) {
                    merchant = o;
                }
            });
            _this.setData({
                merchantSelected: merchant
            })
        }
    },
    //导航跳转
    navTo: function (e) {
        var url = e.currentTarget.dataset.url;
        if (url == "null" || url == null || url == "") {
            return;
        }
        //跳转TabBar路径
        if (e.currentTarget.dataset.way == 1) {
            wx.switchTab({
                url: e.currentTarget.dataset.url
            });
        } else {
            wx.navigateTo({
                url: "/pages/thirdPage/thirdPage?url=" + url,
            })
        }
    },
    //刷新购物车相关
    refreshCartRef: function () {

        let _this = this;

        var _arr = cart.loadCart();//购物车商品
        var cartselfGoodsList = [];
        var cartmerchatGoodsList = [];
        var cartcouponGoodsList = [];
        var cartb2cGoodsList = [];

        var cartselfGoodsListTmp = [];
        var cartmerchatGoodsListTmp = [];
        var cartcouponGoodsListTmp = [];
        var cartb2cGoodsListTmp = [];
        console.log("cart goods ---" + JSON.stringify(_arr));
        if (null != _arr && _arr.length > 0) {
            var len = _arr.length;
            for (var i = 0; i < len; i++) {
                var productType = _arr[i].productType;
                if (productType == 1) {
                  cartmerchatGoodsListTmp.push(_arr[i]);
                } else if (productType == 3) {
                  cartselfGoodsListTmp.push(_arr[i]);
                } else if (productType == 5) {
                  cartcouponGoodsListTmp.push(_arr[i]);
                } else if(productType == 6) {
                  cartb2cGoodsListTmp.push(_arr[i]);
                }
            }
        }
     
        _this.setData({
            needPay: cart.loadPrice().toFixed(2), // 购物车核算价格
            goodsNums: cart.loadGooodsNums(), //商品数量
            cartselfGoodsList: _this.createCartInfo(cartselfGoodsListTmp,cartselfGoodsList),//购物车自营商品列表
            cartmerchatGoodsList: _this.createCartInfo(cartmerchatGoodsListTmp,cartmerchatGoodsList),//购物车团购商品列表
            cartcouponGoodsList: _this.createCartInfo(cartcouponGoodsListTmp,cartcouponGoodsList), //优惠券列表
            cartb2cGoodsList: _this.createCartInfo(cartb2cGoodsListTmp, cartb2cGoodsList),
        });
    },
    //组装购物车信息
    createCartInfo:function(tmpList, cartList) {
      let _this = this;
      if (tmpList) {
        tmpList.forEach(goods => {
          cartList = _this.checkAndFill(goods, cartList);
        })
      }
      return cartList;
    },
    //检查和填充
    checkAndFill:function(item , cartList) {
      var obj = {
        merchantId: item.merchantId,
        merchantName: item.merchantName,
      };
      if(cartList.length > 0) {
        var inCar = false;
        cartList.forEach(o => {
           if(o.merchantId == item.merchantId) {
             var list = o.list;
             list.push(item);
             obj.list = list;
             inCar = true;
           }
        });
        if (!inCar){
          var list = [];
          list.push(item);
          obj.list = list;
          cartList.push(obj);
        }
      }else {
        var list = [];
        list.push(item);
        obj.list = list;
        cartList.push(obj);
      }
     
      return cartList;
    },
    //减
    cutNumber: function (e) {
        let _this = this;
        var sid = e.currentTarget.dataset.sid;
        var type = e.currentTarget.dataset.type;
        var id = cart.appendPrefix(type,sid);
        console.log("cutNumber ======= id: " + id);
        var goodsList = _this.data.goodsList;
        if (goodsList != null && goodsList.length > 0) {
            goodsList.forEach(o => {
                if (o.id == sid) {
                    o.number = o.number - 1;
                    if (o.number < 0) {
                        o.number = 0;
                    }
                }
            });
        }
        var g = cart.loadCartGoods(id);
        if (g != null) {//如果购物车以前有则更新
            g.sid = sid;
            g.number = (g.number - 1);
            if (g.number <= 0) {
                cart.removeCart(id);
            } else {
                cart.updateCart(g);
            }
        }

        _this.setData({
            goodsList: goodsList,
        });
        _this.refreshCartRef();
    },
    //检查商户和商品关系
    checkRel: function (id) {
        let _this = this;
        let rel = true;
        console.log("checkRel---------------" + id);
        mt.checkMerchantGoodsRel(_this.data.merchant.merchantId, id).then(function (res) {
            if (res.rs == 1) {
                rel = res.data.isRel;
                if (!rel) { //如果不一致切换商户
                    var data = {
                        merchantId: _this.data.merchant.merchantId,
                        goodsId: id
                    };
                    log.collectLog(0, "首页-商品信息对应", "groupPurchase/verifyRelation", JSON.stringify(data), JSON.stringify(res), "", _this.data.userInfo.id);
                    wx.redirectTo({
                        url: '/pages/auth/login/login',
                    })
                }
            }
        });

        return rel;
    },
    //加
    addNumber: function (e) {
        let _this = this;
        var sid = e.currentTarget.dataset.sid;
        var type = e.currentTarget.dataset.type;
        var id = cart.appendPrefix(type, sid);
        console.log("addNumber-----------------" + id);
        if(6 == type) {
          var g = cart.loadCartGoods(id);
          //console.log("购物无车商品---" + JSON.stringify(g));
          var number = g.number + 1;
          if (g.limitNum) {
            if ((g.joinNum + number) > g.limitNum) {
              wx.showToast({
                icon: "none",
                title: '已超过库存!',
              })
              return;
            }
          }
            
          if (null != g.buyLimitNum &&
            0 != g.buyLimitNum &&  number > g.buyLimitNum) {
            wx.showToast({
              icon: "none",
              title: '此商品每人只能买' + g.buyLimitNum + "份",
            })
            return;
          }
          g.number = g.number + 1;
          g.sid = sid;
          cart.updateCart(g);
        }else {
          var list = _this.data.goodsList;
          if (list != null && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
              if (list[i].id === sid) {
                var goods = list[i];
                var g = cart.loadCartGoods(id);
                //console.log("购物无车商品---" + JSON.stringify(g));
                if (g == null && goods != null) {//如果没有则加入购物车
                  if (goods.productType != 5 && !_this.checkRel(sid)) {
                    return;
                  }
                  if ((goods.joinNum + 1) > goods.limitNum) {
                    wx.showToast({
                      icon: "none",
                      title: '已超过库存!',
                    })
                    return;
                  } else {
                    goods.number = 1;
                  }
                  
                  goods.sid = sid;
                  goods.id = id;
                  cart.add2Cart(goods);
                  goods.id = sid;
                } else {//如果购物车以前有则更新购物车商品数量
                  if (g.productType != 5 && !_this.checkRel(sid)) {
                    return;
                  }
                  g.number = g.number + 1;
                  if ((goods.joinNum + g.number) > goods.limitNum) {
                    wx.showToast({
                      icon: "none",
                      title: '已超过库存!',
                    })
                    return;
                  }
                  if (null != goods.buyLimitNum &&
                    0 != goods.buyLimitNum && g.number > goods.buyLimitNum) {
                    wx.showToast({
                      icon: "none",
                      title: '此商品每人只能买' + goods.buyLimitNum + "份",
                    })
                    return;
                  }
                  goods.number = goods.number + 1;
                  g.sid = sid;
                  cart.updateCart(g);
                }

              }
            }
          }
          _this.setData({
            goodsList: list,
          });
        }
        
        _this.refreshCartRef();
    },
    ///清除购物车商品
    clearCart: function () {
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
    openshopCar: function () {
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
    hideshopCar: function () {
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
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                shopCarStatus: false,
            })
        }.bind(this), 200)
    },
    //去订单确认页
    toOrderConfirm: function () {
        let _this = this;
        if (_this.data.goodsNums <= 0) {
            return;
        }
        wx.navigateTo({
            url: '/pages/orderConfirm/orderConfirm?type=0'
        });
    },
    //跳转分类商品类别页
    goCateGrory: function (e) {
        let _this = this;
        var type = e.currentTarget.dataset.type;
        wx.navigateTo({
            url: '/pages/category/goodsList?classify=' + type,
        });
    },
    bindSearchText: function (e) {
        var _this = this;
        this.setData({
            searchText: e.detail.value,
        })
        _this.queryMerchats();
    },
    //查询商户列表信息
    queryMerchats: function () {
        let that = this;
        var data = {
            "longitude": that.data.longitude,//经度
            "latitude": that.data.latitude,//纬度
            "searchText": that.data.searchText,
        };
        util.request(api.QueryMerchants, data, "POST").then(function (res) {
            if (res.rs === 1) {
                var merchantList = res.data;
                that.setData({
                    merchantList: merchantList,
                })

            }
        });
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

            this.setData({treasures: list})
        }
        // 渲染，然后每隔一秒执行一次倒计时函数
        setTimeout(this.countDown, 1000);
    }
})
