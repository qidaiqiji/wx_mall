// pages/self/ownCoupon/ownCoupon.js
import api from '../../../utils/api.js'
const {
  couponReceivedList
} = api
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop:false,
    statusType: ['未使用(0)', '已使用(0)', '已过期(0)'],
    currentTab: 0,
    requestLock: false,
    pageSize: 20,
    couponList: []
  },
  switchTab: function (e) {
    console.log('点击上部tabs')
    this.setData({
      requestLock: true
    })
    var tab = e.currentTarget.dataset.current
    var pageSize = this.data.pageSize
    var currentPage = 1
    if (this.data.currentTab === tab) {
      return false
    } else {
      this.setData({
        currentTab: tab
      }, () => {

        couponReceivedList({
          status: tab,
          currentPage,
          pageSize
        }).then(res => {
          this.setData({
            ...res.data,
            requestLock: false,
            currentPage
          })
        })
      })

    }
  },
  switchSwiper: function (e) {
    if (this.data.requestLock) {
      return false;
    } else {
      var tab = e.detail.current
      var pageSize = this.data.pageSize
      var currentPage = 1
      this.setData({
        currentTab: tab
      }, () => {
        couponReceivedList({
          status: tab,
          currentPage,
          pageSize
        }).then(res => {
          this.setData({
            ...res.data,
            requestLock: false,
            currentPage
          })
        })
      })
    }

  },
  jumpToCoupon() {
    wx.navigateTo({
      url: '/pages/self/coupon/coupon',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'options');

      const imgHead = app.globalData.imgHead
      const version = app.globalData.userInfo.version
      this.setData({
        imgHead,
        version,
      not_coupon: imgHead+'coupon/not_coupon.png?version='+version
      })  
        couponReceivedList().then(res => {
          console.log(res)
          var statusType = this.data.statusType
  
          this.setData({
            ...res.data
          }, () => {
            var couponCountMap = this.data.couponCountMap
            statusType[0] = statusType[0].replace('0', couponCountMap.unusedNum);
            statusType[1] = statusType[1].replace('0', couponCountMap.usedNum);
            statusType[2] = statusType[2].replace('0', couponCountMap.expiredNum);
            this.setData({
              statusType
            })
          })
        })
      
    


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var windowHeight = app.globalData.appHeight - 60;
    this.setData({
      windowHeight,
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
  ontoUpImgs() {
    app.handleJumpToTop();
   
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that,e.scrollTop )
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