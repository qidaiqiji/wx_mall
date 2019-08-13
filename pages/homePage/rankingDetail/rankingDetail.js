// pages/homePage/rankingDetail/rankingDetail.js
import api from '../../../utils/api.js'
const {
  paihangView
} = api
const app = getApp()
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPopCart: false,
    toTheTop: false,
    backgroundLinear: '',
    isHide: false,
    isLoading:2,
  },

  handleToBuy(e) {
    this.setData({
      isPopCart: true,
      addGoodsId: e.currentTarget.dataset.goodsid,
      addGoodslist: e.currentTarget.dataset.goodslist
    })


    if (this.data.isPopCart) {
      this.selectComponent("#addCart").showModal();

    }

  },
  onevokeAddCart(e) {
    var that = this
    app.onevokeAddCart(that, e)
  },
  onhideCart(e) {
    var that = this
    app.onhideCart(that, e)
  },
  ongetTotle(e) {
    this.setData({
      totalCounts: e.detail.totalCount
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      rankingDetailTag: imgHead + 'activeDirectory/ranking_detail_tag.png?version=' + version,
      iconNo1: imgHead + 'activeDirectory/icon_no1.png?version=' + version,
      iconNo2: imgHead + 'activeDirectory/icon_no2.png?version=' + version,
      iconNo3: imgHead + 'activeDirectory/icon_no3.png?version=' + version,
    });
    wx.setNavigationBarTitle({
      title: '榜单详情'
    })
    paihangView({
      ...options
    }).then(res => {

      var colorRgb = function (sColor) {
        sColor = sColor.toLowerCase();
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 如果是16进制颜色
        if (sColor && reg.test(sColor)) {
          if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
              sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
          }
          //处理六位的颜色值
          var sColorChange = [];
          for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
          }
          var isColor = ["rgba(" + sColorChange.join(",") + ',0' + ")", "rgba(" + sColorChange.join(",") + ',1' + ")"]
        }
        return isColor;
      };
    let  backgroundLinear='';
      if(res.data.color){
        var isColor = colorRgb(res.data.color)
         backgroundLinear = `linear-gradient(0deg, ${isColor[0]} 0%, ${isColor[1]} 100%)`
      }
    
      this.setData({
        ...res.data,
        backgroundLinear,
      }, () => {
        this.setData({
          isLoading:1,
          isHide: true,
        })
      })
    })
  },
  goPrice: throttle(function (e) {
    app.appProduct(e.currentTarget.dataset.goodsid)
  }),
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  ontoUpImgs() {
    app.handleJumpToTop();

  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})