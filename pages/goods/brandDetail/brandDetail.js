// pages/goods/brandDetail/brandDetail.js
import api from '../../../utils/api.js'
const app = getApp()
const {
  brandView,
  brandLicense,
  goodsList,
  goodsFilter
} = api
var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHead: '',
    version: "",
    notMsg_img: '',
    richText: '',
    toTheTop: false,
    statusType: ['品牌主页', '全部商品', '授权资质', '品牌知识'],
    currentTab: 0,
    requestLock: false,
    goodsList: [],
    isarticle: false,
    goodsList: [],
    pageSize: 10,
    page: 1,
    keywords: '',
    title: '',
    couponList: [],
    condition: '',
    types: '',
    isLoading: 2,
  },
  //图片点击事件
  imgYu: function (e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  switchTab: function (e) {
    const brandId = this.data.brandId
    this.setData({
      requestLock: true
    })
    var tab = e.currentTarget.dataset.current
    var pageSize = this.data.pageSize
    var page = 1
    if (this.data.currentTab === tab) {
      return false
    } else {
      this.setData({
        currentTab: tab
      }, () => {
        if (tab == 1) {

          let condition = this.data.condition
          let types = this.data.types
          let page = this.data.page
          this.getGoodsList(condition, types, page)
          goodsFilter().then(res => {
            this.setData({
              ...res.data
            })
          })
        } else if (tab == 2) {
          brandLicense({
            brandId
          }).then(res => {
            this.setData({
              ...res.data,
            })
          })
        }

      })

    }
  },
  onshowRichText: function (e) {
    if (e.detail.isShowRichText) {
      this.setData({
        isShowRichText: e.detail.isShowRichText
      })
    } else {
      this.setData({
        isShowRichText: false
      })
    }
  },
  onevokeFiltrate(e) {
    this.setData({
      ...e.detail
    }, () => {
      if (e.detail.clearItemCheck) {
        this.selectComponent("#filtrateDrawer").cancelDrawer();
      }
    })

  },
  onFilterClick(e) {

    const categoryIndex = e.detail.categoryIndex
    const countriesIndex = e.detail.countriesIndex
    const tagsIndex = e.detail.tagsIndex
    const type = e.detail.type
    const isClick = e.detail.isClick

    const keywords = this.data.keywords
    const brandIdsList = this.data.brandIdsList
    const catIdList = this.data.catIdList
    const pageSize = this.data.pageSize
    const eventId = this.data.eventId
    let tagList = []
    let countryList = []
    let catId = categoryIndex
    tagList.push(tagsIndex)
    countryList.push(countriesIndex)

    if (type === 'cancel') {
      return false;
    } else {

      //这里有一个商品列表筛选的api
      this.setData({
        isFiltrate: false
      })
      if (!!isClick) {

        this.setData({
          isLoading: 2,
          types: '',
          sortColumn: '',
          isLoadings: false,
          goodsList: [],
          categoryIndex: '',
          countriesIndex: '',
          tagsIndex: '',
          page: 1,
          pageSize,

          brandIdsList: this.data.brandId ? [this.data.brandId] : '',
          catIdList: this.data.catId ? [this.data.catId] : [],
          eventId: this.data.eventId ? this.data.eventId : ''
        }, () => {
          let condition = this.data.condition
          let types = this.data.types
          let page = this.data.page
          this.getGoodsList(condition, types, page, categoryIndex, countriesIndex, tagsIndex)
        })
      }
    }
    this.setData({
      ...e.detail
    })
  },
  pullReachBottom(e) {

  },
  getGoodsList(condition, types, page, categoryIndex, countriesIndex, tagsIndex) {
    let sortColumn = ''
    if (condition === 'sale') {
      sortColumn = 'sale_count'
    } else if (condition === 'price') {
      sortColumn = 'min_price'
    } else if (condition === 'discount') {
      sortColumn = 'discount'
    } else if (condition === 'zonghe') {
      sortColumn = ''
    }

    goodsList({
      sortColumn: sortColumn,
      order: types == 'asc' ? 'DESC' : '',
      keywords: this.data.keywords,
      tags: tagsIndex ? [tagsIndex] : [],
      countryList: countriesIndex ? [countriesIndex] : [],
      catId: categoryIndex ? categoryIndex : '',
      page,
      pageSize: this.data.pageSize,
      brandIdsList: this.data.brandId ? [this.data.brandId] : ''
    }).then(res => {
      let allData = this.data.goodsList.concat([], ...res.data.goodsList)
      if (res.data.goodsList.length < this.data.pageSize) {
        this.setData({
          sortColumn: sortColumn,
          goodsList: allData,
          isLoading: allData.length > 0 ? 1 : 0,
          reachTheBottom: allData.length > 0 ? true : false,
          isLoadings: false,
          requestLock: true,
        })

      } else {
        this.setData({
          sortColumn: sortColumn,
          goodsList: allData,
          isLoading: 1,
          reachTheBottom: false,
          isLoadings: true,
          requestLock: false,
          page
        })
      }
    }).catch(fail => {
      this.setData({
        sortColumn: sortColumn,
        requestLock: false
      })
    })

  },
  onpushSizer(e) {
    let condition = e.detail.condition
    let types = e.detail.types
    if (this.data.condition == 'filtrate' && condition !== 'filtrate') {
      this.selectComponent("#filtrateDrawer").cancelDrawer();
    }
    if (condition == 'filtrate') {
      this.setData({
        isFiltrate: true,
      })
    } else {
      this.setData({
        isLoading: 2,
        sortColumn: '',
        types,
        isLoadings: false,
        goodsList: [],
        categoryIndex: '',
        countriesIndex: '',
        tagsIndex: '',
        page: 1,
        condition,
      }, () => {
        let page = this.data.page
        this.getGoodsList(condition, types, page)
      })
    }
  },
  seeBrand() {
    this.setData({
      isseeBrand: true
    })
    WxParse.wxParse('article', 'html', this.data.richText, this, 0);
    this.selectComponent("#brandMsg").showModal();

  },
  onhideBrandMsg() {
    this.setData({
      isseeBrand: false,
    })

  },

  showActive() {
    this.setData({
      isShowActive: true
    })
    this.selectComponent("#brandActive").showModal();
  },
  onhideBrandActive() {
    this.setData({
      isShowActive: false
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      imgHead,
      version
    })
    this.setData({
      notMsg_img: imgHead + "self/notMsg.png?version=" + version
    })
    var brandId = options.brandId && options.brandId
    brandView({
      ...options
    }).then(res => {
      var richText = res.data.brandInfo.brandDetail;
      if (richText.length) {
        var isarticle = true
      } else {
        var isarticle = false
      }
      this.setData({
        ...res.data,
        richText,
        isarticle,
        brandId,
        requestLock: true

      }, () => {
        wx.setNavigationBarTitle({
          title: res.data.brandInfo.brandName
        })
      })

    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var windowHeight = app.globalData.appHeight;
    this.setData({
      windowHeight,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var title = this.data.couponList.length > 0 && this.data.couponList.reduce((total, item) => {
      return total + item.ruleName
    })
    if (title) {
      this.setData({
        title
      })
    }
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
    app.scrollRolling(that, e.scrollTop)
  },
  onReachBottom() {
    if (this.data.requestLock) {
      return false
    }

    let page = this.data.page + 1
    let condition = this.data.condition
    let types = this.data.types
    let categoryIndex = this.data.categoryIndex
    let countriesIndex = this.data.countriesIndex
    let tagsIndex = this.data.tagsIndex
    this.getGoodsList(condition, types, page, categoryIndex, countriesIndex, tagsIndex)


  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})