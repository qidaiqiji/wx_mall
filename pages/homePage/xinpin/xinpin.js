// pages/homePage/xinpin/xinpin.js
import api from '../../../utils/api.js'
const filter = require('../../../utils/filter');
const {
  newBrandGoodsList,
  newBrandIndex,
  newBrandBrandList,
  newBrandAliveList,
} = api
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tapText: ['品牌', '商品', '即将上新'],
    xinpinGoodsItem: true, //判断即将上新
    dotIndex: 0,
    tabIndex: 1,
    banners: [],
    page: 1,
    pageSize: 10,
    toTheTop: false,
    goodsList: [],
    isLoadings: false,
    reachTheBottom: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    newBrandAliveList().then((res) => {
      if (res.data.goodsList.length == 0) {
        var tapText = ['品牌', '商品'];
        this.setData({
          tapText,
        })
      }
    })
    this.setData({
      ...options
    })
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo.version
    this.setData({
      img_boxbg: imgHead + 'img_boxbg@2x.png?version=' + version,
      img_new: imgHead + 'img_new@2x.png?version=' + version,
    })
    newBrandIndex().then(res => {
      let banners = res.data.goodsList && res.data.goodsList.map(item => {

        let price = item.goodsPrice && String(item.goodsPrice).split('.')
        item.price_int = price[0]
        item.price_float = price[1]
        return item
      })
      this.setData({
        year: res.data.year,
        month: res.data.month,
        bannerBrandList: res.data.brandList,
        banners: banners,
        bannerDesc: banners[0],
        dots: Array(banners.length).fill('1')
      })

    })

    this.setData({
      goodsList: [],
      page: 1,
      xinpinGoodsItem: true
    }, () => {
      let page = +this.data.page
      this.getGoodsList(page);
    })
  },
  // 商品列表
  getGoodsList(page) {
    if (!this.data.requestLock) {
      this.data.requestLock = true
      let pageSize = +this.data.pageSize
      let allData = this.data.goodsList

      newBrandGoodsList({
        pageSize,
        page
      }).then(res => {
        allData = allData.concat([], ...res.data.goodsList)
        if (res.data.goodsList.length < pageSize) {
          this.setData({
            goodsList: allData,
            page,
            requestLock: true,
            reachTheBottom: true,
            isLoadings: false,
          })
        } else {
          this.setData({
            goodsList: allData,
            page,
            requestLock: false,
            isLoadings: true
          })
        }
        //这块数据之后需要进行处理
        if (res.data.foundArticle.articleId) {
          let imgs = res.data.foundArticle.imgs
          app.rewriteArrs(this, res.data.foundArticle.imgs, 'newImgs',3)
          res.data.foundArticle.isShow = false
          this.setData({
            foundArticle: res.data.foundArticle
          })
        }


      }).catch(res => {
        this.setData({
          requestLock: false,
          isLoadings: true
        })
      })
    }
  },
  // 即将上新
  getTheNewGoodsList(page) {
    if (!this.data.requestLock) {
      this.data.requestLock = true
      let pageSize = +this.data.pageSize
      let allData = this.data.goodsList
      newBrandAliveList({
        pageSize,
        page
      }).then(res => {
        allData = allData.concat([], ...res.data.goodsList)
        if (res.data.goodsList.length < pageSize) {
          this.setData({
            goodsList: allData,
            page,
            requestLock: true,
            reachTheBottom: true,
            isLoadings: false,
          })
        } else {
          this.setData({
            goodsList: allData,
            page,
            requestLock: false,
            isLoadings: true
          })
        }
      }).catch(res => {
        this.setData({
          requestLock: false,
          isLoadings: true
        })
      })
    }
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
  isMaxShow(e) {
    var img = e.currentTarget.dataset.img || '';
    var imgs = e.currentTarget.dataset.imgs || [];
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  isShowText() {
    if (this.data.foundArticle) {
      this.data.foundArticle.isShow = !this.data.foundArticle.isShow
      this.setData({
        foundArticle: this.data.foundArticle
      })
    }
  },
  jumpToGoodsDetail(e) {
    wx.navigateTo({
      url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid,
    })
  },
  jumpToBrand(e) {
    wx.navigateTo({
      url: '/pages/goods/brandDetail/brandDetail?brandId=' + e.currentTarget.dataset.brandid,
    })
  },
  handleTabs(e) {
    tabIndex: e.currentTarget.dataset.index
    this.setData({
      reachTheBottom: false,
    })
    if (this.data.tabIndex == e.currentTarget.dataset.index) {
      return false
    } else {
      if (this.data.fixedNav) {
        let query = wx.createSelectorQuery()
        query.select('.xp_banner').boundingClientRect((rect) => {
          wx.pageScrollTo({
            scrollTop: rect.height + 1,
            duration: 0,
          })
        }).exec()
      }
      this.setData({
        tabIndex: e.currentTarget.dataset.index,
        page: 1
      }, () => {

        if (this.data.tabIndex == 1) {
          this.setData({
            requestLock: false,
            goodsList: [],
            page: 1,
            xinpinGoodsItem: true
          }, () => {
            let page = +this.data.page
            this.getGoodsList(page);
          })

        } else if (this.data.tabIndex == 0) {
          // 品牌
          newBrandBrandList().then(res => {
            this.setData({
              ...res.data,
              xinpinGoodsItem: true
            })
          })
        } else if (this.data.tabIndex == 2) {
          this.setData({
            requestLock: false,
            goodsList: [],
            page: 1,
            xinpinGoodsItem: true
          }, () => {
            let page = +this.data.page;
            newBrandAliveList({
              pageSize: this.data.pageSize,
              page
            }).then(res => {
              this.setData({
                goodsList: res.data.goodsList,
                xinpinGoodsItem: false
              })
            })
          })
        }
      })
    }
  },
  ontoUpImgs() {
    app.handleJumpToTop();

  },
  onswiperChange(e) {

    let banners = this.data.banners

    this.setData({
      bannerDesc: banners[e.detail.current],
      dotIndex: e.detail.current
    })
  },
  onPageScroll(e) {
    if (!this.changeLock) {

      let query = wx.createSelectorQuery()
      query.select('.xp_banner').boundingClientRect((rect) => {
        let height = rect.height
        if (e.scrollTop > height) { //临界值，根据自己的需求来调整
          this.setData({
            fixedNav: true,
            bannerHeight: rect.height,
            changeLock: false
            //是否固定导航栏
            //是否回到临界值的状态
          })
        } else {
          this.setData({
            fixedNav: false,
            changeLock: false

          })
        }
      }).exec()
    } else {
      this.setData({
        changeLock: false

      })
    }



    var that = this
    app.scrollRolling(that, e.scrollTop)
  },
  onNewPrompt(e) {
    var txtE = e.detail.e
    app.onToast(txtE)
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
    let page = +this.data.page + 1
    if (this.data.tabIndex == 1) {
      this.getGoodsList(page);
    } else if (this.data.tabIndex == 2) {
      this.getTheNewGoodsList(page);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})