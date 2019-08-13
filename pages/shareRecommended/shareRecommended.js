// pages/shareRecommended/shareRecommended.js
const app = getApp();
const throttle = app.throttle;
import api from '../../utils/api.js';
const {
  hotGoodsIndex
} = api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    relayImg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ...options
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
  },
  save: throttle(function () {
    wx.getImageInfo({
      src: this.data.relayImg,
      success(sres) {
        wx.getSetting({
          success(res) {
            wx.saveImageToPhotosAlbum({
              filePath: sres.path,
              success(res) {
                app.onToast('保存成功，可以在微信里分享啦~');
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 2
                  })
                }, 3000)
              },
              fail() {
                console.log('保存失败')
              }
            })
          }
        })
      },
      fail(res) {
        console.log(res,'下载失败')
      }
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