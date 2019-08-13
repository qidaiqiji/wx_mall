// pages/blackCard/blackCard.js
const app = getApp()
const throttle = app.throttle
import api from '../../utils/api.js'
const {
  activityBlackCardRule
} = api
var WxParse = require('../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHead: '',
    version: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      bgRules: imgHead + 'activeDirectory/bgRules.png?version=' + version,
      card: imgHead + 'activeDirectory/card.png?version=' + version,
    });
    activityBlackCardRule({}).then(res => {
      if (res.data.ruleText) {
        this.ruleText(res.data.ruleText)
      }

    })
  },
  ruleText(ruleText) {
    var article = ruleText
    WxParse.wxParse('article', 'html', article, this, 5);
  },
  goMainVenue: throttle(function () {
    wx.navigateTo({
      url: '/pages/activeDirectory/midYearActivities/midYearActivities'
    })
  }),
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