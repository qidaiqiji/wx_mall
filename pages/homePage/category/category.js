import api from '../../../utils/api.js'
const {
  categoryGallery,
  goodsList
} = api
const app = getApp();
const throttle = app.throttle;
const globalData = app.globalData;
Page({
  data: {
    current:0,
    toTheTop: false,
    hideHeaderTop: true,
    flag: 0,
    text: '',
    array: [],
    nav: [{
        title: "面膜馆",
        img: globalData && globalData.imgHead + "category/icon_mask_selected@2x.png?version=" + globalData.userInfo.version
      },
      {
        title: "护肤馆",
        img: globalData && globalData.imgHead + "category/icon_gehu_selected@2x.png?version=" + globalData.userInfo.version
      },
      {
        title: "应季馆",
        img: globalData && globalData.imgHead + "category/icon_yingji_selected@2x.png?version=" + globalData.userInfoversion
      },
      {
        title: "洗卸馆",
        img: globalData && globalData.imgHead + "category/icon_xixie_selected@2x.png?version=" + globalData.userInfo.version
      }
    ],
    currentTab: 0,
    page: 1,
    pageSize: 20,
    groupList: [],
    requestLock: false,
    isLoadings: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo.version
    this.setData({
      imgHead,
      version,
      img_bg_0: imgHead + 'category/img_bg_0.png?version=' + version,
      img_bg_1: imgHead + 'category/img_bg_1.png?version=' + version,
      img_bg_2: imgHead + 'category/img_bg_2.png?version=' + version,
      img_bg_3: imgHead + 'category/img_bg_3.png?version=' + version,
      cart_bg0: imgHead + 'category/mask_cart_bg.png?version=' + version,
      cart_bg1: imgHead + 'category/gehu_cart_bg.png?version=' + version,
      cart_bg2: imgHead + 'category/yingji_cart_bg.png?version=' + version,
      cart_bg3: imgHead + 'category/xixie_cart_bg.png?version=' + version,
    })
    var pageSize = this.data.pageSize
    var page = 1
    categoryGallery({
      id: 1
    }).then(res => {
      var hotGoodsList = [res.data.hotGoodsList.slice(0, 3), res.data.hotGoodsList.slice(3, 6), res.data.hotGoodsList.slice(6, 9)]
      this.setData({
        ...res.data,
        hotGoodsList: hotGoodsList
      }, () => {
        goodsList({
          catId: this.data.catId,
          page,
          pageSize
        }).then(data => {
          this.setData({
            ...data.data,
            page
          })
        })
      })
    })

  },
  switchTab: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
    this.setData({
      requestLock: true,
      hideHeader: false,
      titleChange: false,
    })
    var tab = e.currentTarget.dataset.current
    var pageSize = this.data.pageSize
    var page = 1
    if (this.data.currentTab === tab) {
      return false
    } else {
      this.setData({
        currentTab: tab,
      }, () => {
        categoryGallery({
          id: tab + 1
        }).then(res => {
          var hotGoodsList = [res.data.hotGoodsList.slice(0, 3), res.data.hotGoodsList.slice(3, 6), res.data.hotGoodsList.slice(6, 9)]
          this.setData({
            ...res.data,
            requestLock: false,
            hotGoodsList: hotGoodsList,
            current:0
          }, () => {
            goodsList({
              catId: this.data.catId,
              page,
              pageSize
            }).then(data => {
              this.setData({
                ...data.data,
                page,
              })
            })
          })
        }).catch(res => {
          this.setData({
            requestLock: false
          })
        })
      })

    }
  },
  jumpToBrandDetail: throttle(function (e) {
    wx.navigateTo({
      url: '/pages/goods/brandDetail/brandDetail?brandId=' + e.currentTarget.dataset.brandid,
    })
  }),
  jumpToGoodsList: throttle(function (e) {
    wx.navigateTo({
      url: '/pages/goods/goodsLists/goodsLists?keywords=' + e.currentTarget.dataset.keywords
    })
  }),
  goAdvertising: throttle(function (e) {
    app.adSpaceJump(e.currentTarget.dataset.item)
  }),
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
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
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  onPageScroll(e) {

    var that = this
    app.scrollRolling(that, e.scrollTop)
    if (e.scrollTop <= 10) {
      this.setData({
        titleChange: false
      })
    } else {
      if (!this.data.titleChange) {
        this.setData({
          titleChange: true
        })
      }
      var value = e.scrollTop;
      var array = this.data.array;
      array.push(value);
      var len = array.length;
      len > 5 ? array.splice(0, len - 4) : array;
      if (array[len - 1] > array[len - 2]) {
        if (this.data.wola == '这是向上拉') {
          return false;
        } else {
          this.setData({
            hideHeader: true,
            wola: '这是向上拉',
            array
          })
          return false;
        }
      } else if (array[len - 1] < array[len - 2]) {
        if (this.data.wola == '这是向下拉') {
          return false;
        } else {
          this.setData({
            hideHeader: false,
            wola: '这是向下拉',
            array
          })
          return false;
        }
      }
    }

  },
  handleToBuy(e) {
    this.setData({
      isPopCart: true,
      addGoodsId: e.currentTarget.dataset.goodsid,
      addGoodslist: e.currentTarget.dataset.goodslist
    })

  },
  jumpToGoodsDetail: throttle(function (e) {
    wx.navigateTo({
      url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid,
    })
  }, 2000),
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
  },
  onReachBottom() {
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
        catId: this.data.catId,
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
          })
        } else {
          this.setData({
            goodsList,
            page,
            requestLock: false,
            isLoadings: true,
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