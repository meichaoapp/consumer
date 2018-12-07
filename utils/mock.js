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
  //查询商户信息
  if (url == api.QueryMerchants) {
    return queryMerchants();
  }

  //-----------------------新首页
  if (url == api.QueryIndexInfo) {
    return queryIndexInfo();
  }
  //获取团购信息
  if (url == api.QueryTGNewList) {
    return QueryTGNewList();
  }

  //-----------------------旧首页
  //查询banner
  if (url == api.QueryBanner) {
    return QueryBanner();
  }
  //获取团购信息
  if (url == api.QueryTGList) {
    return QueryTGList();
  }



  //-----------------------详情页
  ///获取团购详情信息(旧)
  if (url == api.QueryGroupPurchaseDetail){
    return QueryGroupPurchaseDetail();
  }
  ///获取团购详情信息（新）
  if (url == api.QueryGroupPurchaseGoodsDetail) {
    return queryGroupPurchaseGoodsDetail();
  }


  ///参团（首页+详情页）返回订单信息
  if (url == api.CreateOrder){
    return CreateOrder();
  }
  ///参团（首页+详情页）返回订单信息(新)
  if (url == api.CreateOrderNew) {
    return CreateOrderNew();
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

  if (url == api.JoinHistories) {
    return JoinHistories();
  }





  //支付
  if(url == api.Pay){
    return JSON.stringify(RS);
  }

  //短信验证码
  if (url == api.GetVerifiCode) {
    RS.data.verifiCode = "1234";
    return JSON.stringify(RS);
  }


  //添加/修改个人资料
  if (url == api.SubmitUserInfo) {
    return JSON.stringify(RS);
  }


  //获取个人资料
  if (url == api.QueryUserInfo) {
    return queryUserInfo();
  }


}

//微信登录
function wxLogin() {
  var user = {
    "user": {
      "id": 1, //id
      "name": "wangwang", //客户名称
      "nickName": "wangwang", //微信昵称
      "openid": "P90FDeUdnFMZkwZ274fEWnWqE", // openid
      "sex": 0, // 性别 0 男 1 女
      "avatar": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/user.png", //头像
			"completionInfo": "false", //  true 个人资料已填写，false 个人资料未填写
			"previewFlag": null, // 用于查询previewFlag为-1时，则可以预览新添的团品信息
      "phone": "18911111111",  //手机号
      "name": 张果果,  //联系人
      "province": "河北省",  //省code
      "city": "石家庄市",  //市code
      "area": "桥东区",  //地区code
      "address": "月亮小区18号",  //详细地址

    },

    "token": "773b8bde7ed698bc2cc2227d5c765704", //token
  }



  RS.data = data;
  return JSON.stringify(RS);

}

///查询商户信息
function queryMerchants() {
  var data = {
    list: [
      {
        "merchantId": 1,  //店铺id
        "distance": "700米",  //距离
        "merchantName": "幸福山竹",  //店长名称
        "merchantUserName": "张三",//团购商超负责人
        "logo": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/user.png",  //店铺logo
        "address": "山东省日照市大连路540号（兴业春天花园）",  //取货地址
      }
    ]
  }

  RS.data = data;
  return JSON.stringify(RS);

}


//获取个人资料
function queryUserInfo() {
  var data = {
    "userId": 1,  //用户id
    "userInfoId": 1,  //用户信息id
    "phone": "18911111111",  //手机号
    "name": "茉莉花开",  //联系人
    "province": "河北省",  //省code
    "city": "石家庄市",  //市code
    "area": "桥东区",  //地区code
    "address": "月亮小区18号",  //详细地址
  }


  RS.data = data;
  RS.data.token = "773b8bde7ed698bc2cc2227d5c765704";
  return JSON.stringify(RS);

}

//获取首页信息
function queryIndexInfo() {
  var data = {
    "banners": [
      {
        "id": 1,  //id
        "name": "wangwang",	   //轮播图名称
        "url": "https://wxpic.iliangpin.cn/meichao/banner1.png",	   //url
        "target": "" //跳转地址
      },
        {
            "id": 1,  //id
            "name": "wangwang",	   //轮播图名称
            "url": "https://wxpic.iliangpin.cn/meichao/banner1.png",	   //url
            "target": "" //跳转地址
        }
    ],
    "merchantList": [
      {
      "merchantId": 1,  //店铺id
      "distance": "700米",  //距离
      "merchantName":"幸福的鸭梨树",  //店长名称
      "merchantUserName": "张三",//团购商超负责人
      "logo": "https://wxpic.iliangpin.cn/meichao/Bitmap.png",  //店铺logo
      "address": "山东省日照市大连路540号（兴业春天花园）",  //取货地址
     }
    ],
    "classifys": [
      {
        "name": "鲜嫩果蔬",  //类别名称
        "logo": "https://wxpic.iliangpin.cn/meichao/nav1.png"  //店铺logo
      },
      {
        "name": "休闲零食",  //类别名称
        "logo": "https://wxpic.iliangpin.cn/meichao/nav2.png"  //店铺logo
      },
      {
        "name": "家居用品",  //类别名称
        "logo": "https://wxpic.iliangpin.cn/meichao/nav3.png"  //店铺logo
      },
      {
        "name": "日用百货",  //类别名称
        "logo": "https://wxpic.iliangpin.cn/meichao/nav4.png"  //店铺logo
      },
    ], //分类导航
    "treasures": [
        {
        "id": 1,  //id
        "name": "1块钱就能得到",	   //名称
        "url": "https://wxpic.iliangpin.cn/meichao/goods1.png", //展示url
        "marketPrice": 10.05,//市场价
        "price": 100.00,//单价
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/12/01 00:00:00", //开始时间，注意格式
        "endTime": "2018/12/23 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/12/30 00:00:00", //开奖时间，注意格式
        "winNum": "46",//中奖次数,
        "nickName":"昵称", // 中奖者昵称 为空，则不显示此列
        "status": 0, //开奖状态： 0 未开奖 1 已开奖
        "code": "100001" // 幸运号码
      },
      {
        "id": 2,  //id
        "name": "1块钱就能得到",	   //名称
        "url": "https://wxpic.iliangpin.cn/meichao/goods1.png", //展示url
        "marketPrice": 10.05,//市场价
        "price": 1000,//单价
        "comments": "分享朋友机会翻倍", //宣传语
        "limitNum": 99, //参加人数上限
        "joinNum": 90, //参加人数
        "startTime": "2018/10/22 00:00:00", //开始时间，注意格式
        "endTime": "2018/10/23 00:00:00", //结束时间，注意格式
        "lotteryTime": "2018/10/30 00:00:00", //开奖时间，注意格式
        "winNum": "46",//中奖次数,
        "nickName": "昵称", // 中奖者昵称 为空，则不显示此列
        "status": 1, //开奖状态： 0 未开奖 1 已开奖
        "code": "100001" // 幸运号码
      },
    ] //一元夺宝
  }

  RS.data = data;
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
      "url": "https://wxpic.iliangpin.cn/meichao/1.png",	   //展示url
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
      "url": "https://wxpic.iliangpin.cn/meichao/1.png",	   //展示url
      "price": "15元", //团购价
      "status": 0, //0 未开始 1 进行中 2 已成团 3 已过期
      "comments": "草原宏宝蒙巴克 无公害谷饲羔羊", //简述
      "limitNum": 99, //参团人数上限
      "joinNum": 12, //参团人数
      "startTime": "2018/09/16 00:00:00", //开始时间，注意格式
      "endTime": "2018/09/18 23:00:00", //结束时间，注意格式
    },
    {
      "id": 3,  //id
      "merchantId": 1,  //商户ID
      "merchantName": "快乐山鸡",
      "name": "精品羊排 新鲜出厂当日送达",	   //团购名称
      "url": "https://wxpic.iliangpin.cn/meichao/1.png",	   //展示url
      "price": "15元", //团购价
      "status": 0, //0 未开始 1 进行中 2 已成团 3 已过期
      "comments": "草原宏宝蒙巴克 无公害谷饲羔羊", //简述
      "limitNum": 99, //参团人数上限
      "joinNum": 12, //参团人数
      "startTime": "2018/09/16 00:00:00", //开始时间，注意格式
      "endTime": "2018/09/18 23:00:00", //结束时间，注意格式
    },
  ];
  var sellList = [
            {  //
                "sellType": "1",
                "sellDesc": "拼团爆品",
                "sort": "1", // 排序
                "selected": true // 是否被选中
            },
            {
                "sellType": "2",
                "sellDesc": "每日促销",
                "sort": "1",
                "selected": false
            },
            {
                "sellType": "3",
                "sellDesc": "产品预售",
                "sort": "1",
                "selected": false
            }];

  RS.data.list = list;
  RS.data.sellList = sellList;
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

//获取团购信息
function QueryTGNewList() {
  var data = {
    "totalPage": 2, //总页数
    "sellList": [
      {
        "sellType": "1",
        "sellDesc": "拼团爆品",
        "sort": "1", // 排序
        "selected": true // 是否被选中
      },
      {
        "sellType": "2",
        "sellDesc": "每日促销",
        "sort": "1",
        "selected": false
      },
      {
        "sellType": "3",
        "sellDesc": "产品预售",
        "sort": "1",
        "selected": false
      }
    ],
    "list": [
      {
          "id": 1, //id
          "name": "精品羊排 新鲜出厂当日即达", //团购名称
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g2.png", //展示url
          "price": "", //团购价
          "marketPrice": 10.05,//市场价/原价
          "status": 0, //0 未开始 1 进行中 2 已成团 3 已过期
          "comments": "草原宏宝蒙巴克 无公害谷饲羔羊", //简述
          "specifications": "整箱20个",//规格
          "productType": "1"//商品类型 1.普通团品 2. 一元购 3. 店长自营产品
      }
    ]
    };
  RS.data = data;
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

///获取团购商品信息
function queryGroupPurchaseGoodsDetail() {
  var data = {
    "detail": {
      "id": 1,  //id
      "pics": [
        "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g3.png",
        "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g3.png"
      ],  //商品展示图片
      "title": "精品羊排 新鲜出厂当日即达",	   //团购名称
      "status": 0, //0 未开始 1 进行中 2 已成团 3 已过期
      "comments": "", //宣传语
      "content": "", //描述
      "startTime": "2018/12/01 00:00:00", //开始时间，注意格式
      "endTime": "2018/12/31 00:00:00", //结束时间，注意格式
      "limitNum": 99, //参团人数上限
      "joinNum": 90, //参团人数
      "specifications": "整箱20个",//规格
      "marketPrice": 10.05,//市场价
      "price": 10.05,//单价
      "productType": "1"//商品类型 1.普通团品 2. 一元购 3. 店长自营产品
    },
    "merchant": {
      "merchantId": 1, //商户ID
      "merchantName": "美超团长", //商户名称（团长）
      "merchantUserName": "张三",//团购商超负责人
      "merchantPhone": "010-3574787887",//团购商超电话
      "logo": "",//团购logo
      "address": "山东省日照市东港区大连路三好鲜生超市"//取货地址
    }
  }
  RS.data = data;
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
///参团（首页+详情页）返回订单信息(新)
function CreateOrderNew() {
  var data = {
    "id": 1,  //订单id	  
    "orderId": 123456,  //订单编号，系统生成的	  
    "status": 0, // 订单状态 0 待支付 1 已支付 2 待领取 3 已完成 4 放弃 5 退货
    "wxPayResponse": {
      "appid": "", //小程序ID
      "mchId": "",//商户号
      "nonceStr": "",//随机字符串
      "sign": "",//签名
      "resultCode": "",//业务结果
      "tradeType": "",//交易类型
      "prepayId": "",//预支付交易会话标识
      "errCode": "",//错误代码
      "errCodeDes": "",//错误代码描述
      "timeStamp": "1540280191296" // 时间戳 字符串
    }
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
        "comments": "草原宏宝蒙巴克 无公害谷饲羔羊", // 简述
        "address": "山东省日照市东港区大连路三好鲜生超市",//取货地址
        "deliveryType": 1, // 1自提 2送货上门

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
    "orderId": 123456,  //系统生成订单编号 
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
        "status": 1,// 领货状态 0 未领取 1 已领取
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
        "status": 1,// 领货状态 0 未领取 1 已领取
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
      "status": 0, //0 未开始 1 进行中 2 已完成 3 已过期
      "comments": "参与赢大奖", //宣传语
      "content": "", //描述
      "limitNum": 99, //人数上限
      "startTime": "2018/11/10 00:00:00", //开始时间，注意格式
      "endTime": "2018/12/30 00:00:00", //结束时间，注意格式
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

    }
  }
  RS.data = data;
  return JSON.stringify(RS)
}

 function JoinHistories(){
   var data = {
     "totalPage": 2, //总页数
     "list": [
       {
         "name": "wangwang",	   //客户名称
         "nickName": "白色的忧伤",	      //微信昵称
         "openid": "P90FDeUdnFMZkwZ274fEWnWqE",        // openid
         "avatar": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/user.png", //头像
         "code": "34245353", //参与码（幸运号码）
         "createTime": "2018/09/16 00:00:00", //获取时间，注意格式
       },
       {
         "name": "wangwang",	   //客户名称
         "nickName": "白色的忧伤",	      //微信昵称
         "openid": "P90FDeUdnFMZkwZ274fEWnWqE",        // openid
         "avatar": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/user.png", //头像
         "code": "34245353", //参与码（幸运号码）
         "createTime": "2018/09/16 00:00:00", //获取时间，注意格式
       },
       {
         "name": "wangwang",	   //客户名称
         "nickName": "白色的忧伤",	      //微信昵称
         "openid": "P90FDeUdnFMZkwZ274fEWnWqE",        // openid
         "avatar": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/user.png", //头像
         "code": "34245353", //参与码（幸运号码）
         "createTime": "2018/09/16 00:00:00", //获取时间，注意格式
       },
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
