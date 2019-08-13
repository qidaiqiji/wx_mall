// pages/coudanList/coudanList.js
import api from '../../../utils/api.js';
const app = getApp()
const {
  getAddCoudan,
  zhifaCoudan,
  fullcutCoudan,
  brandCoudan,
  goodsList,
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop: false,
    isshow: true,
    isid: '',
    zhifacoudan: '', //直发
    fullcutcoudan: '', ////满减
    brandCoudan: '', //品牌
    supplierUserId: '',
    tags: [],
    brandIdsList: [],
    page: 1,
    pageSize: 20,
    goodsList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    wx.setNavigationBarTitle({
      title: options.title == '直发凑单' ? '凑单列表' : options.title
    });
    this.setData({
      ...options
    });
    this.coudanList(this.data.typess)
    if (options.typess == 'zhifa') {
      this.setData({
        supplierUserId: '1257',
      }, () => {
        let condition = this.data.condition
        let types = this.data.types
        let page = this.data.page
        this.getGoodsList(condition, types, page)
      })
    };
    if (options.typess == 'manjian') {
      this.setData({
        eventId: options.eventId
      }, () => {
        let condition = this.data.condition
        let types = this.data.types
        let page = this.data.page
        this.getGoodsList(condition, types, page)
      })
    }
    if (options.typess == "pinpai") {
      this.setData({
        brandIdsList: [options.isid],
      }, () => {
        let condition = this.data.condition
        let types = this.data.types
        let page = this.data.page
        this.getGoodsList(condition, types, page)
      })
    }
  },
  coudanList(e) {
    if (e == 'zhifa') {
      zhifaCoudan({
        discount: this.data.discount,
        provinceId: this.data.provinceId
      }).then(res => {
        this.setData({
          zhifacoudan: res.data
        });
      });
    };
    if (e == 'manjian') {
      fullcutCoudan({}).then(res => {
        this.setData({
          fullcutcoudan: res.data
        });
      });
    };
    if (e == 'pinpai') {
      brandCoudan({
        brandId: this.data.isid
      }).then(res => {
        this.setData({
          brandCoudan: res.data,
          isshow: false
        });
      });
    }
  },
  myEvent(e) {
    this.coudanList(e.detail.typess)

  },
  onevokeAddCart(e) {
    var that = this
    app.onevokeAddCart(that, e)
  },
  onhideCart(e) {
    this.coudanList(this.data.typess);
    var that = this
    app.onhideCart(that, e)
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
        sortColumn: '',
        types,
        isLoadings: false,
        goodsList: [],
        categoryIndex: '',
        countriesIndex: '',
        tagsIndex: '',
        page: 1,
        condition
      }, () => {
        let page = this.data.page
        this.getGoodsList(condition, types, page)
      })
    }
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
      brandIdsList: this.data.brandId ? [this.data.brandId] : '',
      supplierUserId: this.data.supplierUserId ? this.data.supplierUserId : '',
      brandIdsList: this.data.brandIdsList.length > 0 ? this.data.brandIdsList : [],
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
          sortColumn: '',
          types: '',
          isLoadings: false,
          goodsList: [],
          categoryIndex: '',
          countriesIndex: '',
          tagsIndex: '',
          page: 1,
          pageSize,
          brandIdsList: this.data.brandId ? [this.data.brandId] : ''
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
  gocart() {
    wx.switchTab({
      url: '/pages/cart/cart',
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