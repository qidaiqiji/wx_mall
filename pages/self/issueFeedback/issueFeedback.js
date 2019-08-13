// pages/self/issueFeedback/issueFeedback.js
import api from '../../../utils/api.js'
const { userService } = api
const app= getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isContent:false
  },
  bindFormSubmit(e) {
    if (e.detail.value.textarea){

      userService({
        content: e.detail.value.textarea
      }).then(res=>{
        app.onToast(res.msg)
      }).catch(fail=>{
        app.onToast('后台出现问题，请联系客服')
      })
    }else{
      app.onToast('请输入文本内容后提交')
    }
  },
  changeInput(e){
    if (e.detail.value) {
      this.setData({
        isContent: true
      })
    }else{
      this.setData({
        isContent: false
      })
    }
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