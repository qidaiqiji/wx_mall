// pages/self/integral/integralDataDetail/integralDataDetail.js
import api from '../../../../utils/api.js'
const app = getApp()
// import { finished } from 'stream';
const {
  getExchangeDetail
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop:false,
    nav: ['全部', '收入积分', '支出积分'],
    currentItem: 0,
    requestLock: false,
    isLoadings:false,
    reachTheBottom:false,
    page:1,
    pageSize:10,
    integralList:[],
  },
  handleNavItem(e) {
    if (this.data.currentItem == e.currentTarget.dataset.index) {
      return false
    } else {
      this.setData({
        currentItem: e.currentTarget.dataset.index,
        page:1,
        requestLock: false,
        isLoadings: false,
        reachTheBottom: false,
        integralList: [],
      }, () => {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
        let page = this.data.page
        this.getIntegralList(page)
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ...options
    })
    let page = this.data.page
    this.getIntegralList(page)
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
    if (this.data.requestLock) {
      return false
    }
    let page = this.data.page + 1
    this.getIntegralList(page)
  },
  getIntegralList(page) {
    getExchangeDetail({
      type: this.data.currentItem,
      page,
      pageSize:this.data.pageSize
    }).then(res => {
      let allData = this.data.integralList.concat([], ...res.data.integralList)
      if (res.data.integralList.length < this.data.pageSize) {
        this.setData({
          integralList: allData,
          reachTheBottom: allData.length > 0 ? true : false,
          isLoadings: false,
          requestLock: true,
        })
      } else {
        this.setData({
          integralList: allData,
          reachTheBottom: false,
          isLoadings: true,
          requestLock: false,
          page
        })
      }
    }).catch(fail => {
      this.setData({
        requestLock: false
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})