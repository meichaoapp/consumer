var api = require('../config/api.js');

const RS = {
  "rs": 1,
  "info": null,
  "data": {
  }
};

function getData(url, p) {
  if (undefined != p && p != null) {
    console.log("参数为：" + JSON.stringify(p));
  }

  RS.data = {}


  //微信登录
  if (url == api.WXLogin) {
    return wxLogin();
  }
  //-----------------------首页
  //查询banner
  if (url == api.QueryBanner) {
    return QueryBanner();
  }
  //获取团购信息
  if (url == api.QueryTGList) {
    return QueryTGList();
  }

  //-----------------------详情页
  ///获取团购详情信息
  if (url == api.QueryGroupPurchaseDetail){
    return QueryGroupPurchaseDetail();
  }
  ///参团（首页+详情页）返回订单信息
  if (url == api.CreateOrder){
    return CreateOrder();
  }
  //确认订单
  if (url == api.FirmOrder){
    return JSON.stringify(RS);
  }
  //参团好友
  if (url == api.Friends){
    return Friends();
  }

  //--------------------我想要（我想要页）
  //我想要（我想要页）
  if (url == api.Desire) {
    return JSON.stringify(RS);
  }

  //--------------------成为伙伴（成为伙伴页）
  if (url == api.Partner) {
    return JSON.stringify(RS);
  }


  //-------------------获取参团信息（我的参团）
  if (url == api.QueryOrderList) {
    return QueryOrderList();
  }
  //获取参团详情（我的参团-兑现)
  if (url == api.QueryOrderDetail) {
    return QueryOrderDetail();
  }


  //------------------一元夺宝页
  //获取一元夺宝列表信息
  if (url == api.QueryTreasureList) {
    return QueryTreasureList();
  }

  //.获取一元夺宝中奖信息
  if (url == api.QueryWinList) {
    return QueryWinList();
  }

  //获取一元夺宝详情信息
  if (url == api.QueryTreasureDetails) {
    return QueryTreasureDetails();
  }
  //获取我的一元夺宝列表信息
  if (url == api.QueryMyTreasures) {
    return QueryMyTreasures();
  }
  //夺宝
  if (url == api.JoinTreasure) {
    return JSON.stringify(RS);
  }

  if (url == api.JoinBack) {
    RS.data.code = "4545772";
    RS.data.lotteryTime = "2018/10/30 00:00:00";
    return JSON.stringify(RS);
  }

  
  
  //支付
  if(url == api.Pay){
    return JSON.stringify(RS);
  }
  


}

//微信登录
function wxLogin() {
  var user = {
    "id": 1,  //id	
    "name": "茉莉花开",	   //客户名称
    "nickName": "茉莉花开",	      //微信昵称
    "openid": "P90FDeUdnFMZkwZ274fEWnWqE",        // openid
    "sex": 0,        // 性别 0 男 1 女
    "avatar": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/user.png" //头像	
  }


  RS.data.user = user;
  RS.data.token = "773b8bde7ed698bc2cc2227d5c765704";
  return JSON.stringify(RS);

}

//获取团购信息
function QueryTGList() {
  var list = [
    {
      "id": 1,  //id	
      "merchantId": 1,  //商户ID	
      "merchantName": "我是一只熊",
      "name": "快乐的蛋 出厂价团 只为宣传",	   //团购名称
      "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png",	   //展示url
      "price": "15元", //团购价
      "status": 0, //0 未开始 1 进行中 2 已成团 3 已过期
      "comments": "可以生吃有身份的蛋", //简述
      "limitNum": 99, //参团人数上限
      "joinNum": 90, //参团人数
      "startTime": "2018/10/05 00:00:00", //开始时间，注意格式
      "endTime": "2018/10/20 00:00:00", //结束时间，注意格式
    },
    {
      "id": 2,  //id	
      "merchantId": 1,  //商户ID	
      "merchantName": "快乐山鸡",
      "name": "精品羊排 新鲜出厂当日送达",	   //团购名称
      "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g2.png",	   //展示url
      "price": "15元", //团购价
      "status": 0, //0 未开始 1 进行中 2 已成团 3 已过期
      "comments": "草原宏宝蒙巴克 无公害谷饲羔羊", //简述
      "limitNum": 99, //参团人数上限
      "joinNum": 12, //参团人数
      "startTime": "2018/09/16 00:00:00", //开始时间，注意格式
      "endTime": "2018/09/18 23:00:00", //结束时间，注意格式
    },
  ];

  RS.data.list = list;
  RS.data.totalPage = 2;
  return JSON.stringify(RS);
}

//查询banner
function QueryBanner() {
  var banners = [
    {
      "id": 1,  //id	
      "name": "轮播图2",	   //轮播图名称
      "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/b1.png",	   //url
      "target": "" //跳转地址
    },
    {
      "id": 2,  //id	
      "name": "轮播图1",	   //轮播图名称
      "url": "https://gw.alicdn.com/tfs/TB1dHNDXMHqK1RjSZFEXXcGMXXa-750-291.jpg_Q90.jpg",	   //url
      "target": "" //跳转地址
    },
    
  ];
  RS.data.banners = banners;

  return JSON.stringify(RS);
}

///获取团购详情信息
function QueryGroupPurchaseDetail() {
  var data = {
    "detail": {
      "id": 1,  //id	
      "pics": [
        "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g3.png",
        "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g3.png",
      ],  //商品展示图片
      "title": "精品羊排 新鲜出厂当日即达",	   //团购名称
      "status": 0, //0 未开始 1 进行中 2 已成团 3 已过期
      "comments": "可以生吃的有身份的鸡蛋", //宣传语
      "content": "高山果林放养土鸡蛋（包含土鸡、鸭），通过山林农家 放养，喝山泉水，无污染，吃生态虫草。目前主要客户 群为孕妇、医院病人、小孩0", //描述
      "limitNum": 99, //参团人数上限
      "startTime": "2018/10/05 00:00:00", //开始时间，注意格式
      "endTime": "2018/10/18 00:00:00", //结束时间，注意格式
      "joinNum": 9, //参团人数
    },
    "merchant": {
      "merchantId": 1,  //商户ID
      "merchantName": "生源鲜果超市",//团购商超
      "merchantUserName": "张三",//团购商超负责人
      "merchantPhone": "010-3574787887",//团购商超电话
      "logo": "",//团购logo
      "avatar": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/user.png" 
    },
    "goodsList": [
      {
        "id": 1, // 商品id
        "url": "/static/images/TB1baFLaOrpK1RjSZFhXXXSdXXa_!!0-item_pic.jpg_250x250.jpg",//展示图片
        "name": "细嫩多汁蜜蜂21.5C绿心奇异果",//名称
        "specifications": "整箱20个",//规格
        "marketPrice": 11.05,//市场价
        "price": 10.05,//单价
        "stock": 100,//库存
      },
      {
        "id": 2, // 商品id
        "url": "/static/images/TB1baFLaOrpK1RjSZFhXXXSdXXa_!!0-item_pic.jpg_250x250.jpg",//展示图片
        "name": "精品羊排 新鲜出厂当日即达",//名称
        "specifications": "整箱20个",//规格
        "marketPrice": 19.05,//市场价
        "price": 10.05,//单价
        "stock": 100,//库存
      }
    ]
  }

  RS.data = data;
  return JSON.stringify(RS);
}
///参团（首页+详情页）返回订单信息
function CreateOrder(){

  var data = {
    "id": 1,  //订单id	  
    "status": 0, // 订单状态 0 待支付 1 已支付 2 待领取 3 已完成 4 放弃 5 退货
    "totalPay": 100.05,//共付
    "needPay": 100.05,// 应付
    "groupPurchase": {
      "id": 1,  //id	
      "merchantId": 1,  //商户ID	
      "merchantName": "美超团长",  //商户名称（团长）
      "name": "精品羊排 新鲜出厂当日即达",	   //团购名称
      "url": "https://yanxuan.nosdn.127.net/dab1e16fb89680657a4a70341ee0ee9c.jpg?imageView&quality=95&thumbnail=60x60",	   //展示url
      "status":0, //0 未开始 1 进行中 2 已成团 3 已过期
      "comments": "", //简述
    }, //团购信息

    "merchant": {
      "merchantId": 1,  //商户ID
      "merchantName": "团购商超",//团购商超
      "merchantUserName": "张三",//团购商超负责人
      "merchantPhone": "010-3574787887",//团购商超电话
      "avatar": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/user.png", //头像
      
    }, //团长信息

    "goodsList": [
      {
        "id": 1, // 商品id
        "url": "",//展示图片
        "name": "",//名称
        "specifications": "整箱20个",//规格
        "marketPrice": 19.05,//市场价
        "price": 10.05,//单价
        "buyNum": 100,//购买数量
      }
    ]//商品清单
  }
  RS.data = data;
  return JSON.stringify(RS);
}
//参团好友
function Friends(){
  var data = {
    "joinNum": 90, //参团人数
    "list": [
      {
        "id":1,  //id	
        "name":"wangwang",	   //客户名称
        "nickName": "王晓从新",	      //微信昵称
        "openid":"P90FDeUdnFMZkwZ274fEWnWqE",        // openid
        "avatar": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/user.png" 
      },
      {
        "id": 1,  //id	
        "name": "好运连连",	   //客户名称
        "nickName": "好运连连",	      //微信昵称
        "openid": "P90FDeUdnFMZkwZ274fEWnWqE",        // openid
        "avatar": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/user.png" 
      },
      {
        "id": 1,  //id	
        "name": "花开富贵",	   //客户名称
        "nickName": "花开富贵",	      //微信昵称
        "openid": "P90FDeUdnFMZkwZ274fEWnWqE",        // openid
        "avatar": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/user.png" 	
      }
    ]
  }

  RS.data = data;
  return JSON.stringify(RS);
}

//获取参团信息（我的参团）
function QueryOrderList(){
  var data = {
    "totalPage": 2, //总页数
    "list": [
      {
        "id": 1,  //团购订单ID	
        "orderId": 1,  //团购订单ID	
        "merchantId": 1,  //商户ID	
        "name": "精品羊排 新鲜出厂当日即达",	   //团购名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png",	   //展示url
        "orderNums": "5盒", //订单数量
        "status": 0, //0 即将到货 1 已完成
        "joinTime": "2018/09/16 00:00:00", // 下单时间，注意格式
        "comments": "草原宏宝蒙巴克 无公害谷饲羔羊" // 简述
      }
    ]
  }
  RS.data = data;
  return JSON.stringify(RS);
}

//获取参团详情（我的参团-兑现）
function QueryOrderDetail(){
  var data = {
    "id": 1,  //订单id	  
    "status": 0, // 订单状态 0 待支付 1 已支付 2 待领取 3 已完成 4 放弃 5 退货
    "totalPay": 100.05,//共付
    "needPay": 100.05,// 应付
    "orderQRcode": "https://qr.api.cli.im/qr?data=1&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=260&kid=cliim&key=309f76334fe78db4caacfd008659a22a",// 订单二维码（包含订单id）
    "code": "773b8bde7ed698bc2cc2227d5c765704", //订单识别码
    "orderNums": "5盒", //订单数量
    "groupPurchase": {
      "id": 1,  //id	
      "name": "精品羊排 新鲜出厂当日即达",	   //团购名称
      "url": "https://yanxuan.nosdn.127.net/dab1e16fb89680657a4a70341ee0ee9c.jpg?imageView&quality=95&thumbnail=60x60",	   //展示url
      "status":0, //0 未开始 1 进行中 2 已成团 3 已过期
      "comments": "精品羊排新鲜出厂当日即达", //简述

    }, //团购信息

    "merchant": {
      "merchantId": 1,  //商户ID
      "merchantName": "团购商超",//团购商超
      "merchantUserName": "张三",//团购商超负责人
      "merchantPhone": "010-3574787887",//团购商超电话
      "avatar": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/user.png" //头像	
    }, //团长信息

    "goodsList": [
      {
        "id": 1, // 商品id
        "url": "/static/images/TB1baFLaOrpK1RjSZFhXXXSdXXa_!!0-item_pic.jpg_250x250.jpg",//展示图片
        "name": "细嫩多汁蜜蜂21.5C绿心奇异果",//名称
        "specifications": "整箱20个",//规格
        "marketPrice": 11.05,//市场价
        "price": 10.05,//单价
        "unit":"盒",//单位
        "buyNum": 100,//购买数量
      },
      {
        "id": 2, // 商品id
        "url": "/static/images/TB1baFLaOrpK1RjSZFhXXXSdXXa_!!0-item_pic.jpg_250x250.jpg",//展示图片
        "name": "精品羊排 新鲜出厂当日即达",//名称
        "specifications": "整箱20个",//规格
        "marketPrice": 19.05,//市场价
        "price": 10.05,//单价
        "unit": "盒",//单位
        "buyNum": 100,//购买数量
      }
    ]//商品清单


  }

  
  RS.data = data;
  return JSON.stringify(RS);
}
//获取一元夺宝列表信息
function QueryTreasureList(){
  var data = {
    "totalPage": 2, //总页数
    "list": [
      {
        "id": 1,  //id	
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png",	   //展示url
        "marketPrice": 10.05,//市场价
        "price": 10.05,//单价
        "status": 0, //0 未开始 1 进行中 2 已完成 3 已过期
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/10/24 00:00:00", //开始时间，注意格式
        "endTime": "2018/10/30 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
      },
      {
        "id": 2,  //id	
        "name": "难以置信 1块钱就能得到2",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png",	   //展示url
        "marketPrice": 10.05,//市场价
        "price": 10.05,//单价
        "status": 2, //0 未开始 1 进行中 2 已完成 3 已过期
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/10/21 00:00:00", //开始时间，注意格式
        "endTime": "2018/10/22 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
      }
    ],
    "winTreasure":{
      "id": 1,  //id	
      "name": "难以置信 1块钱就能得到",	   //名称
      "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png", //展示url
      "marketPrice": 10.05,//市场价
      "price": 10.05,//单价
      "status": 0, // 0 未开奖 1 中奖  2 未中奖
      "comments": "分享朋友机会翻倍", //宣传语
      "limitNum": 99, //参加人数上限
      "joinNum": 90, //参加人数
      "startTime": "2018/10/22 00:00:00", //开始时间，注意格式
      "endTime": "2018/10/23 00:00:00", //结束时间，注意格式
      "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
      "winNum": "46",//中奖次数,
      "nickName":"白色的忧伤" // 中奖者昵称
      }
      

  }
  RS.data = data;
  return JSON.stringify(RS)

}

function QueryWinList(){

  var data = {
    "totalPage": 2, //总页数
    "list": [
      {
        "id": 1,  //id	
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png", //展示url
        "marketPrice": 10.05,//市场价
        "price": 10.05,//单价
        "status": 1, // 0 未开奖 1 中奖  2 未中奖
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/10/22 00:00:00", //开始时间，注意格式
        "endTime": "2018/10/23 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
        "winNum": "46",//中奖次数,
        "nickName": "白色的忧伤" // 中奖者昵称
      },
      {
        "id": 1,  //id	
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png", //展示url
        "marketPrice": 10.05,//市场价
        "price": 10.05,//单价
        "status": 0, // 0 未开奖 1 中奖  2 未中奖
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/10/22 00:00:00", //开始时间，注意格式
        "endTime": "2018/10/23 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
        "winNum": "46",//中奖次数,
        "nickName": "白色的忧伤" // 中奖者昵称
      },
      {
        "id": 1,  //id	
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png", //展示url
        "marketPrice": 10.05,//市场价
        "price": 10.05,//单价
        "status": 1, // 0 未开奖 1 中奖  2 未中奖
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/10/22 00:00:00", //开始时间，注意格式
        "endTime": "2018/10/23 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
        "winNum": "46",//中奖次数,
        "nickName": "白色的忧伤" // 中奖者昵称
      },
      {
        "id": 1,  //id	
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png", //展示url
        "marketPrice": 10.05,//市场价
        "price": 10.05,//单价
        "status": 1, // 0 未开奖 1 中奖  2 未中奖
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/10/22 00:00:00", //开始时间，注意格式
        "endTime": "2018/10/23 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
        "winNum": "46",//中奖次数,
        "nickName": "白色的忧伤" // 中奖者昵称
      },
      {
        "id": 1,  //id	
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png", //展示url
        "marketPrice": 10.05,//市场价
        "price": 10.05,//单价
        "status": 1, // 0 未开奖 1 中奖  2 未中奖
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/10/22 00:00:00", //开始时间，注意格式
        "endTime": "2018/10/23 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
        "winNum": "46",//中奖次数,
        "nickName": "白色的忧伤" // 中奖者昵称
      },
      {
        "id": 1,  //id	
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png", //展示url
        "marketPrice": 10.05,//市场价
        "price": 10.05,//单价
        "status": 1, // 0 未开奖 1 中奖  2 未中奖
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/10/22 00:00:00", //开始时间，注意格式
        "endTime": "2018/10/23 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
        "winNum": "46",//中奖次数,
        "nickName": "白色的忧伤" // 中奖者昵称
      },
      {
        "id": 1,  //id	
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png", //展示url
        "marketPrice": 10.05,//市场价
        "price": 10.05,//单价
        "status": 1, // 0 未开奖 1 中奖  2 未中奖
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/10/22 00:00:00", //开始时间，注意格式
        "endTime": "2018/10/23 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
        "winNum": "46",//中奖次数,
        "nickName": "白色的忧伤" // 中奖者昵称
      },
      {
        "id": 1,  //id	
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png", //展示url
        "marketPrice": 10.05,//市场价
        "price": 10.05,//单价
        "status": 1, // 0 未开奖 1 中奖  2 未中奖
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/10/22 00:00:00", //开始时间，注意格式
        "endTime": "2018/10/23 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
        "winNum": "46",//中奖次数,
        "nickName": "白色的忧伤" // 中奖者昵称
      },
      {
        "id": 1,  //id	
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png", //展示url
        "marketPrice": 10.05,//市场价
        "price": 10.05,//单价
        "status": 1, // 0 未开奖 1 中奖  2 未中奖
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/10/22 00:00:00", //开始时间，注意格式
        "endTime": "2018/10/23 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
        "winNum": "46",//中奖次数,
        "nickName": "白色的忧伤" // 中奖者昵称
      },
      {
        "id": 1,  //id	
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png", //展示url
        "marketPrice": 10.05,//市场价
        "price": 10.05,//单价
        "status": 1, // 0 未开奖 1 中奖  2 未中奖
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/10/22 00:00:00", //开始时间，注意格式
        "endTime": "2018/10/23 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
        "winNum": "46",//中奖次数,
        "nickName": "白色的忧伤" // 中奖者昵称
      },
    ]
  }
  RS.data = data;
  return JSON.stringify(RS)

}

function QueryTreasureDetails(){
  var data = {
    "detail": {
      "id": 1,  //id
      "detailId": 1,  //夺宝详情id	
      "pics": [
        "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/t1.png",
        "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/t1.png",
         ],  //展示图片
      "title": "难以置信 1块钱就能得到",	   //夺宝名称
      "status": 1, //0 未开始 1 进行中 2 已完成 3 已过期
      "comments": "参与赢大奖", //宣传语
      "content": "", //描述
      "limitNum": 99, //人数上限
      "startTime": "2018/10/24 00:00:00", //开始时间，注意格式
      "endTime": "2018/10/30 00:00:00", //结束时间，注意格式
      "joinNum": 90, //参加人数
      "marketPrice": 100.05,//市场价
      "price": 1.00,//单价
      "codes": [
        {
          "code": "34245353", //参与码（幸运号码）
          "type": 1, //获取方式 0 支付获取 1 分享获取
          "createTime": "2018/09/16 00:00:00", //获取时间，注意格式
        }
      ], //参与码（幸运号码）

    },

    "joinHistories": [
      {
        "name": "wangwang",	   //客户名称
        "nickName": "白色的忧伤",	      //微信昵称
        "openid": "P90FDeUdnFMZkwZ274fEWnWqE",        // openid
        "avatar": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/user.png", //头像
        "code": "34245353", //参与码（幸运号码）
        "createTime": "2018/09/16 00:00:00", //获取时间，注意格式
      }
    ]
  }
  RS.data = data;
  return JSON.stringify(RS)
}

function QueryMyTreasures() {

  var data = {
    "totalPage": 2, //总页数
    "list": [
      {

        "id": 1,  //id
        "treasureId": 1,  //id	
        "code": "34245353", //参与码（幸运号码）
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png",	   //展示url
        "marketPrice": 10.05,//市场价
        "price": 1.00,//单价
        "status": 0, // 0 未开奖 1 中奖  2 未中奖
        "isLottery":0, //未中奖
        "comments": "分享朋友机会翻倍", //宣传语
        "startTime": "2018/09/16 00:00:00", //开始时间，注意格式
        "endTime": "2018/09/16 00:00:00", //结束时间，注意格式
        "lotterynTime": "2018/09/16 00:00:00", //开奖时间，注意格式
      },
      {

        "id": 2,  //id	
        "treasureId": 1,  //id
        "code": "34245353", //参与码（幸运号码）
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g2.png",	   //展示url
        "marketPrice": 10.05,//市场价
        "price": 1.00,//单价
        "status": 1, // 0 未开奖 1 中奖  2 未中奖
        "isLottery": 0, //未中奖
        "comments": "分享朋友机会翻倍", //宣传语
        "startTime": "2018/09/16 00:00:00", //开始时间，注意格式
        "endTime": "2018/09/16 00:00:00", //结束时间，注意格式
        "lotterynTime": "2018/09/16 00:00:00", //开奖时间，注意格式
      },
      {

        "id": 3,  //id	
        "code": "34245353", //参与码（幸运号码）
        "name": "难以置信 1块钱就能得到",	   //名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png",	   //展示url
        "marketPrice": 10.05,//市场价
        "price": 1.00,//单价
        "status": 2, // 0 未开奖 1 中奖  2 未中奖
        "isLottery": 0, //未中奖
        "comments": "分享朋友机会翻倍", //宣传语
        "startTime": "2018/09/16 00:00:00", //开始时间，注意格式
        "endTime": "2018/09/16 00:00:00", //结束时间，注意格式
        "lotterynTime": "2018/09/16 00:00:00", //开奖时间，注意格式
      }
    ]
  }
  RS.data = data;
  return JSON.stringify(RS)

}


module.exports = {
  getData,
}