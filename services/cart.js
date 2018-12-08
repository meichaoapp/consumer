/**
 * @author bjsonghongxu
 * @desc shopping cart service
 * @time 2018-12-01
 */

const wecache = require('../utils/wecache.js');

const CART_KEY = "MEICHAO_CART";  

//商品类型 1.普通团品 2. 一元购 3. 店长自营产品
const GROUP_PURCHASE = 1;
const DOLLAR_TREASURE = 2;
const SLEF_SALE = 3;
const DELIVERY_LINE = 200; // 免邮费标准线
const DELIVERY_COST_PRICE  = 10.00; // 邮费

/**
 * add goods to cart
 */
function add2Cart(goods) {
  var _arr = [];
  _arr.push(goods);
  wecache.put(CART_KEY, _arr,-1);
}

/**
 * clean cart goods data 
 */
function cleanCart() {
  wecache.remove(CART_KEY);
}

/**
 * load cart data
 */
function loadCart() {
 return wecache.get(CART_KEY,[]);
}

/***
 * load cart goods by id 
 */
function loadCartGoods(id) {
  var _arr = loadCart();
  var goods = null;
  if (_arr.length > 0) {
    _arr.map(g => {
      //replace
      if (g.id == id) {
         goods = g;
      }
    });
  } 
  return goods;
}
/**
 * 加载购物车商品总价
 */
function loadPrice() {
  var total = 0.00;
  var _arr = loadCart();
  if (_arr.length > 0) {
    _arr.map(g => {
      total += g.price * g.number;
    });
  } 
  return total;
}
/**
 * 购物车商品数
 */
function loadGooodsNums() {
  var total = 0;
  var _arr = loadCart();
  if (_arr.length > 0) {
    _arr.map(g => {
      total += g.number;
    });
  }
  return total;
}

/**
 *  update cart data
 */
function updateCart(goods) {
  var _arr = loadCart();
  if (_arr.length > 0) {
    _arr.map(g => {
      //replace
      if(g.id == goods.id) {
        removeCart(g.id);
        add2Cart(goods);
      }
    });
   }else {
     add2Cart(goods);
   }
}

/**
 * remove cart goods by Id
 */
function removeCart(id) {
  var _arr = loadCart();
  var i = indexOf(id , _arr);
  if(i != -1) {
    _arr.splice(i, 1);
    wecache.put(CART_KEY, _arr, -1);
  }
  return _arr;
}

//index of 
function indexOf(id, _arr) {
  if (_arr.length > 0) {
    var len = _arr.length;
    for (var i = 0; i < len; i++) {
      if (_arr[i].id == id) {
        return parseInt(i);
      }
    }
    return -1;
  }else {
    return -1;
  }
}

/**
 * t_id 团购ID  
 * cart googs list to orders( split orders)
 */
function createOrder(t_id , user){
  var totalPay = 0.00;//共付
  var needPay =  0.00;// 应付
  var _arr = loadCart();
  var m_list = [];
  var s_list = [];
  if (_arr.length > 0) {
    var len = _arr.length;
    for (var i = 0; i < len; i++) {
      totalPay += _arr[i].marketPrice;
      needPay += _arr[i].price;
      if (_arr[i].productType == GROUP_PURCHASE) {
        m_list.push(_arr[i]);
      } else if (_arr[i].productType == SLEF_SALE) {
        s_list.push(_arr[i]);
      }
    }
  }
   return {
     totalPay: totalPay,
     needPay: needPay,
     merchantOrder: getMerchantOrder(m_list, t_id, user),// 团购订单
     oneselfOrder: oneselfOrder = getSelfOrder(s_list, t_id, user),
   };

}

//获取团购订单
function getMerchantOrder(_arr, t_id, user) {
  if (_arr.length == 0) {return null;}

  var merchantOrder = {
    "id": t_id,  //团购id
    "userId": user.id,  //用户ID
  };
  var totalPay =  0.00;//共付
  var needPay =  0.00;// 应付
  var buyNum =  0;//购买总数量

  var goodsList = []
  var len = _arr.length;
  for (var i = 0; i < len; i++) {
    totalPay += _arr[i].marketPrice;
    needPay += _arr[i].price;
    buyNum += _arr[i].buyNum;
    var g = {
      "id": _arr[i].id,  // 商品id
      "buyNum": _arr[i].buyNum, //购买数量
    };
    goodsList.push(g);
  }

  merchantOrder.totalPay = totalPay;
  merchantOrder.needPay = needPay;
  merchantOrder.buyNum = buyNum;
  merchantOrder.goodsList = goodsList;

  return merchantOrder;
 
}
//获取自营订单
function getSelfOrder(_arr, t_id, user) {
  if (_arr.length == 0) { return null; }
  // 自营订单
  var oneselfOrder = {
    "id": t_id,  //团购id
    "userId": user.id,  //用户ID
    "deliveryType": 1, // 1自提 2送货上门
    "address": user.province + user.city + user.area + user.address, //送货上门地址
    "phone": user.phone,
    "name": user.name,
    "goodsList": [
      {
        "id": 1, // 商品id
        "buyNum": 10,//购买数量
      }
    ]
  }
  var totalPay = 0.00;//共付
  var needPay = 0.00;// 应付
  var buyNum = 0;//购买总数量
  var deliveryCost = 0.00; // 快递费
  
  var goodsList = []
  var len = _arr.length;
  for (var i = 0; i < len; i++) {
    totalPay += _arr[i].marketPrice;
    needPay += _arr[i].price;
    buyNum += _arr[i].buyNum;
    var g = {
      "id": _arr[i].id,  // 商品id
      "buyNum": _arr[i].buyNum, //购买数量
    };
    goodsList.push(g);
  }

  // //判断邮费
  // if (needPay < DELIVERY_LINE) {
  //   deliveryCost = DELIVERY_COST_PRICE;
  // }

  oneselfOrder.totalPay = totalPay;
  oneselfOrder.needPay = needPay + deliveryCost;
  oneselfOrder.deliveryCost = deliveryCost;
  oneselfOrder.buyNum = buyNum;
  oneselfOrder.goodsList = goodsList;
  return oneselfOrder;
}


  module.exports = {
    add2Cart, //添加购物车
    cleanCart,//清空购物车
    loadCart,//加载购车商品
    loadCartGoods, //加载购物车商品
    updateCart,//更改购物车信息
    removeCart,//移除购物车商品
    loadPrice,//购物车商品价格
    loadGooodsNums,//商品数量
    createOrder,//生成订单数据（包含拆单逻辑） 
  };
