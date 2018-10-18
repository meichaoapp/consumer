var NewApiRootUrl = 'http://localhost:8080/api/';
var NewApiRootUrl = "https://wxapp.galaxyxd.com/api/";
module.exports = {
  WXLogin: NewApiRootUrl + 'consumer/user/login',//微信登录

  QueryMerchants: NewApiRootUrl + 'index/merchants',//查询附近商户信息
  QueryBanner: NewApiRootUrl + 'index/banners',//查询轮播图
  QueryTGList: NewApiRootUrl + 'index/list', ///获取团购信息

  QueryGroupPurchaseDetail: NewApiRootUrl + 'groupPurchase/details', ///获取团购详情信息
  CreateOrder: NewApiRootUrl + 'groupPurchase/createOrder', ///参团（首页+详情页）返回订单信息
  FirmOrder: NewApiRootUrl + 'groupPurchase/firmOrder', ///参团（首页+详情页）确认订单信息
  Friends: NewApiRootUrl + "groupPurchase/friends",//参团好友

  QueryOrderList: NewApiRootUrl + "groupPurchase/orderList",//获取参团信息（我的参团）
  QueryOrderDetail: NewApiRootUrl + "groupPurchase/orderDetail",//获取参团详情（我的参团-兑现)

  QueryTreasureList: NewApiRootUrl + "treasure/list",//获取一元夺宝列表信息
  QueryWinList: NewApiRootUrl + "treasure/winList",//中奖信息
  QueryTreasureDetails: NewApiRootUrl + "treasure/details",//获取一元夺宝详情信息
  QueryMyTreasures: NewApiRootUrl + "treasure/myTreasures",//获取我的一元夺宝列表信息
  JoinTreasure: NewApiRootUrl + "treasure/join",//夺宝


  Desire: NewApiRootUrl + "common/desire",//我想要（我想要页）
  Partner: NewApiRootUrl + "common/partner", //成为伙伴（成为伙伴页）
  Pay: NewApiRootUrl + "common/pay", ///支付

    


};