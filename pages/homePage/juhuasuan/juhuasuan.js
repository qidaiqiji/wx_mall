// pages/juhuasuan/juhuasuan.js
import api from '../../../utils/api.js'

const app =getApp()
const throttle = app.throttle
const {
  getjuhuasuan
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop:false,
    imgHead:'',
    version:'',
    imgBanner:'',
    isPageId: 'pages/homePage/juhuasuan/juhuasuan',
    isShowNavigation: false,
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
  onLoad: function(options) {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo&&app.globalData.userInfo.version
    this.setData({
      imgHead,
      version
    })
    getjuhuasuan({}).then(res => {
      this.setData({
        ...res.data,
        imgBanner: imgHead + 'img_banner.png?version=' + version,  
      })
    }).catch(fail=>{
      console.log(fail)
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  ontoUpImgs() {
    app.handleJumpToTop();
   
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that,e.scrollTop )
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
    }
    this.setData({
      menus: wx.getStorageSync('menus'),
      isActTime: wx.getStorageSync('isInActivity')
    })
  },
  handleShowNavigation() {
    this.setData({
      isShowNavigation: true
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
    let index = e.detail.index
    let initIsPageId = this.data.isPageId
    app.handleNavMenu( initIsPageId, this,index)
   
  },
  goAdvertising: throttle(function (e) {
    app.adSpaceJump(e.currentTarget.dataset.item)
  }),
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
  onPullDownRefresh: function(e) {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(e) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})