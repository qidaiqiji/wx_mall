// pages/myCollection/myCollection.js
const app = getApp();
const throttle = app.throttle;
import api from '../../../utils/api.js';
const {
  foundCollectList,
  foundCollect,
  foundCancleCollect,
} = api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
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
    foundCollectList().then(res => {
      if (res.code== 0) {
        res.data.collectList.forEach(element => {
          var date = element.publishTime.substring(0, 10).replace(/\//g, "-");
          element.publishTimeTwo = date
        });
      }
      app.globalData.goNewPages = true
      this.setData({
        ...res.data
      })
    })
  },
  jumpToDetail: throttle(function (e) {
    wx.navigateTo({
      url: '/pages/foundTxt/foundTxt?articleId=' + e.currentTarget.dataset.articleid,
    })
  }),
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  // 收藏
  collection: throttle(function (e) {
    var isCollect = e.currentTarget.dataset.iscollect;
    var articleId = e.currentTarget.dataset.articleid;
    // 判断是不是取消 1收藏 0未收藏
    if (isCollect == 0) {
      foundCollect({
        articleId
      }).then((res) => {
        this.isCollection(res.msg, articleId, 1)
      })
    } else if (isCollect == 1) {
      foundCancleCollect({
        articleId
      }).then((res) => {
        this.isCollection(res.msg, articleId, 0)

      })
    }
  }),
  isCollection(msg, articleId, isCollect) {
    app.onToast(msg);
    var foundList = this.data.collectList;
    foundList.forEach(element => {
      if (element.articleId == articleId) {
        element.isCollect = isCollect
      }
    });
    this.setData({
      collectList: foundList,
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