// pages/activeDirectory/midYearActivities/midYearActivities.js
import api from '../../../utils/api.js'
const {
  midYearActivities
} = api
const app = getApp()
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    temaiScrollTop:0,
    isShowNavigation:false,
    isPageId:'pages/activeDirectory/midYearActivities/midYearActivities',
    type:'',
    isActTime:false,
    menus:[],
    isShowBackTop:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ...options
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
    console.log('进了ONSHOW')


    if (this.data.type == 'temai') {
      this.setData({
        isPageId: 'pages/activeDirectory/midYearActivities/midYearActivities?type=temai'
      })
    }else{
      this.setData({
        isPageId: 'pages/activeDirectory/midYearActivities/midYearActivities'
      })
    }
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
    }


    if (!this.data.reacquire) {
      const imgHead = app.globalData.imgHead
      const version = app.globalData.userInfo && app.globalData.userInfo.version
      console.log(app.globalData)
      this.setData({
        seconds_kill: imgHead + 'activity/seconds_kill.png?version=' + version,
        juhuasuan: imgHead + 'midYearActivities/juhuasuan.png?version=' + version,
        manzeng: imgHead + 'midYearActivities/manzeng.png?version=' + version,
        taocan: imgHead + 'midYearActivities/taocan.png?version=' + version,
        temai: imgHead + 'midYearActivities/temai.png?version=' + version,
        xingGG: imgHead + 'midYearActivities/xingGG.png?version=' + version,
        huofan_bg: imgHead + 'activeDirectory/huofan_bg.png?version=' + version,

      })
    }
    midYearActivities().then(res => {
      console.log(res)
      var flashSaleList = res.data.flashSaleList;
      var flashSaleListOne = flashSaleList.shift();
      console.log(wx.getStorageSync('menus'), '33333333')
      this.setData({
        reacquire: true,
        ...res.data,
        flashSaleListOne,
          menus: wx.getStorageSync('menus'),
          isActTime: wx.getStorageSync('isInActivity'),
          isShowBackTop:true
      }, () => {
        var query = wx.createSelectorQuery()
        query.select('.temai').boundingClientRect((res) => {
          if (res && res.top) {
            if (this.data.type == 'temai') {
              console.log('走了这里')
              wx.pageScrollTo({
                scrollTop: res.top,
                duration: 0,
              })
            }
            console.log('有topzhi')
            this.setData({
              temaiScrollTop: res.top,
            })
          }

        }).exec()

      })
    }).catch(fail => {
      this.setData({
        reacquire: false
      })
    })

  },
  allremind() {
    console.log('点击了导航')
    this.setData({
      isShowNavigation: true
    })
  },
  onallPreferential() {
    this.setData({
      isShowNavigation: false
    })
  },
  goToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  handleJump: throttle(function (e) {
    var item = e.currentTarget.dataset.item
    app.adSpaceJump(item)
  }),
  jumpToDetail: throttle(function (e) {
    var goodsId = e.currentTarget.dataset.goodid
    app.appProduct(goodsId)
  }),
  onevokeAddCart(e) {
    var that = this
    app.onevokeAddCart(that, e)
  },
  onhideCart(e) {
    var that = this
    app.onhideCart(that, e);
  },
  ongetTotle(e) {
    console.log(e)
    this.setData({
      totalCounts: e.detail.totalCount
    })
  },
  jumpToPage(e) {

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
    switch (e.currentTarget.dataset.page) {
      case 'miaosha':
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

      case 'juhuasuan':
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
      case 'manzeng':
        if (allRoute.includes('pages/homePage/anniversary/anniversary')) {
          prevPage.setData({
            title: 1
          })
          wx.navigateBack({
            delta: allRoute.length - allRoute.indexOf('pages/homePage/anniversary/anniversary') - 1
          })
        } else {
          wx.navigateTo({
            url: '/pages/homePage/anniversary/anniversary?title=1'
          })
        }
        break;
      case 'taocan':
        if (allRoute.includes('pages/homePage/anniversary/anniversary')) {
          prevPage.setData({
            title: 2
          })
          wx.navigateBack({
            delta: allRoute.length - allRoute.indexOf('pages/homePage/anniversary/anniversary') - 1
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


  },
  handleMenus(e) {
    this.setData({
      isShowNavigation: false
    })
    let intoPageId = e.detail.pageId
    let index = e.detail.index
    let initIsPageId = this.data.isPageId
    app.handleNavMenu(initIsPageId,this,index)

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      flashSaleEndTime:''
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})