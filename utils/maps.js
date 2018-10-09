/**
 * 地图工具类
 * @author bjsonghongxu 
 */
var amap = require('../lib/amap-wx.js'); // 高德地图
var amapKey = "341f556d52f65f1e29c8a48ca1315bd1"; //高德地图key
/***
 * 获取位置信息
 *  1.获取用户开放地理位置信息
 *  2.获取具体的地址信息
 */
function getLocation(){
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              // 用户已经同意小程序使用获取地理位置，后续调用 wx.chooseLocation 接口不会弹窗询问
              wx.chooseLocation({
                success: (res) => {
                  var latitude = res.latitude
                  var longitude = res.longitude
                  var addr = res.name;
                  wx.showToast({ title: res.name });
                  wx.showToast({ title: res.address });
                  //console.log(addr)
                }
              })
            }
          })
        } else {
          wx.chooseLocation({
            success: (res) => {
              resolve(res);
            }
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: res,
        })
      }
    })
  });
}



function getRegeo(longitude, latitude) {
  return new Promise(function (resolve, reject) {
    var myAmapFun = new amap.AMapWX({ key: amapKey });
    myAmapFun.getPoiAround({
      location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
      // iconPathSelected: '选中 marker 图标的相对路径', //如：..­/..­/img/marker_checked.png
      // iconPath: '未选中 marker 图标的相对路径', //如：..­/..­/img/marker.png
      success: function (data) {
        console.log("data----" + data);
        resolve(data);
      },
      fail: function (info) {
        //wx.showModal({ title: info.errMsg })
        console.log(info);
      }
    })
  });
}

/**
 * 获取高德地图地理位置信息
 */
function getAMapLocation() {
  return new Promise(function (resolve, reject) {
    var myAmapFun = new amap.AMapWX({ key: amapKey });
    myAmapFun.getPoiAround({
      // iconPathSelected: '选中 marker 图标的相对路径', //如：..­/..­/img/marker_checked.png
      // iconPath: '未选中 marker 图标的相对路径', //如：..­/..­/img/marker.png
      success: function (data) {
        resolve(data.markers[0]);
      },
      fail: function (info) {
        wx.showModal({ title: info.errMsg })
      }
    })
  });
}

/**
 * 格式化距离
 */
function formatDistance(distance,dot){
  var isBig = false;
  if (distance >= 1000) {
    distance /= 1000;
    isBig = true;
  }
  return distance.toFixed(2) + (isBig ? "km" : "m");
}

module.exports = {
  getLocation,
  getAMapLocation,
  formatDistance,
  getRegeo,
}