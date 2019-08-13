// pages/superBrand/superBrand.js
const app = getApp()
const throttle = app.throttle
import api from '../../utils/api.js'
const {
  superBrandIndex,
  superBrandHotList,
  couponTake,
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shouVideo:'',
    superBrandId: '',
    hidePopupWindow: false,
    isEventPopupsHide: true,
    goodsList: [],
    toTheTop: false,
    isLoading: true,
    current: 0,
    page: 1,
    pageSize: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      icon_play: imgHead + 'superBrand/icon_play.png?version=' + version,
      icon_shop_white: imgHead + 'superBrand/icon_shop_white.png?version=' + version,
      img_bg: imgHead + 'superBrand/img_bg.png?version=' + version,
      img_youhui: imgHead + 'superBrand/img_youhui.png?version=' + version,
      super_brand: imgHead + 'superBrand/super_brand.png?version=' + version,
      found_background: imgHead + 'superBrand/found_background.png?version=' + version,
      superBrandId: options.superBrandId
    }, () => {
      this.getSuperBrandIndex()
      this.getSuperBrandHotList(this.data.page)
    })

  },
  // 详情
  getSuperBrandIndex() {
    superBrandIndex({
      superBrandId: this.data.superBrandId,
    }).then(res => {
      res.data.goodsCardList.forEach(element => {
        var goodsPrice = element.goodsInfo && String(element.goodsInfo.goodsPrice)
        var onePrice = goodsPrice.split('.')
        element.goodsInfo.intPrice = onePrice[0];
        if (onePrice[1]) {
          element.goodsInfo.flootPrice = onePrice[1];
        } else {
          element.goodsInfo.flootPrice = '00';
        }
      });
      res.data.bannerInfo.forEach(element => {
        if (element.videoLength < 60) {
          element.newVideoLength = '00"' + element.videoLength
        } else {
          var h = Math.floor(element.videoLength / 60);
          var s = element.videoLength % 60;
          if (h > 9) {
            element.newVideoLength = h + '"' + s;
          } else {
            element.newVideoLength = '0' + h + '"' + s;
          }
        }

      })
      this.setData({
        ...res.data
      }, () => {
        // 修改底色
        wx.setBackgroundColor({
          backgroundColor: res.data.contentColor
        })
      })
    })
  },
  // 底部列表
  getSuperBrandHotList(page) {
    superBrandHotList({
      superBrandId: this.data.superBrandId,
      page: page,
      pageSize: this.data.pageSize,
    }).then(res => {
      var allList = this.data.goodsList.concat([], ...res.data.goodsList);
      if (res.data.goodsList.length < this.data.pageSize) {
        this.setData({
          isLoading: false
        })
      } else {
        this.setData({
          isLoading: true
        })
      }
      this.setData({
        goodsList: allList,
        page: page,
      })
    })
  },
  goJumpUrl: throttle(function (e) {
    var item = e.currentTarget.dataset.item;
    if (item.video) {
      this.onStartPlay(item)
    } else {
      wx.navigateTo({
        url: item.url
      });
    }

  }),
  goAdvertising: throttle(function (e) {
    app.adSpaceJump(e.currentTarget.dataset.item)
  }),
  goShop: throttle(function (e) {
    var goodsList = {};
    goodsList.goodsInfo = e.currentTarget.dataset.goodslist.goodsInfo
    var that = this;
    this.setData({
      isPopCart: true,
      addGoodsId: e.currentTarget.dataset.goodsid,
      addGoodslist: goodsList,
    }, () => {
      app.onevokeAddCart(that, e);
    })
  }),
  onhideCart(e) {
    var that = this
    app.onhideCart(that, e);
  },
  ongetTotle(e) {
    this.setData({
      totalCounts: e.detail.totalCount
    })
  },
  ontoUpImgs() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 200,
    })
  },
  onEventPopups() {
    this.setData({
      isEventPopupsHide: false
    })
  },
  onStartPlay(item) {
    var videoWidth = item.videoWidth;
    var videoHeight = item.videoHeight;
    var changeWidth = '';
    var changeHeight = '';
    if (videoWidth > videoHeight) {
      if (videoWidth == 750) {
        changeWidth = videoWidth;
        changeHeight = videoHeight;
      } else {
        changeWidth = 750;
        changeHeight = 750 / (videoWidth / videoHeight)
      }

    } else {
      if (videoHeight == 750) {
        changeHeight = videoHeight;
        changeWidth = videoWidth;
      } else {
        changeHeight = 750;
        changeWidth = (videoWidth / videoHeight) * 750
      }

    }
    this.setData({
      shouVideo: item.video,
      changeWidth,
      changeHeight,
    })
  },
  onevokeAddCart(e) {
    var that = this
    app.onevokeAddCart(that, e)
  },
  jumpToDetail: throttle(function (e) {
    wx.navigateTo({
      url: '/pages/foundTxt/foundTxt?articleId=' + e.currentTarget.dataset.articleid,
    })
  }),
  goProduct(e) {
    var goodsId = e.currentTarget.dataset.goodid
    app.appProduct(goodsId)
  },
  videoEnd(e) {
    this.setData({
      shouVideo: ''
    })

  },
  hideVideo() {
    this.setData({
      shouVideo: ''
    })
  },
  superBrandPopup: throttle(function () {
    this.setData({
      hidePopupWindow: true
    })
  }),
  onMyshow() {
    this.setData({
      hidePopupWindow: false
    })
  },
  move() {
    return false;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  swiperChange(e) {
    this.setData({
      current: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoading) {
      let page = this.data.page + 1;

      this.getSuperBrandHotList(page)
    }
  },
  onPageScroll(e) {

    if (e.scrollTop > app.globalData.phoneScreenHeight) {
      this.setData({
        toTheTop: true
      })
    } else {
      this.setData({
        toTheTop: false
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})