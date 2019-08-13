// pages/remindlist/remindlist.js
import api from '../../../utils/api.js'
const app = getApp()
const {
  getremindlist,
  noremovdremind
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop: false,
    lists: [{
        name: "已到货",
        page: 0
      },
      {
        name: "缺货中",
        page: 0
      },

    ],
    title: '',
    currentTab: '0',
    bottom: '1',
    actions: [{
      name: '删除',
      color: '#ed3f14'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      });
      this.setData({
        title: options.title,
        lists: [{
            name: "已使用",
            page: 0
          },
          {
            name: "未使用",
            page: 0
          },

        ],
      })
    };

    getremindlist({

    }).then(res => {
      this.setData({
        ...res.data
      })
    })
  },
  switchTab: function (e) {
    var tab = e.currentTarget.dataset.current
    this.setData({
      currentTab: tab
    })
  },
  switchSwiper(e) {
    var tab = e.detail.current

    this.setData({
      currentTab: tab

    })
  },
  editors(e) {
    var parments = this.selectComponent('#goodsrow')
    parments.dels()
    this.setData({
      bottom: '2'
    })
  },
  dones(e) {
    var parments = this.selectComponent('#goodsrow')
    parments.dels()
    this.setData({
      bottom: '1'
    });

  },
  anotherEventListener(e) {
    var goodsid = e.detail.goodsid
    noremovdremind({
      goodsId: goodsid
    }).then(res => {
      // 成功后掉用
      getremindlist({}).then(res => {
        this.setData({
          ...res.data
        })
      })
    })
  },
  onevokeAddCart(e) {
    var that = this
    app.onevokeAddCart(that, e)
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
  ontoUpImgs() {
    app.handleJumpToTop();

  },
  onPageScroll(e) {
    console.log(e.scrollTop, 'e.scrollTop ')
    var that = this
    app.scrollRolling(that, e.scrollTop)
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