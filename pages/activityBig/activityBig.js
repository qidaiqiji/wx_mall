// pages/activityBig/activityBig.js
const app = getApp()
const throttle = app.throttle
import api from '../../utils/api.js'
const {
  activityExpress
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goScrollTop: 0,
    imgHead: '',
    version: '',
    isPageId: '',
    menus: [{
      name: '主会场',
      sellingPoint: '',
      pageId: '/pages/activityBig/activityBig'
    }, {
      name: '秒杀会场',
      sellingPoint: '不止3折 仅限3天',
      pageId: '/pages/homePage/miaosha/miaosha'
    }, {
      name: '特卖专场',
      sellingPoint: '小美快抢 直降底价',
      pageId: 'specialSale'
    }, {
      name: '巨划算会场',
      sellingPoint: '为你让利 立省5元',
      pageId: '/pages/homePage/juhuasuan/juhuasuan'
    }, {
      name: '满赠会场',
      sellingPoint: '最高再享7.5折',
      pageId: '/pages/homePage/anniversary/anniversary?title=1'
    }, {
      name: '套餐会场',
      sellingPoint: '最高立省199元',
      pageId: '/pages/homePage/anniversary/anniversary?title=2'
    }],
    isPageId: '/pages/activityBig/activityBig',
    flashSaleListOne: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      imgHead,
      version
    })
    this.setData({
      bargain_gift: imgHead + 'activity/bargain_gift.png?version=' + version,
      big_deal: imgHead + 'activity/big_deal.png?version=' + version,
      black_card: imgHead + 'activity/black_card.png?version=' + version,
      black_card_two: imgHead + 'activity/black_card_two.png?version=' + version,
      love_courtesy: imgHead + 'activity/love_courtesy.png?version=' + version,
      return_top: imgHead + 'activity/return_top.png?version=' + version,
      sale: imgHead + 'activity/sale.png?version=' + version,
      seconds_kill: imgHead + 'activity/seconds_kill.png?version=' + version,
      select: imgHead + 'activity/select.png?version=' + version,

    })

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
    activityExpress({}).then(res => {
      var flashSaleList = res.data.flashSaleList;
      var flashSaleListOne = flashSaleList.shift();
      this.setData({
        ...res.data,
        flashSaleListOne,
      }, () => {
        const query = wx.createSelectorQuery();
        query.select('#activityBigSale').boundingClientRect();
        query.exec((res) => {
          if (res[0]) {
            this.setData({
              goScrollTop: res[0].top + 10
            })
          }
        });
      })
    });

  },
  bannerGo: throttle(function (e) {
    var url = e.currentTarget.dataset.url
    app.adSpaceJump(url)
  }),
  goToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  handleMenus(e) {
    this.setData({
      isShowNavigation: false
    })
    if (e.detail.pageId == '/pages/activityBig/activityBig') {
      if (this.data.isPageId == e.detail.pageId) {
        return false
      } else {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
        this.setData({
          isPageId: e.detail.pageId
        })
      }
    } else if (e.detail.pageId.indexOf('/pages/activityBig/activityBig') >= 0) {
      if (this.data.isPageId == e.detail.pageId) {
        return false
      }
      this.setData({
        isPageId: e.detail.pageId
      })
      wx.pageScrollTo({
        scrollTop: this.data.temaiScrollTop,
        duration: 0
      })
    } else {

      var pages = getCurrentPages(); // 获取页面栈
      var prevPage = pages[pages.length - 2];
      var allRoute = []
      allRoute = pages.map(item => {
        return item.route
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      })
      switch (e.detail.pageId) {
        case '/pages/homePage/miaosha/miaosha':
          if (allRoute.includes('pages/homePage/miaosha/miaosha')) {
            wx.navigateBack({
              delta: allRoute.length - allRoute.indexOf('pages/homePage/miaosha/miaosha') - 1
            })
          } else {
            wx.navigateTo({
              url: '/pages/homePage/miaosha/miaosha'
            })
          }
          break;
        case '/pages/homePage/juhuasuan/juhuasuan':
          if (allRoute.includes('pages/homePage/juhuasuan/juhuasuan')) {
            wx.navigateBack({
              delta: allRoute.length - allRoute.indexOf('pages/homePage/juhuasuan/juhuasuan') - 1
            })
          } else {
            wx.navigateTo({
              url: '/pages/homePage/juhuasuan/juhuasuan'
            })
          }
          break;
        case '/pages/homePage/anniversary/anniversary?title=1':
          if (allRoute.includes('pages/homePage/anniversary/anniversary')) {
            prevPage.setData({
              title: 1
            })
            var index = 0
            if (allRoute.length - allRoute.indexOf('pages/homePage/anniversary/anniversary') == 1) {
              index = 1
            } else {
              index = allRoute.length - allRoute.indexOf('pages/homePage/anniversary/anniversary') - 1
            }
            wx.navigateBack({
              delta: index
            })
          } else {
            wx.navigateTo({
              url: '/pages/homePage/anniversary/anniversary?title=1'
            })
          }
          break;
        case '/pages/homePage/anniversary/anniversary?title=2':
          if (allRoute.includes('pages/homePage/anniversary/anniversary')) {
            prevPage.setData({
              title: 2
            })
            var index = 0
            if (allRoute.length - allRoute.indexOf('pages/homePage/anniversary/anniversary') == 1) {
              index = 1
            } else {
              index = allRoute.length - allRoute.indexOf('pages/homePage/anniversary/anniversary') - 1
            }
            wx.navigateBack({
              delta: index
            })
          } else {
            wx.navigateTo({
              url: '/pages/homePage/anniversary/anniversary?title=2'
            })
          }
          break;
        default:
          break;
      }
    }
  },
  moreAndMore() {
    wx.navigateTo({
      url: '/pages/homePage/miaosha/miaosha',
    })
  },
  onevokeAddCart(e) {
    var that = this
    app.onevokeAddCart(that, e)
  },
  onhideCart(e) {
    var that = this
    app.onhideCart(that, e);
  },
  ongetTotle(e) {
    this.setData({
      totalCounts: e.detail.totalCount
    })
  },
  onUpMenus(e) {
    var pageId = e.detail.pageId;
    var activityBigTwo = 'specialSale';
    this.setData({
      ishide: false
    })
    if (activityBigTwo == pageId) {
      wx.pageScrollTo({
        scrollTop: this.data.goScrollTop,
        duration: 200,
      })
    } else {
      wx.navigateTo({
        url: pageId
      })
    }
  },
  allremind(e) {
    var id = e;
    this.setData({
      ishide: true
    })
  },
  onallPreferential() {
    this.setData({
      ishide: false
    })
  },
  blackCard() {
    wx.navigateTo({
      url: '/pages/blackCard/blackCard'
    })
  },
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  goShop(e) {
    var goodsId = e.currentTarget.dataset.goodid
    app.appProduct(goodsId)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      flashSaleEndTime: ''
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})