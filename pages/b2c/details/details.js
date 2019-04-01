var app = getApp();
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const cart = require('../../../services/cart.js');
var WxParse = require('../../../lib/wxParse/wxParse.js');
const buyGoodsCache = "buyGoodsCache";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        basePath: app.globalData._base_path, //基础路径
        id:0,
        detail: {}, //商品详情
        merchant:{}, // 店铺信息
        buyNums:1, //购买数量
        buyBtnType:0, // 点击按钮类型 0 未点击 1 购物车 2 直接购买
        specDetails:{}, //规格面板数据
        specs:[], //选中规格信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
        _this.setData({
          id: options.id,
        });
        this.queryShopDetail();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

  /**
* 进入具体店铺
*/
  toShop: function () {
    let _this = this;
    wx.navigateTo({
      url: '/pages/b2c/shopIndex/shopIndex?mid=' + _this.data.merchant.merchantId,
    })
  },
   
    /**
     * 去客服聊天界面
     */
    toCustomerServiceBox:function() {
      let _this = this;
      wx.navigateTo({
        url: '/pages/b2c/customerService/customerService?mid=' + _this.data.merchant.merchantId,
      })
    },

    /**
     * 去电商首页
     */
    toIndex:function() {
      wx.redirectTo({
        url: '/pages/b2c/index/index',
      })
    },

    /**
     * 查询详情
     */
    queryShopDetail : function() {
        let that = this;
        util.request(api.QueryShopDetail, {id: that.data.id}, "POST").then(function (res) {
            if (res.rs == 1) {
                var data = res.data;
                let detail = data.detail;
                var  specifications = [
                  {
                      spec: "颜色分类",
                      details: ["黑色","深灰色"]
                  }
                ];
                detail.specifications = specifications;   
                that.setData({
                    detail:detail,
                    merchant: data.merchant, // 店铺信息
                })
               WxParse.wxParse('goodsDetail', 'html', res.data.detail.content, that);
            }
        });
    },

    //打开规格弹窗
    openSpecsBox: function () {
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
            specsStatus: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    hideSpecsBox: function () {
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
                specsStatus: false,
            })
        }.bind(this), 200)
    },

  /**
   * 购买数量减
   */
  cutNumber:function() {
    let _this = this;
    var buyNums = _this.data.buyNums  - 1;
    if(buyNums < 1) { buyNums = 1;}
    _this.setData({
      buyNums:buyNums,
    });
  },

  /**
   * 购买数量加
   */
  addNumber:function() {
    let _this = this;
    var buyNums = _this.data.buyNums + 1;
    var specDetails = _this.data.specDetails;
    if (null == specDetails.joinNum) {
      specDetails.joinNum = 0;
    }
    if (specDetails.buyLimitNum) {
      if (specDetails.joinNum + buyNums > specDetails.buyLimitNum){
        wx.showToast({
          icon:'none',
          title: '此商品此规格下限买' + specDetails.buyLimitNum+ "份",
        });
        return;
      }
    }
    if (specDetails.limitNum){
      if (specDetails.joinNum + buyNums > specDetails.limitNum) {
        wx.showToast({
          icon: 'none',
          title: '库存不足~',
        });
        return;
      }
    }
    _this.setData({
      buyNums: buyNums,
    });
  } ,

  /**
   * 记录点击类型
   */
  clickBuy:function(e) {
    let _this = this;
    let type = e.currentTarget.dataset.type;
    _this.setData({
      buyBtnType: type,
    });
    _this.getSpecs();
  },

  //获取规格面板数据
  getSpecs:function (e) {
    let _this = this;  
    //请求规格数据
    var data = {
      id: _this.data.detail.id,
      specs: _this.data.specs,
    };
    // util.request(api.LoadSpecs, data , "POST").then(function (res) {
    //   if (res.rs == 1) {
    //     var data = res.data;
    //     _this.setData({
    //       specDetails: specDetails,
    //     })
    //   }
    // });
    var specDetails = {
      id: 1, // 通过规格计算出来的id
      url: "https://meichaooss1.oss-cn-beijing.aliyuncs.com/shop/2019-03-30/1553952086045.jpg",
      buyLimitNum: null, // 限制
      joinNum: null, // 已销售
      limitNum: 3, // 库存 
      originalPrice: 99, // 原价 
      price: 59, // 现价
      specificationsTypes: "颜色分类 尺码分类",
      purchasable: 0, // 是否有库存 0有 1无
      specifications: [
        {
          spec: "颜色分类",
          details: [
            {
              value: "黑色",
              selected: 1, // 否 0 是 1
              isAble: 0, // 是 0 否 1
            },
            {
              value: "红色",
              selected: 0, // 否 0 是 1
              isAble: 0, // 是 0 否 1
            },
            {
              value: "紫色",
              selected: 0, // 否 0 是 1
              isAble: 0, // 是 0 否 1
            }
          ]
        },
        {
          spec: "尺码分类",
          details: [
            {
              value: "M",
              selected: 1, // 否 0 是 1
              isAble: 0, // 是 0 否 1
            },
            {
              value: "XL",
              selected: 0, // 否 0 是 1
              isAble: 1, // 是 0 否 1
            },
            {
              value: "XXL",
              selected: 0, // 否 0 是 1
              isAble: 0, // 是 0 否 1
            }
          ],
        },
      ]
    };
    _this.setData({
      specDetails: specDetails,
    })
    //打开规格选择
    if (!_this.data.specsStatus) {
      _this.openSpecsBox();
    }
   
  },
  
  /**
   * 点击规格
   */
  clickSpec: function(e) {
      let _this = this;
      let s = e.currentTarget.dataset.s;
      let v = e.currentTarget.dataset.v;
      console.log("clickSpec------------- s= " + s + "  v=" + v );
      var specDetails = _this.data.specDetails;
      if (specDetails) {
        var specifications = specDetails.specifications;
        specifications.forEach(sp => {
          if (sp.spec === s){
            var details = sp.details;
            details.forEach(d => {
              if(v == d.value){
                d.selected = 1;
              }else {
                d.selected = 0;
              }
            });
          }
        });
        _this.setData({
          specDetails: specDetails
        });
        _this.getSelectedSpec();
      }
      _this.getSpecs();
  },

  /**
   * 获取选中态
   */
  getSelectedSpec: function() {
    let _this = this;
    var specs = [];
    var specDetails = _this.data.specDetails;
    specDetails.specifications.forEach(sp => {
      var details = sp.details;
      details.forEach(d => {
        if (1 == d.selected) {
          var item = {
            key: sp.spec,
            value: d.value,
          };
          specs.push(item);
        }
      });
    });
    console.log("getSelectedSpec-----------" + JSON.stringify(specs));
    _this.setData({
      specs: specs
    });
  },

  /**
   * 确定选择规格
   */
  sureSpec:function() {
   let _this = this;
    _this.hideSpecsBox();
    var type = _this.data.buyBtnType;
    if(type == 1) {
      _this.addCart();
    }else{
      _this.toOrderConfirm();
    }
  },

  addCart: function () {
    let _this = this;
    var specDetails = _this.data.specDetails;
    _this.getSelectedSpec();
    var specsStr = "";
    var specs = _this.data.specs;
    if (specs) {
      specs.forEach(sp => {
        specsStr += sp.key + ":" + sp.value + " ";
      })
    }
    var goods = {
      "id": specDetails.id, //id
      "name": _this.data.detail.name, //团购名称
      "url": specDetails.url, //展示url
      "price": specDetails.price, //团购价
      "marketPrice": specDetails.originalPrice,//市场价/原价
      "status": _this.data.detail.status, //0 未开始 1 进行中 2 已成团 3 已过期
      "productType": _this.data.detail.productType, //商品类型 1.普通团品 2. 一元购 3. 店长自营产品
      "limitNum": specDetails.limitNum, //参团人数上限
      "joinNum": specDetails.joinNum, //参团人数
      "buyLimitNum": specDetails.buyLimitNum, // 单品购买限制
      "merchantId": _this.data.merchant.merchantId,
      "merchantName": _this.data.merchant.merchantName,
      "b2cId": _this.data.detail.id,
      "specs": _this.data.specs,
      "specsStr": specsStr,
      //"address": _this.data.merchant.address,
      //"merchantPhone": _this.data.merchant.merchantPhone,
    };

    var g = cart.loadCartGoods(goods.id);
    console.log("购物车商品---" + JSON.stringify(g));
    if (g == null) {//如果没有则加入购物车
      goods.number = 1;
      cart.add2Cart(goods);
    } else {//如果购物车以前有则更新购物车商品数量
      g.number = _this.data.buyNums;
      cart.updateCart(g);
    }
    wx.showToast({
      title: '添加购物车成功!',
    })
  },

  //去订单确认页
  toOrderConfirm: function () {
    let _this = this;
    var specDetails = _this.data.specDetails;
    _this.getSelectedSpec();
    var specsStr = "";
    var specs = _this.data.specs;
    if (specs){
      specs.forEach(sp => {
        specsStr += sp.key + ":" + sp.value + " ";
      })
    }
    var goods = {
      "id": specDetails.id, //id
      "name": _this.data.detail.name, //团购名称
      "url": specDetails.url, //展示url
      "price": specDetails.price, //团购价
      "marketPrice": specDetails.originalPrice,//市场价/原价
      "status": _this.data.detail.status, //0 未开始 1 进行中 2 已成团 3 已过期
      "productType": _this.data.detail.productType, //商品类型 1.普通团品 2. 一元购 3. 店长自营产品
      "limitNum": specDetails.limitNum, //参团人数上限
      "joinNum": specDetails.joinNum, //参团人数
      "buyLimitNum": specDetails.buyLimitNum, // 单品购买限制
      "merchantId": _this.data.merchant.merchantId,
      "merchantName": _this.data.merchant.merchantName,
      "b2cId": _this.data.detail.id,
      "specs": _this.data.specs,
      "specsStr": specsStr,
    };
    var goodsList = [];
    goodsList.push(goods);
    wx.setStorageSync(buyGoodsCache, goodsList);
    wx.navigateTo({
      url: '/pages/orderConfirm/orderConfirm?type=1'
    });
  },

})