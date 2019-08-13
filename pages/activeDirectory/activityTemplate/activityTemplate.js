// pages/activeDirectory/activityTemplate/activityTemplate.js
const {
  $Toast
} = require('../../../dist/base/index');
import api from '../../../utils/api.js'
const {
  getActivityLevelb
} = api
const app = getApp();
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRemindShow:false,
    isPopCart: false,
    pageId: '',
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
    console.log(this.data)
    getActivityLevelb({
      pageId: this.data.pageId
    }).then(res => {
      this.setData({
        ...res.data,
        viewColor: res.data.bgColor,
      })
      wx.setNavigationBarTitle({
        title: res.data.name,
      })
      wx.setBackgroundColor({
        backgroundColor: res.data.bgColor,
      })
      console.log(res, '数据')
    })
  },
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  onevokeAddCart(e) {
    var that = this;
    console.log(e)
    app.onevokeAddCart(that, e)
  },
  onhideCart(e) {
    var that = this
    that.setData({
      isPopCart: false
    }, () => {
      if (e.detail && e.detail.msg) {
        $Toast({
          content: e.detail.msg
        });
      }

    })


  },
  handleJump: throttle(function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.adlink
    })
  }),
  handleGuideText: throttle(function (e) {
    this.setData({
      isRemindShow: true
    })
  }),
  onMyshow(){
    this.setData({
      isRemindShow: false
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
  ongetTotle(e) {
    this.setData({
      totalCounts: e.detail.totalCount
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
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