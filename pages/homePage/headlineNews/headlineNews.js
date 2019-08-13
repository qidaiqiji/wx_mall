// pages/headlineNews/headlineNews.js
import api from '../../../utils/api.js'
const {
  articleNotifyList
} = api
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRepetition:true,
    toTheTop: false,
    page:1,
    pageSize:10,
    articles:[],
    reachTheBottom:false

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
  getList(page){
    if (!this.data.requestLock) {
      this.data.requestLock = true
      let pageSize = +this.data.pageSize
      let allData = this.data.articles
    articleNotifyList({ page,pageSize }).then(res => {
      if (res.code == 0) {
        let articles = res.data.articles && res.data.articles.map(item => {
          console.log(item.addTime.split(' '))
          if (item.addTime) {
            let times = item.addTime.split(' ')
            if (new Date().getDate() - new Date(times[0]).getDate() == 0) {
              item.date = '';
              item.time = times[1]
            } else if (new Date().getDate() - new Date(times[0]).getDate() == 1) {
              item.date = '昨天'
              item.time = times[1]
            } else {
              item.date = times[0]
              item.time = times[1]
            }
          }
          return item
        })
        allData = allData.concat([], ...articles)
        if (articles.length < pageSize) {
          this.setData({
            articles: allData,
            page,
            requestLock: true,
            reachTheBottom: true,
          })
        } else {
          this.setData({
            articles: allData,
            page,
            requestLock: false,
            isRepetition: false,
          })
        }
      } else {
        this.setData({
          isRepetition: true,
          requestLock: false,
        })
      }
    }).catch(fail => {
      this.setData({
        requestLock: false,
        isRepetition: true
      })
    })
    }
  },
  onShow: function () {
    if(this.data.isRepetition){
      let page = +this.data.page
      this.getList(page)
    }

  },
  jumpToDetail(e){

    if (e.currentTarget.dataset.url.indexOf('pages')!=-1){
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }else{
    wx.navigateTo({
      url: `/pages/webView/webView?headlineNews=${e.currentTarget.dataset.url}`,
     })
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
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  onPageScroll(e){
    var that = this
    app.scrollRolling(that, e.scrollTop)
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
    let page = +this.data.page+1
    this.getList(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})