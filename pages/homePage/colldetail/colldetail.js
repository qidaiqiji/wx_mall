// pages/homePage/colldetail/colldetail.js
import api from '../../../utils/api.js'
const app = getApp()
const {
  getcolldetail
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop:false,
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
    getcolldetail({
      collId:options.collId
    }).then(res => {
      this.setData({
        ...res.data
      })
    }, function (error) {
      console.log('请求失败处理', error);
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  ontoUpImgs() {
    app.handleJumpToTop();
   
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that,e.scrollTop )
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