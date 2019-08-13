// pages/preferential/preferential.js
const {
  $Toast
} = require('../../../dist/base/index');
const app = getApp()
const throttle = app.throttle
import api from '../../../utils/api.js'
const {
  actPage
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPageId: '',
    topBg: '',
    reachTheBottom: '已经到底了',
    isPopCart: false,
    goGoodsList: '',
    ishide: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.userType()
    const imgHead = app.globalData.imgHead;
    const version = app.globalData.userInfo && app.globalData.userInfo.version;
    this.setData({
      topBg: imgHead + 'img_bg@2x.png?version=' + version,
      img_quan: imgHead + 'img_quan.png?version=' + version,
      img_quan_ling: imgHead + 'img_quan_ling.png?version=' + version,
    });
    console.log(options.pageId, 'options')
    const scene = decodeURIComponent(options.scene);
    console.log(scene, 'scene');
    if (scene == 'undefined') {
      var pageId = options.pageId
    } else {
      var splitArr = scene.split('=');
      console.log(splitArr)
      var pageId = splitArr[1]
    }
    console.log(pageId, '+5555')
    actPage({
      pageId: pageId
    }).then(res => {
      this.setData({
        ...res.data,
        isPageId: pageId
      })
    }).catch(fail => {
      console.log(fail)
    })
  },
  goAdvertising: throttle(function (e) {
    app.adSpaceJump(e.currentTarget.dataset.item)
  }),
  onUpMenus(e) {
    var pageId = e.detail.pageId;
    this.setData({
      ishide: false
    })
    actPage({
      pageId: pageId
    }).then(res => {
      this.setData({
        ...res.data,
        isPageId: pageId,
      })
    })

  },
  allPreferential(e) {
    var id = e;
    this.setData({
      ishide: true
    });
  },
  onallPreferential() {
    this.setData({
      ishide: false
    })
  },
  ontoUpImgs() {
    app.handleJumpToTop();
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

  allremind(e) {
    var id = e;
    this.setData({
      ishide: true
    })
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
  onPageScroll(e) {
    if (e.scrollTop <= 1) {
      this.setData({
        isSearch: false
      })
    } else {
      if (!this.data.isSearch) {
        this.setData({
          isSearch: true
        })
      }
    }

    var that = this
    app.scrollRolling(that, e.scrollTop)
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