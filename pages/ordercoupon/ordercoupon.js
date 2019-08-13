// pages/ordercoupon/ordercoupon.js
import api from '../../utils/api.js'
const {

} = api
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: '0',
    requestLock: false,
    mycouponList: '', //父组件传递的参数
    couponList: "", //传给子组件参数
    couponId: '',
    reduceprice: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.couponId) {
      this.setData({
        couponId: options.couponId,
        reduceprice: options.reduceprice,
      });
    }
    var mycouponList = JSON.parse(options.couponList)
    mycouponList.canUse.forEach(item => {
      item.status = 0
    })
    mycouponList.canNotUse.forEach(item => {
      item.status = 2
    })

    this.setData({
      mycouponList,
    });
    // 图片
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo.version
    this.setData({
      not_coupon: imgHead + 'coupon/not_coupon.png?version=' + version
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},



  checkid(e) {
    var couponId = e.detail.couponId && e.detail.couponId;
    var reduceprice = e.detail.reduceprice && e.detail.reduceprice;
    if (!!couponId) {
      this.setData({
        couponId,
        reduceprice,
      });
    } else {
      this.setData({
        couponId: -1,
        reduceprice,
      });
    }
  },
  jumpToCoupon(e) {

    var pages = getCurrentPages(); // 获取页面栈
    var prevPage = pages[pages.length - 2];
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。

    prevPage.setData({
      couponId: this.data.couponId,
      reduceprice: this.data.reduceprice
    })
    wx.navigateBack({
      delta: 1 // 返回上一级页面。
    })
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