// pages/address/address.js
import api from '../../../utils/api.js'
const {
  $Message
} = require('../../../dist/base/index');
const {
  addressList,
  addressUpdate,
  addressDelete
} = api
const app = getApp();
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop: false,
    isShowDelete: false,
    addressId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      imgHead,
      version
    })

    this.setData({
      icom_add: imgHead + 'icom_add@2x.png?version=' + version
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
  onShow: function() {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
    addressList().then(Res => {
      this.setData({
        ...Res.data
      })
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
  handleConfirmAddr(e) {
    var pages = getCurrentPages(); // 获取页面栈
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    var prevPage = pages[pages.length - 2];
    if (pages[0].route !== 'pages/my/my') {
      prevPage.setData({
        addressId: e.currentTarget.dataset.addressid
      })

      wx.navigateBack({
        delta: 1 // 返回上一级页面。
      })
    } else {
      return false
    }
  },
  onChangeAddr(e) {
    var addressItem = e.currentTarget.dataset.addressitem
    if (addressItem.isDefault) {
      return false;
    } else {
      addressItem.isDefault = true
    }
    //isDefault  默认地址的改变
    addressUpdate({
      ...addressItem
    }).then(res => {
      if (res.code === 0) {
        addressList().then(Res => {
          this.setData({
            ...Res.data
          })
        })
      }
    })
  },
  onEditAddr: throttle(function (e) {
      wx.navigateTo({
        url: '/pages/aboutCart/address/edit_address/index?addressitem=' + JSON.stringify(e.currentTarget.dataset.addressitem) + '&addressId=' + e.currentTarget.dataset.addressid,
      })
    }
  ),
  onDeleteAddr(e) {
    this.setData({
      isShowDelete: true,
      addressId: e.currentTarget.dataset.addressid
    })
  },
  deleteMask_no() {
    this.setData({
      isShowDelete: false,
      addressId: ''
    })
  },
  deleteMask_yes(e) {
    addressDelete({
      addressId: this.data.addressId
    }).then(res => {
      if (res.code == 0) {
        app.onToast(res.msg)
        addressList().then(Res => {
          this.setData({
            ...Res.data
          })
        })
      } else if (res.code == 1) {
        app.onToast(res.msg)
      }
    }).catch(fail => {
      console.log(fail)
    })
    this.setData({
      isShowDelete: false,
      addressId: '',
    })
  },
  handleAddAddress() {
    wx.navigateTo({
      url: '/pages/aboutCart/address/edit_address/index'
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})