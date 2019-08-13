// pages/anniversary/anniversary.js
const app = getApp()
const throttle = app.throttle
import api from '../../../utils/api.js'
const {
  activityThreeYearCut
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBackgroundColor: '',
    isPopCart: false,
    addGoodsId: '',
    addGoodslist: '',
    isPageId: '',
    isShowNavigation: false,
    toTheTop: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ...options
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var title = '';
    var backgroundColor = '';
    // 设置导航条和页面背景色  title 满赠1 套餐 2 
    if (this.data.title == 1) {
      title = '惊喜满赠';
      backgroundColor = '#A71A1D';
      this.setData({
        isPageId: 'pages/homePage/anniversary/anniversary?title=1',
        isBackgroundColor: backgroundColor
      })
    } else if (this.data.title == 2) {
      title = '超值套餐';
      backgroundColor = '#F5B899';
      this.setData({
        isPageId: 'pages/homePage/anniversary/anniversary?title=2',
        isBackgroundColor: backgroundColor
      })
    }
    wx.setNavigationBarTitle({
      title: title,
    })
    wx.setBackgroundColor({
      backgroundColor: backgroundColor
    })
    activityThreeYearCut({
      type: this.data.title == 1 ? 'fullGift' : this.data.title == 2 ? 'superPkg' : ''
    }).then(res => {
      this.setData({
        ...res.data,
      });
    }).catch(err=>{
      console.log(err)
    });
    this.setData({
      menus: wx.getStorageSync('menus'),
      isActTime: wx.getStorageSync('isInActivity')
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
  handleShowNavigation() {
    this.setData({
      isShowNavigation: true
    })
  },
  ongetTotle(e) {
    this.setData({
      totalCounts: e.detail.totalCount
    })
  },
  onallPreferential() {
    this.setData({
      isShowNavigation: false
    })
  },
  handleMenus(e) {
    this.setData({
      isShowNavigation: false
    })
    let intoPageId = e.detail.pageId
    let initIsPageId = this.data.isPageId
    let index = e.detail.index
    app.handleNavMenu(initIsPageId, this, index)

    // if (this.data.title == 1 && e.detail.pageId == '/pages/homePage/anniversary/anniversary?title=1' && this.data.isPageId == e.detail.pageId) {
    //   console.log('没触发 惊喜满赠')
    //   return false
    // } else if (this.data.title == 2 && e.detail.pageId == '/pages/homePage/anniversary/anniversary?title=2' && this.data.isPageId == e.detail.pageId) {
    //   console.log('没触发 超值套餐')
    //   return false
    // } else {

    //   var pages = getCurrentPages(); // 获取页面栈
    //   var prevPage = pages[pages.length - 2];
    //   var allRoute = []
    //   allRoute = pages.map(item => {
    //     return item.route
    //   })
    //   console.log(prevPage, pages, allRoute)
    //   switch (e.detail.pageId) {

    //     case '/pages/thirdAnniversary/thirdAnniversary':
    //       if (allRoute.includes('pages/thirdAnniversary/thirdAnniversary')) {
    //         console.log(allRoute.indexOf('pages/thirdAnniversary/thirdAnniversary'), allRoute.length)
    //         wx.navigateBack({
    //           delta: allRoute.length - allRoute.indexOf('pages/thirdAnniversary/thirdAnniversary') - 1
    //         })
    //       } else {
    //         wx.navigateTo({
    //           url: '/pages/thirdAnniversary/thirdAnniversary'
    //         })
    //       }
    //       break;
    //     case '/pages/thirdAnniversary/thirdAnniversary?type=temai':
    //       if (allRoute.includes('pages/thirdAnniversary/thirdAnniversary')) {
    //         console.log(allRoute.indexOf('pages/thirdAnniversary/thirdAnniversary'), allRoute.length)
    //         prevPage.setData({
    //           type: 'temai'
    //         })
    //         wx.navigateBack({
    //           delta: allRoute.length - allRoute.indexOf('pages/thirdAnniversary/thirdAnniversary') - 1
    //         })
    //       } else {
    //         wx.navigateTo({
    //           url: '/pages/thirdAnniversary/thirdAnniversary?type=temai'
    //         })
    //       }
    //       break;
    //     case '/pages/homePage/miaosha/miaosha':
    //       if (allRoute.includes('pages/homePage/miaosha/miaosha')) {
    //         wx.navigateBack({
    //           delta: allRoute.length - allRoute.indexOf('pages/homePage/miaosha/miaosha') - 1
    //         })
    //       } else {
    //         wx.navigateTo({
    //           url: '/pages/homePage/miaosha/miaosha'
    //         })
    //       }
    //       break;

    //     case '/pages/homePage/juhuasuan/juhuasuan':
    //       if (allRoute.includes('pages/homePage/juhuasuan/juhuasuan')) {
    //         wx.navigateBack({
    //           delta: allRoute.length - allRoute.indexOf('pages/homePage/juhuasuan/juhuasuan') - 1
    //         })
    //       } else {
    //         wx.navigateTo({
    //           url: '/pages/homePage/juhuasuan/juhuasuan'
    //         })
    //       }
    //       break;
    //     case '/pages/homePage/anniversary/anniversary?title=1':
    //       if (allRoute.includes('pages/homePage/anniversary/anniversary')) {
    //         if (allRoute.length - allRoute.indexOf('pages/homePage/anniversary/anniversary') == 1) {
    //           console.log('重置页面')
           
    //           this.setData({
    //             title: 1
    //           },()=>{
    //             this.onShow()
    //           })
    //         } else {
    //           prevPage.setData({
    //             title: 1
    //           })
    //           wx.navigateBack({
    //             delta: allRoute.length - allRoute.indexOf('pages/homePage/anniversary/anniversary') - 1
    //           })
    //         }
    //       } else {
    //         wx.navigateTo({
    //           url: '/pages/homePage/anniversary/anniversary?title=1'
    //         })
    //       }
    //       break;
    //     case '/pages/homePage/anniversary/anniversary?title=2':
    //       if (allRoute.includes('pages/homePage/anniversary/anniversary')) {
    //         if (allRoute.length - allRoute.indexOf('pages/homePage/anniversary/anniversary') == 1) {
    //           console.log('重置页面')
    //           this.setData({
    //             title: 2
    //           }, () => {
    //             this.onShow()
    //           })
    //         } else {
    //           prevPage.setData({
    //             title: 2
    //           })
    //           wx.navigateBack({
    //             delta: allRoute.length - allRoute.indexOf('pages/homePage/anniversary/anniversary') - 1
    //           })
    //         }
    //       } else {
    //         wx.navigateTo({
    //           url: '/pages/homePage/anniversary/anniversary?title=2'
    //         })
    //       }
    //       break;
    //     default:
    //       break;
    //   }

    // }
  },
  ontoUpImgs() {
    app.handleJumpToTop();
   
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that,e.scrollTop )
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})