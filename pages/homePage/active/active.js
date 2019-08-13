// pages/homePage/active/active.js
import api from '../../../utils/api.js'
const {
  activityTravel,
  couponTake
} = api
const app = getApp()
Page({

  /**
   * 页面的初始数据isShow
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    activityTravel().then(res => {
      this.setData({
        ...res.data
      },()=>{
        this.setData({
          isShow:true
        })
      })
    })
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo.version
    this.setData({
      quan_120: imgHead + 'activity/120.png?version=' + version,
      quan_280: imgHead + 'activity/280.png?version=' + version,
      banner_img: imgHead + 'activity/Banner.png?version=' + version,
      duomai_title: imgHead + 'activity/duomai_title.png?version=' + version,
      maisong_title: imgHead + 'activity/maisong_title.png?version=' + version,
      miaosha_title: imgHead + 'activity/miaosha_title.png?version=' + version,
      more: imgHead + 'activity/more.png?version=' + version,
      quanchang: imgHead + 'activity/quanchang.png?version=' + version,
      taocan_title: imgHead + 'activity/taocan_title.png?version=' + version,
      coupon_title: imgHead + 'activity/coupon_title.png?version=' + version,
      temai_title: imgHead + 'activity/temai_title.png?version=' + version,
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
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
  },
  jumpToUrl(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  getCoupon(e) {
    couponTake({ ruleId: e.currentTarget.dataset.id }).then(res => {
      app.onToast(res.msg)
    })
  },
  ongetTotle(e) {
    this.setData({
      totalCounts: e.detail.totalCount
    })
  },
  ontoUpImgs() {
    app.handleJumpToTop();

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