// pages/homePage/zhifaIndex/zhifaIndex.js
import api from '../../../utils/api.js'
const {
  getZhiFaIndex,
  goodsList
} = api
const app = getApp()
const throttle = app.throttle
Page({
  data: {
    goodsList: '',
    pageSize: 20,
    page: 1,
    goodsList: [],
    topflexd: false,
    isSearch: false,
    totalCount: '0',
    isLoadings: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const query = wx.createSelectorQuery()
    //选择节点
    query.select('.top_twp_wrap').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        nodetop: res[0].top // #the-id节点的上边界坐标
      })
    });
    getZhiFaIndex({}).then(res => {
      this.setData({
        ...res.data
      })
    })
    // 商品列表
    goodsList({
      hezi: 1,
      page: this.data.page,
      pageSize: this.data.pageSize,
    }).then(res => {
      this.setData({
        goodsList: res.data.goodsList
      })
    })

  },
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
    if (e.scrollTop <= 10) {
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
  },
  brand: throttle(function (e) {
    var brandId = e.currentTarget.dataset.brandid;
    wx.navigateTo({
      url: '/pages/goods/brandDetail/brandDetail?brandId=' + brandId,
    })
  }),
  scrolls(e) {

    if (e.detail.scrollTop >= this.data.nodetop) {

      if (this.data.ishide) {
        return false
      } else {
        this.setData({
          isimgage: '1',
          ishide: true,
        })
      }
    }
    if (e.detail.scrollTop < this.data.nodetop) {

      if (this.data.ishide) {
        this.setData({
          isimgage: '2',
          ishide: false,
        })
      } else {
        return false
      }
    }
  },
  scrolltoupper() {
    setData({
      topflexd: true
    })
  },
  upper() {
    setData({
      topflexd: false
    })
  },
  taps: throttle(function () {
    wx.navigateTo({
      url: '/pages/goods/goodsLists/goodsLists?hezi=1'
    })
  }),
  tap: throttle(function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }),
  cart: throttle(function () {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  }),
  my: throttle(function () {
    wx.switchTab({
      url: '/pages/my/my'
    })
  }),
  onevokeAddCart(e) {
    var that = this
    app.onevokeAddCart(that, e)
  },
  onhideCart(e) {
    var that = this
    app.onhideCart(that, e);
    this.appTotalCount()
  },
  goAdvertising: throttle(function (e) {
    app.adSpaceJump(e.currentTarget.dataset.item)
  }),
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
    this.appTotalCount()
  },
  appTotalCount() {
    const app = getApp()
    var totalCount = app.globalData.totalCount;
    if (totalCount >= 100) {
      this.setData({
        totalCount: "99+"
      })

    } else {
      this.setData({
        totalCount
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.requestLock) {
      return false
    }
    this.setData({
      requestLock: true,
      isLoadings: true
    }, () => {
      let page = this.data.page + 1
      let pageSize = this.data.pageSize
      let oldgoodsList = this.data.goodsList
      goodsList({
        hezi: 1,
        page,
        pageSize
      }).then(data => {
        let goodsList = oldgoodsList.concat(...data.data.goodsList)
        if (data.data.goodsList && data.data.goodsList.length < pageSize) {
          this.setData({
            goodsList,
            page,
            requestLock: true,
            reachTheBottom: true,
            isLoadings: false
          });
        } else {
          this.setData({
            goodsList,
            page,
            requestLock: false,
            isLoadings: true
          })
        }
      }).catch(res => {
        this.setData({
          requestLock: false,
          isLoadings: false
        })
      })
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})