import api from '../../../utils/api.js'
const {
  queryShipping,
  shippingList
} = api

Page({

  data: {
    isShowIndex: null
  },
  handleIsShow(e) {
    var isShowIndex = e.currentTarget.dataset.index
    var deliveryId = e.currentTarget.dataset.deliveryid
    var index = e.currentTarget.dataset.index + 1



    if (isShowIndex == this.data.isShowIndex) {
      isShowIndex = null
    }
    this.setData({
      isShowIndex,
    })
    queryShipping({
      deliveryId
    }).then(res => {
      this.setData({
        ...res.data,
        [index]: index
      }, () => {
        const shippingInfoList = this.data.shippingInfoList
        if (shippingInfoList && shippingInfoList.length > 1) {
          var start = shippingInfoList.pop()
          var end = shippingInfoList.shift()
          this.setData({
            start,
            shippingInfoList,
            end
          })
        } else if (shippingInfoList && shippingInfoList.length == 1) {
          var start = shippingInfoList
          this.setData({
            start
          })
        }
      })
    })


  },
  onLoad: function (options) {
    shippingList({
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