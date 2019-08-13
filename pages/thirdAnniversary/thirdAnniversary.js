// pages/thirdAnniversary/thirdAnniversary.js
import api from '../../utils/api.js'
const {
  activityThreeYear,
  couponTake
} = api
const app = getApp()
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reacquire: false,
    isShowNavigation:false,
    menus: [{ name: '主会场', sellingPoint: '', pageId:'/pages/thirdAnniversary/thirdAnniversary'}
      , { name: '秒杀会场', sellingPoint: '爆款直击底价', pageId: '/pages/homePage/miaosha/miaosha' }
      , { name: '特卖专场', sellingPoint: '单品直降特惠', pageId: '/pages/thirdAnniversary/thirdAnniversary?type=temai' }
      , { name: '巨划算会场', sellingPoint: '门店必备聚惠', pageId: '/pages/homePage/juhuasuan/juhuasuan'}
      , { name: '满赠会场', sellingPoint: '最高再享7.5折', pageId: '/pages/homePage/anniversary/anniversary?title=1'  }
      , { name: '套餐会场', sellingPoint: '最高立省199元', pageId: '/pages/homePage/anniversary/anniversary?title=2'  }
     ],
    isPageId: '/pages/thirdAnniversary/thirdAnniversary',
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
    if (this.data.type == 'temai') {

      this.setData({
        isPageId: '/pages/thirdAnniversary/thirdAnniversary?type=temai'
      })
    }
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
    }

    if (!this.data.reacquire){
      const imgHead = app.globalData.imgHead
      const version = app.globalData.userInfo && app.globalData.userInfo.version
      this.setData({
        imgHead,
        version
      })
      this.setData({
        banner: imgHead + 'anniversary/banner.png?version=' + version,
        choujiang_title: imgHead + 'anniversary/choujiang_title.png?version=' + version,
        ganen_liquan: imgHead + 'anniversary/ganen_liquan.png?version=' + version,
        guoji_xinggg: imgHead + 'anniversary/guoji_xinggg.png?version=' + version,
        jifen_choujiang: imgHead + 'anniversary/jifen_choujiang.png?version=' + version,
        jingxuan_taocan: imgHead + 'anniversary/jingxuan_taocan.png?version=' + version,
        juhuasuan: imgHead + 'anniversary/juhuasuan.png?version=' + version,
        backTop: imgHead + 'anniversary/backTop.png?version=' + version,
        pinpai_baoyou: imgHead + 'anniversary/pinpai_baoyou.png?version=' + version,
        quanchang_manzeng: imgHead + 'anniversary/quanchang_manzeng.png?version=' + version,       
        temai_zhuanchang: imgHead + 'anniversary/temai_zhuanchang.png?version=' + version,
        chaozhi_manzeng: imgHead + 'anniversary/chaozhi_manzeng.png?version=' + version,
        xianshi_miaosha: imgHead + 'anniversary/xianshi_miaosha.png?version=' + version,
      })
    }
      activityThreeYear().then(res => {
        this.setData({
          reacquire: true,
          ...res.data,
        },()=>{
          var query = wx.createSelectorQuery()
          query.select('.anniverSary_tem').boundingClientRect( (res)=> {
            if(res&&res.top){
              if (this.data.type == 'temai') {
                wx.pageScrollTo({
                  scrollTop: res.top,
                  duration: 0,
                })
              }
              this.setData({
                temaiScrollTop: res.top
              })
            }

          }).exec()

        })
      }).catch(fail=>{
        this.setData({
          reacquire:false
        })
      })
  
  },
  handleGetCoupon(e){
    // 领券
    couponTake({ ruleId: e.currentTarget.dataset.ruleid}).then(res=>{
      app.onToast(res.msg)
    })
  },
  jumpToUrl(e){
      wx.navigateTo({
        url:e.currentTarget.dataset.url
      })
  },
  jumpToPage(e){

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
  jumpToGoodsDetail(e){
    wx.navigateTo({
      url: `/pages/goods/product/product?goodsId=${e.currentTarget.dataset.goodsid}`,
    })
  },
  jumpToTop(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration:0
    })
  },
  handleShowNavigation(){
    this.setData({
      isShowNavigation:true
    })
  },
  onallPreferential() {
    this.setData({
      isShowNavigation: false
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})