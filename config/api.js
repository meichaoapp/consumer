//var NewApiRootUrl = 'http://localhost:8080/api/';
//var NewApiRootUrl = 'https://wxapp.iliangpin.cn/api/';
//var NewApiRootUrl = "http://101.201.213.248:8093/api/";
//var NewApiRootUrl = "https://wxapp.iliangpin.cn/api/";
var NewApiRootUrl = "https://wxapp.galaxyxd.cn/api/";
module.exports = {
  WXLogin: NewApiRootUrl + 'consumer/user/login',//微信登录（新）
  QueryUserInfo: NewApiRootUrl + 'consumer/info',//获取个人资料
  SubmitUserInfo: NewApiRootUrl + 'consumer/editInfo',//添加/修改个人资料

  QueryMerchants: NewApiRootUrl + 'groupPurchase/merchants',//查询附近商户信息（新）

  QueryClassifys: NewApiRootUrl + "index/classifys",
  QueryClassifyList: NewApiRootUrl +  "index/classifyList",
   //new index query api
  QueryIndexInfo: NewApiRootUrl + 'index/info',//查询首页信息（新）
  QueryIndexTreasures: NewApiRootUrl + 'index/treasures',//查询首页信息（新）
  QueryTGNewList: NewApiRootUrl + 'index/list', ///获取团购分类和商品信息（新）


  QueryGroupPurchaseGoodsDetail: NewApiRootUrl + 'groupPurchase/details', ///获取团购详情信息
  CheckMerchantGoodsRel: NewApiRootUrl + 'groupPurchase/verifyRelation', 

  CreateOrderNew: NewApiRootUrl + 'groupPurchase/createOrder', ///参团（首页+详情页）返回订单信息（新）
  
  FirmOrder: NewApiRootUrl + 'groupPurchase/firmOrder', ///参团（首页+详情页）确认订单信息
  Friends: NewApiRootUrl + "groupPurchase/friends",//参团好友

  QueryOrderList: NewApiRootUrl + "groupPurchase/orderList",//获取参团信息（我的参团）
  QueryOrderDetail: NewApiRootUrl + "groupPurchase/orderDetail",//获取参团详情（我的参团-兑现)

  QueryTreasureList: NewApiRootUrl + "treasure/list",//获取一元夺宝列表信息
  QueryWinList: NewApiRootUrl + "treasure/winList",//中奖信息
  QueryTreasureDetails: NewApiRootUrl + "treasure/details",//获取一元夺宝详情信息
  QueryMyTreasures: NewApiRootUrl + "treasure/myTreasures",//获取我的一元夺宝列表信息
  JoinTreasure: NewApiRootUrl + "treasure/join",//夺宝
  JoinBack: NewApiRootUrl + "treasure/joinBack",//夺宝
  JoinHistories: NewApiRootUrl + "treasure/joinHistories",//夺宝
  Desire: NewApiRootUrl + "common/desire",//我想要（我想要页）
  Partner: NewApiRootUrl + "common/partner", //成为伙伴（成为伙伴页）
  Pay: NewApiRootUrl + "common/pay", ///支付
  GetVerifiCode: NewApiRootUrl + "common/sendMsg", //短信验证码
  QueryGifts: NewApiRootUrl + "common/getgifts",//获取流量超市优惠券
  CollectLogs: NewApiRootUrl + "common/logCollection",//日志采集

  ///绑定手机号相关
  BindMobile: NewApiRootUrl + "common/savePhone",//绑定手机号
  PareseMobile: NewApiRootUrl + "consumer/getPhoneNumber",//绑定手机号
  PareseMobile: NewApiRootUrl + "consumer/getPhoneNumber",//绑定手机号

  ///优惠券相关 
  QueryMyCouponList: NewApiRootUrl + "discountCoupon/mylist",//我的优惠券列表
  QueryCouponDetail: NewApiRootUrl + "discountCoupon/myDetail",//我的优惠券详情
  QueryCouponDetails: NewApiRootUrl + "discountCoupon/detail",//优惠券详情

  ///电商相关
  QueryShopTypes: NewApiRootUrl + "common/getShopTypes",//获取电商类型列表信息
  QueryShopList: NewApiRootUrl + "shop/list",//获取电商列表信息
  QueryShopDetail: NewApiRootUrl + "shop/detail",//获取电商详情信息
  LoadSpecs: NewApiRootUrl + "shop/specificationChoose",//获取电商详情规格信息

  //电商订单
  QueryShopOrderList: NewApiRootUrl + "shop/myList",//获取电商类型列表信息
  QueryShopOrderDetail: NewApiRootUrl + "shop/myDetail",//获取电商订单详情信息
  ConfirmReceive: NewApiRootUrl + "shop/confirmReceive",//确认收货

  ///消息相关 
  QueryMessageList: NewApiRootUrl + "common/chat/messageMerchantList",//消息列表
  QueryMessageHistory: NewApiRootUrl + "common/chat/myMessageContent",//我的优惠券详情
  SendMessage: NewApiRootUrl + "common/chat/submitMessageContent",//优惠券详情

  ///物流信息相关
  QueryLogistics: NewApiRootUrl + "common/kuaidi100Query",//获取物流信息（快递100）

  ///订单确认
  LoadCartOrder: NewApiRootUrl + "order/cartOrder",//生成订单信息
  CreateOrder: NewApiRootUrl + "order/createOrder",//创建订单
  
};