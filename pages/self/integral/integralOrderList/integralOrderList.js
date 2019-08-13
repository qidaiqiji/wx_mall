// pages/self/integral/integralOrderList/integralOrderList.js
import api from '../../../../utils/api.js'
const app = getApp()
// import { finished } from 'stream';
const {
  getExchangeOrderList
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getExchangeOrderList({

    }).then(res => {
      this.setData({
        ...res.data
      })
    }).catch(fail => {
      console.log(fail)
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
  ontoUpImgs() {
    app.handleJumpToTop();
   
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that,e.scrollTop )
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