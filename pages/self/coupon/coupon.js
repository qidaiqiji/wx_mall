// pages/self/coupon/coupon.js
import api from '../../../utils/api.js'
const {
  couponCanTakeList
} = api
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: [],
    currentTab: 0,
    requestLock: false,
    groupList: [],
    isfixed: false,
    windowHeight: '0',
    topHeight: '' // 顶部广告为高度
  },
  switchTab: function (e) {
    this.setData({
      requestLock: true
    })
    var tab = e.currentTarget.dataset.current
    var pageSize = this.data.pageSize
    var typeList = this.data.typeList
    var currentPage = 1
    if (this.data.currentTab === tab) {
      return false
    } else {
      this.setData({
        currentTab: tab,

      }, () => {
        var type = ''
        if (tab == 0) type = ''
        if (tab == 1) type = typeList[1]
        if (tab == 2) type = typeList[2]
        if (tab == 3) type = typeList[3]
        couponCanTakeList({
          type
        }).then(res => {
          this.setData({
            ...res.data,
            requestLock: false
          });
          if (this.data.isfixed) {
            wx.pageScrollTo({
              scrollTop: 121,
              duration: 0,
            })
          }
        })
      })

    }
  },
  switchSwiper: function (e) {
    if (this.data.requestLock) {
      return false;
    }
    var tab = e.detail.current
    var pageSize = this.data.pageSize
    var typeList = this.data.typeList
    var currentPage = 1
    this.setData({
      currentTab: tab
    }, () => {
      var type = ''
      if (tab == 0) type = ''
      if (tab == 1) type = typeList[1]
      if (tab == 2) type = typeList[2]
      if (tab == 3) type = typeList[3]
      couponCanTakeList({
        type
      }).then(res => {
        this.setData({
          ...res.data,
          requestLock: false
        })
      })
    })


  },
  jumptoOWnCoupon() {
    wx.navigateTo({
      url: '/pages/self/ownCoupon/ownCoupon',
    })
  },
  onchangeType(e) {
    this.setData({
      couponList: this.data.couponList
    })
  },
  ongetCouponList(){
    couponCanTakeList({
      type: ''
    }).then(res => {
      this.windowHeight(res.data.couponList.length)
      this.setData({
        ...res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 节点信息
    const query = wx.createSelectorQuery()
    query.select('.title_img').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      that.setData({
        topHeight: res[0].height
      })
    })



    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo.version
    this.setData({
      imgHead,
      version
    })
    this.setData({
      bannerImg: imgHead + 'coupon/youhui_title.png?version=' + version
    })
    couponCanTakeList({
      type: ''
    }).then(res => {
      this.windowHeight(res.data.couponList.length)
      this.setData({
        ...res.data
      })
    })
  },
  windowHeight(e) {
    if (e >= 3) {
      var windowHeight = e * 242 + e * 20 + 338;
    } else {
      var windowHeight = e * 242 + e * 20;
    }
    this.setData({
      windowHeight,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  gundong(ev) {
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
  onPageScroll(e) {
    if (e.scrollTop >= this.data.topHeight) {
      if (this.data.isfixed) {} else {
        this.setData({
          isfixed: true
        })
      }

    } else {
      if (this.data.isfixed) {
        this.setData({
          isfixed: false
        })
      }
    };
    var that = this
    app.scrollRolling(that,e.scrollTop )
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  ontoUpImgs() {
    app.handleJumpToTop();
   
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (e) {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})