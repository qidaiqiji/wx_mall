// pages/search/search.js
import api from '../../utils/api.js'
const {
  goodsHotKeywords,
  goodsHistoryKeywords,
  goodsHistoryKeywordsDelete,
  goodsList
} = api

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRemoveBlur:false,
    kind: '',
    isid: '',
    isShow_icon_search_delete: false,
    value: '',
    hotKeywords: [],
    historyKeywords: [],
    baseOfColor: '',
    hezi:'',
  },
  onSearchtxt(e) {
    if (e.detail.value) {
      this.setData({
        isShow_icon_search_delete: true,
        value: e.detail.value
      })
    } else {
      this.setData({
        isShow_icon_search_delete: false,
        value: ''
      })
    }
  },
  handleIconSearchDelete() {
    this.setData({
      isRemoveBlur:true, 
      isShow_icon_search_delete: false,
      value: '',
      baseOfColor: '',
    }, () => {
      this.removeBlur()
    })
  },
  removeBlur(e) {
    if(this.data.isRemoveBlur){
      this.setData({
        isShow_icon_search_delete: false,
        value: '',
        baseOfColor: '',
      }, () => {
        this.setData({
          isRemoveBlur:false
        })
      })
    }
  },
  handleCancel(e) {
    // 取消搜索
    var pages = getCurrentPages(); // 获取页面栈
    var prevPage = pages[pages.length - 2];
    if (prevPage.route == 'pages/index/index') {
      wx.switchTab({
        url: '/' + prevPage.route,
        success: (res) => {
          this.setData({
            isShow_icon_search_delete: false,
            value: ''
          })
        }
      })
    } else if (prevPage.route == 'pages/classify/classify') {
      wx.switchTab({
        url: '/' + prevPage.route,
        success: (res) => {
          this.setData({
            isShow_icon_search_delete: false,
            value: ''
          })
        }
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }

  },
  handleDelete_history() {
    goodsHistoryKeywordsDelete().then(res => {
      this.setData({
        historyKeywords: []
      })
    })
  },
  handleKeywords(e) {
    var supplierUserId = '';
    var brandIdsList = [];
    var tag = [];
    var tags = ''
    this.setData({
      value: e.currentTarget.dataset.keywords
    })

    if (this.data.kind && this.data.kind == 'zhifa') {
      supplierUserId = '&supplierUserId=1257'
    } else if (this.data.kind == 'pinpai') {
      brandIdsList.push(this.data.isid);
      brandIdsList = '&brandIdsList=' + brandIdsLists;
    } else if (this.data.kind == 'zhifaCd') {
      tag.push(7);
      tags = '&tags=' + tag;
      wx.navigateTo({
        url: '/pages/goods/goodsLists/goodsLists?keywords=' + e.currentTarget.dataset.keywords + tags+'&hezi='+this.data.hezi
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/goods/goodsLists/goodsLists?keywords=' + e.currentTarget.dataset.keywords + supplierUserId + brandIdsList + tags+'&hezi='+this.data.hezi
    })


  },
  onConfirm() {
    var value = this.data.value ? this.data.value : this.data.baseOfColor
    var supplierUserId = '';
    var brandIdsList = [];
    var brandIdsLists = ''
    var tag = [];
    var tags = ''
    if (this.data.kind) {
      if (this.data.kind == 'zhifa') {
        supplierUserId = '&supplierUserId=1257'
      } else if (this.data.kind == 'pinpai') {
        brandIdsList.push(this.data.isid);
        brandIdsList = '&brandIdsList=' + brandIdsList;
      } else if (this.data.kind == 'zhifaCd') {
        tag.push(7);
        tags = '&tags=' + tag;
      }
    }
    var pages = getCurrentPages() //获取加载的页
    var prevPage = pages[pages.length - 2];
    if (prevPage && prevPage.route == 'pages/goods/goodsLists/goodsLists') {
      prevPage.setData({
        keywords: value,
        tags,
        supplierUserId,
        brandIdsList,

      })
      wx.navigateBack({
        delta: 1
      })
      return false
    } else {
      wx.navigateTo({
        url: '/pages/goods/goodsLists/goodsLists?keywords=' + value + tags + supplierUserId + brandIdsList+'&hezi='+this.data.hezi
      })
    }

  },
  onHide() {
    this.setData({
      currentTab: ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({
      ...options,
      baseOfColor: options.keywords && decodeURI(decodeURI(options.keywords, "UTF-8"), "UTF-8"),
    })
    goodsHotKeywords().then(res => {
      this.setData({
        hotKeywords: res.data.keywords
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
    goodsHistoryKeywords().then(res => {
      this.setData({
        historyKeywords: res.data.keywords
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      baseOfColor: ''
    })
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