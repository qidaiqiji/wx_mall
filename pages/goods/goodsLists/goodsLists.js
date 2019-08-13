// pages/goodsLists/goodsLists.js
import api from '../../../utils/api.js'
import base64 from '../../../utils/base64.js'
const {
  decode
} = base64
const {
  goodsFilter,
  goodsList,
} = api
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop: false,
    goodsList: [],
    pageSize: 20,
    page: 1,
    keywords: '',
    requestLock: false,
    isLoading: 2,
    isLoadings: false,
    tags: [],
    countryList: [],
    catId: null,
    condition: '',
    types: '',
    hezi:'',
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
          types:'',
          sortColumn:'',
          isLoadings: false,
          goodsList: [],
          categoryIndex: '',
          countriesIndex: '',
          tagsIndex: '',
          page: 1,
          pageSize,
          condition:'',
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
      hezi:this.data.hezi,
      sortColumn: sortColumn,
      order: types == 'asc' ? 'DESC' : '',
      keywords: this.data.keywords,
      tags: tagsIndex ? [tagsIndex] : [],
      countryList: countriesIndex ? [countriesIndex] : [],
      catId: categoryIndex ? categoryIndex : '',
      page,
      pageSize: this.data.pageSize,
      catIdList: this.data.catId ? [this.data.catId] : [],
      eventId: this.data.eventId ? this.data.eventId : ''
    }).then(res => {
      let allData = this.data.goodsList.concat([], ...res.data.goodsList)
      if (res.data.goodsList.length < this.data.pageSize) {
        this.setData({
          goodsList: allData,
          isLoading: allData.length > 0 ? 1 : 0,
          reachTheBottom: allData.length > 0 ? true : false,
          isLoadings: false,
          requestLock: true,
        })

      } else {
        this.setData({
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
        isFiltrate: true
      })
    } else {
      this.setData({
        isLoading: 2,
        sortColumn:'',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    if (options.tags) {
      this.setData({
        tags: [+options.tags],
      })
    }else{
    this.setData({
      ...options,
      keywords: options.keywords?decodeURI(decodeURI(options.keywords, "UTF-8"), "UTF-8"):''
    },()=>{
      console.log(this.data)
    })
  }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
    }
    let condition = this.data.condition
    let types = this.data.types
    let page = this.data.page
    if (this.data.goodsList.length==0){
      this.getGoodsList(condition, types, page)
    }
      goodsFilter().then(res => {
        this.setData({
          ...res.data
        })
      })
    

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