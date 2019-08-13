// components/searchLists/index.js
import api from '../../utils/api.js'
const {
  goodsFilter,
  goodsList,
} = api
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    discount: String,
    catId: String,
    typess: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        if (newData) {
          this._typess(newData)
        }
      }
    },
    isBrand: Boolean,
    isid: String,
    hasZhifa: String,
    kind: String,
    requestLock: {
      type: Boolean,
      value: false,
      observer: function (newData, oldData) {
        this._getRequestLock(newData)
      },
    },
    keywords: String,
    brandId: {
      type: String,
      value: '',
      observer: function (newData, oldData) {

        this._brandId(newData)

      }
    },
    supplierUserId: String,
    eventId: String,
    brandIdsList: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        if (newData.length !== oldData.length) {
          this._brandIdsList(newData)
        }
      }
    },
    tagsArr: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        this._tags(newData)
      }
    },
    goodsList: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        if (newData.length !== 0) {
          this._getData(newData)
        }
      }
    },
    isDifferentType: {
      type: Boolean,
      value: false,
      observer: function (newData, oldData) {
        if (newData !== oldData) {
          this._getIsDifferentTypeLock(newData)
        }
      },
    },

    brandIdsList: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        if (newData) {
          this._brandIdsList(newData)
        }
      }
    },
    zhifacoudan: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        if (newData) {
          this._zhifacoudan(newData)
        }
      }
    },
    fullcutcoudan: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        if (newData) {
          this._fullcutcoudan(newData)
        }
      }
    },
    brandCoudan: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        if (newData) {
          this._brandIdsList(newData)
        }
      }
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    toTheTop: false,
    TheScrollBar: '',
    condition: 'zonghe',
    types: '',
    sale: '',
    price: '',
    discount: '',
    filtrate: '',
    isFiltrate: false,
    requestLock: false,
    keywords: '',
    brandId: '',
    eventId: '',
    goodsList: [],
    pageSize: 20,
    page: 1,
    sortColumn: '',
    order: '',
    reachTheBottom: false,
    istags: '',
    issupplierUserId: '',
    isgoshops: true,
    isLoading: 2,
    isLoadings: true
  },
  ready() {
    //创建节点选择器
    var brandId = this.data.brandIdsList;
    var windowHeight = app.globalData.appHeight;
    this.setData({
      windowHeight,
    })
    if (this.properties.hasZhifa == 1 || this.properties.typess == 'zhifa') {
      var supplierUserId = '1257';
      this.setData({
        issupplierUserId: supplierUserId,
      })
    };
    if (this.properties.typess == 'manjian') {
      var tags = [7];
      this.setData({
        tags: tags,
        tagsArr: tags
      })
    }
    if (this.properties.typess == "pinpai") {
      var brandIdsList = [];
      brandIdsList.push(this.properties.isid)
      this.setData({
        brandIdsList: brandIdsList,
      })
    }
    var catIdList = [];
    catIdList.push(this.properties.catId)
    //品牌详情页 如果不做这步判断就会默认加载无关数据
    goodsFilter().then(res => {
      this.setData({
        ...res.data
      })
    })
    if (this.data.isBrand) {
      return false
    } else {
      goodsList({
        keywords: this.data.keywords,
        supplierUserId: this.data.supplierUserId || supplierUserId,
        eventId: this.data.eventId,
        tags: this.data.tagsArr || tags,
        brandIdsList: this.data.brandIdsList,
        page: this.data.page,
        pageSize: this.data.pageSize,
        sortColumn: this.data.sortColumn,
        order: this.data.order,
        catIdList
      }).then(res => {
        if (res.data.goodsList.length > 0) {

          this.setData({
            ...res.data,
            brandIdsList,
            catIdList,
            catId: '',
            isLoading: 1,

          }, () => {
            if (res.data.goodsList.length < this.data.pageSize) {
              this.setData({
                reachTheBottom: res.data.goodsList.length > 3 ? true : false
              })
            }


          })
        } else {
          this.setData({
            ...res.data,
            brandIdsList,
            catIdList,
            catId: '',
            isLoading: 0
          })
        }
      })
    }

  },
  detached() {
    this.setData({
      goodsList: []
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _zhifacoudan(newData) {
      this.setData({
        zhifacoudan: newData
      });
    },
    _fullcutcoudan(newData) {
      this.setData({
        fullcutcoudan: newData
      });
    },
    _brandIdsList(newData) {
      this.setData({
        brandCoudan: newData
      });
    },
    _typess(newData) {
      // this.coudanList(newData)
    },
    _brandId(newData) {
      this.setData({
        brandId: newData
      });
    },
    _tags(newData) {
      this.setData({
        tagsArr: newData
      });
    },
    _brandIdsList(newData) {
      this.setData({
        brandIdsList: newData
      });
    },
    _getRequestLock(newData) {
      this.setData({
        requestLock: newData
      })
    },

    _getIsDifferentTypeLock(newData) {
      this.setData({
        isDifferentType: newData
      })
    },
    _getData(newData) {
     
      //这里的loading 有bug
      this.setData({
        goodsList: newData,
        isLoading: 1,
        isLoadings: newData.length < this.data.pageSize ? false : true
      })
    },
    onCondition(e) {

      var index = e.currentTarget.dataset.index
      var keywords = this.data.keywords
      var brandIdsList = this.data.brandIdsList
      var eventId = this.data.eventId
      var catIdList = this.data.catIdList
      var pageSize = this.data.pageSize
      if (index !== "filtrate") {
        this.triggerEvent('evokeFiltrate', {
          clearItemCheck: true
        })

      }
      if (this.data.condition === 'zonghe' && index == 'zonghe') {
        return false
      }
      this.setData({
        reachTheBottom: false,
        isLoadings: false
      })
      switch (index) {
        case 'zonghe':

          this.setData({
            condition: 'zonghe',
            isFiltrate: false,
            clearItemCheck: true,
            isDifferentType: true,
            page: 1,
            goodsList: [],
            isLoading: 2
          }, () => {
            goodsList({
              supplierUserId: this.data.issupplierUserId,
              tags: this.data.istags,
              sortColumn: '',
              order: '',
              keywords,
              brandIdsList,
              eventId,
              catIdList,
              page: 1,
              pageSize
            }).then(res => {
             
              this.setData({
                ...res.data,
                sortColumn: '',
                order: '',
                keywords,
                brandIdsList,
                tagList: [],
                countryList: [],
                catId: '',
                isLoading: res.data.goodsList.length > 0 ? 1 : 0,
              }, () => {
                if (res.data.goodsList.length < this.data.pageSize) {
                  this.setData({
                    reachTheBottom: res.data.goodsList.length > 3 ? true : false
                  })
                }

              })
            })
          })


          break;
        case 'filtrate':
          this.setData({
            condition: 'filtrate',
            isDifferentType: true,
          }, () => {
            this.triggerEvent('evokeFiltrate', {
              isFiltrate: true,
              clearItemCheck: false,
              category: this.data.category,
              countries: this.data.countries,
              tags: this.data.tags
            })
          })
          break;
        case 'sale':
        case 'price':
        case 'discount':
          let classify = ''
          let sort = ''
          this.setData({
            page: 1,
            goodsList: [],
            isFiltrate: false,
            clearItemCheck: true,
            isDifferentType: true,
            isLoading: 2
          })
          if (this.data.condition !== index) {
            this.data.types = ''
          }
          if (this.data.types === 'desc') {
            this.setData({
              condition: index,

              types: 'asc',
              [index]: '/images/icon_low.png',
              isLoadings: false
            })
          } else {
            sort = 'DESC'
            this.setData({
              condition: index,
              types: 'desc',
              [index]: '/images/icon_high.png',
              isLoadings: false
            })
          }
          if (index === 'sale') {
            classify = 'sale_count'
          } else if (index === 'price') {
            classify = 'min_price'
          } else if (index === 'discount') {
            classify = 'discount'
          }
          goodsList({
            supplierUserId: this.data.issupplierUserId,
            tags: this.data.istags,
            sortColumn: classify,
            order: sort,
            keywords,
            brandIdsList,
            eventId,
            catIdList,
            page: 1,
            pageSize
          }).then(res => {
            this.setData({
              ...res.data,
              sortColumn: classify,
              order: sort,
              keywords,
              brandIdsList,
              tagList: [],
              countryList: [],
              catId: '',
              page: 1,
              isLoading: res.data.goodsList.length > 0 ? 1 : 0,
            }, () => {
              if (res.data.goodsList.length < this.data.pageSize) {
                this.setData({
                  reachTheBottom: res.data.goodsList.length > 3 ? true : false
                })
              }


            })
          })
      }
    },
    onFilterClick(e) {
      const categoryIndex = e.categoryIndex
      const countriesIndex = e.countriesIndex
      const tagsIndex = e.tagsIndex
      const type = e.type
      const isClick = e.isClick
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
        this.triggerEvent('evokeFiltrate', {
          isFiltrate: false
        })
        if (!!isClick) {
          this.setData({
            isLoading: 2,
            isLoadings: false
          })

          goodsList({
            supplierUserId: this.data.issupplierUserId,
            tags: tagList || this.data.istags,
            countryList,
            catId,
            keywords,
            brandIdsList,
            eventId,
            page: 1,
            pageSize
          }).then(res => {
            this.setData({
              ...res.data,
              tagList,
              countryList,
              catId,
              keywords,
              brandIdsList,
              page: 1,
              catIdList: [],
              isLoading: 0,

            }, () => {

              if (res.data.goodsList.length < this.data.pageSize) {
                this.setData({
                  reachTheBottom: res.data.goodsList.length > 3 ? true : false
                })
              }


            })
          })
        }
      }
    },
    pullUpLoad() {
      const brandId = this.data.brandId
      const tagList = this.data.tagList
      const countryList = this.data.countryList
      const catId = this.data.catId
      const catIdList = this.data.catIdList
      const keywords = this.data.keywords
      const brandIdsList = this.data.brandIdsList
      const sortColumn = this.data.sortColumn
      const order = this.data.order
      const eventId = this.data.eventId

      if (this.data.isDifferentType) {
        this.data.requestLock = false
      }

      if (!this.data.requestLock) {
        this.data.requestLock = true
        let pageSize = +this.data.pageSize
        let keywords = this.data.keywords
        let allData = this.data.goodsList
        let page = +this.data.page + 1
        this.setData({
          isLoadings: this.data.reachTheBottom ? true : false
        }, () => {
          goodsList({
            supplierUserId: this.data.issupplierUserId,
            keywords,
            pageSize,
            page,
            tags: tagList || this.data.tagsArr,
            countryList,
            catId,
            brandIdsList,
            sortColumn,
            order,
            eventId,
            catIdList,
          }).then(res => {
            allData = allData.concat([], ...res.data.goodsList)
            if (res.data.goodsList.length < pageSize) {
              this.setData({
                goodsList: allData,
                page,
                requestLock: true,
                isDifferentType: false,
                sortColumn,
                reachTheBottom: true,
                isLoadings: false
              })
            } else {
              this.setData({
                goodsList: allData,
                page,
                requestLock: false,
                isDifferentType: false,
                sortColumn,
                reachTheBottom: false,
                isLoadings: true
              })
            }
          }).catch(res => {
            this.setData({
              requestLock: false,
              isDifferentType: false,
              sortColumn,
              isLoadings: false
            })
          })
        })




        // jieshu
      }

    },
    // 回到顶部
    listToUpImage(e) {
      var scrollTop = e.detail.scrollTop;
      if (scrollTop > 1842) {
        this.setData({
          toTheTop: true
        })
      } else {
        this.setData({
          toTheTop: false
        })
      }

    },
    ontoUpImgs() {
      this.setData({
        TheScrollBar: '0'
      });
    },
    pageEventListener1(e) {
      var news = e.detail.newdata || this.data.isgoshops
      this.setData({
        isgoshops: news,
      });
    },
    gocart() {
      wx.switchTab({
        url: '/pages/cart/cart',
      })
    },
    onevokeAddCart(e) {
      this.triggerEvent('evokeAddCart', {
        ...e.detail
      })
    },
    onhideCart(e) {
      this.setData({
        isPopCart: false
      })
    },
  }
})