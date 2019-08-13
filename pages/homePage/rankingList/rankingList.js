// pages/homePage/rankingList/rankingList.js
import api from '../../../utils/api.js'
const {
  paihangIndex
} = api
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop:false,
    isShow:false
  },
  handleToBuy(e) {
    this.setData({
      isPopCart: true,
      addGoodsId: e.currentTarget.dataset.goodsid,
      addGoodslist: e.currentTarget.dataset.goodslist
    })


    if (this.data.isPopCart) {
      this.selectComponent("#addCart").showModal();

    }
  },
  onhideCart(e) {
    var that = this
    app.onhideCart(that, e)
  },
  ongetTotle(e) {
    this.setData({
      totalCounts: e.detail.totalCount
    })
  },
  jumpToGoodsDetail(e) {
    wx.navigateTo({
      url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid,
    })
  },
  jumpToRankingDetail(e) {
    wx.navigateTo({
      url: '/pages/homePage/rankingDetail/rankingDetail?id=' + e.currentTarget.dataset.id,
    })
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
     paihangIndex().then(res => {
      this.setData({
        ...res.data,
        isShow:true
      });

    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})