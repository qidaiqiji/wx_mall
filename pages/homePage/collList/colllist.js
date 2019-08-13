// pages/homePage/colllist.js
import api from '../../../utils/api.js'
const {
  getcolllist
} = api;
const app = getApp();
const throttle = app.throttle;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop:false,
    isShowBottom:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getcolllist({
    }).then(res => {
      this.setData({
        ...res.data,
        isShowBottom:true
      })
    })
  },
  collListurl(e){
    var collid=e.currentTarget.dataset.collid
    wx.navigateTo({
      url: '../colldetail/colldetail?collId='+collid
    })
  },
  showListdetails(e) {
    var goodsId=e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '/pages/goods/product/product?goodsId='+goodsId,
      success: function(res){
        console.log(res)
      },
      fail: function(error) {
        console.log(error)
      }
    })
  } ,
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
  goAdvertising: throttle(function (e) {
    app.adSpaceJump(e.currentTarget.dataset.item)
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