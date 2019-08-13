// pages/paySuccess/paySuccess.js
import api from '../../../utils/api.js'
const { orderGroupPayDone } = api 
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_discount: '',
    arr: ['1', '2']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  lookOrder() {
    wx.navigateTo({
      url: '/pages/order/allOrders/allOrders?status=' + '',
    })
  },
  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onLoad: function (options) {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo.version
    this.setData({
      imgHead,
      version,
      gift_title: imgHead + 'paySuccess/gift_title.png?version=' + version,
      img_discount: imgHead + 'paySuccess/img_discount.png?version=' + version,
    })
    // groupid
    orderGroupPayDone({
      ...options
    }).then(res => {
      this.setData({
        ...res.data
      })
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
  myCoupon() {
    wx.navigateTo({
      url: '/pages/self/ownCoupon/ownCoupon',
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
