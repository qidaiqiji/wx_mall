// pages/famousBrand/famousBrand.js
const app = getApp()
const throttle = app.throttle
import api from '../../utils/api.js'
const {
  famousBrandCategoryList,
  famousBrandIndex,
  goodsCategoryList,
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iii: "https://img.xiaomei360.com/xcx_ad_img/51/5c46bcd91e94c.jpg",
    changeWidth: '',
    changeHeight: '',
    tipsTextHideNum: 0,
    tipsTextHide: false,
    segmentationList: [],
    shouVideo: '',
    foundLists: true,
    isFoundList: false,
    isEventPopupsHide: false,
    isPopCart: false,
    listTop: true,
    arrTitltIndex: 0,
    reachTheBottom: '已经到底了',
    famous_brand: '',
    current: 0,
    arrTxt: ['正品保证', '一般贸易', '中文标签'],
    toTheTop: false,
    categoryList: [],
    classificationList: [],
    page: 1,
    pageSize: 10,
    isCatId: '',
    isLoading: true,
    middleSmallSample: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      appHeight: app.globalData.appHeight + 20, //没数据时给最小高度
      famous_brand: imgHead + 'activity/famous_brand.png?version=' + version,
      tips_text_img: imgHead + 'activity/tips_text_img.png?version=' + version,
    })
    this.addData()
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

  },
  classificationList() {
    // 分类列表
    if (this.data.categoryList.length == 0) {
      famousBrandCategoryList({}).then(res => {
        this.setData({
          ...res.data
        }, () => {
          if (this.data.foundLists) {

          }
        })
      });
    }
  },
  addData() {


    // 名品详情
    famousBrandIndex({

    }).then(res => {

      Object.values(res.data.brandInfo).map(item => {

        item.goodsList.forEach(list => {
          var goodsPrice = list.goodsInfo && String(list.goodsInfo.goodsPrice)
          var onePrice = goodsPrice.split('.')
          list.goodsInfo.intPrice = onePrice[0];
          if (onePrice[1]) {
            list.goodsInfo.flootPrice = onePrice[1];
          } else {
            list.goodsInfo.flootPrice = '00';
          }
        })
      })
      res.data.carouselList.forEach(element => {
        var goodsPrice = element && String(element.goodsPrice)
        var onePrice = goodsPrice.split('.')
        element.intPrice = onePrice[0];
        if (onePrice[1]) {
          element.flootPrice = onePrice[1];
        } else {
          element.flootPrice = '00';
        }
      });
      console.log(res.data.brandList.length % 2, '+1+++++');
      if (res.data.brandList.length % 2) {
        res.data.brandList.push({
          brandId: '',
          imgUrl: ''
        });
      }
      console.log(res.data.brandList.length % 2, '+++++', res.data.brandList);
      var result = split_array(res.data.brandList, 2);
      var brandList = result;
      // 快速切分数组 arr切分的数组 len 每份有几个
      function split_array(arr, len) {
        var a_len = arr.length;
        var result = [];
        for (var i = 0; i < a_len; i += len) {
          result.push(arr.slice(i, i + len));
        }
        return result;
      }
      this.setData({
        ...res.data,
        segmentationList: brandList
      }, () => {
        this.classificationList()
        //创建节点选择器
        const query = wx.createSelectorQuery()
        //选择节点
        query.select('#classification_wrap').boundingClientRect()
        query.exec(res => {
          this.setData({
            foundList: res[0].bottom,
            foundLists: false,
          })
        })
        // 判断用户是不是第一次进入显示告知书

        if (res.data.purchaseTips.isRead == 0) {
          this.showEventPopups()
        }
      })
    });
    // 分类商品列表,默认全部
    var all = 'all';
    this.getGoodsCategoryList(all)

  },
  swiperChange(e) {
    this.setData({
      current: e.detail.current
    })
  },
  onCarouselItem: throttle(function (e) {

    wx.navigateTo({
      url: e.currentTarget.dataset.jumpurl
    })
  }),
  // 分类切换
  TitltIndex: throttle(function (e) {
    // 中小样置顶，切换保持。切换时回到数据顶部保持置顶+4
    if (this.data.isFoundList) {
      wx.pageScrollTo({
        scrollTop: this.data.foundList + 2,
        duration: 0,
      })
    }
    // 同一分类不请求数据
    if (this.data.arrTitltIndex != e.currentTarget.dataset.index) {
      this.setData({
        classificationList: [],
        arrTitltIndex: e.currentTarget.dataset.index,
        page: 1,
        isCatId: e.currentTarget.dataset.id,
        middleSmallSample: '',
      }, () => {
        this.getGoodsCategoryList(this.data.isCatId);
      });
    }
  }, 300),
  // 中小样
  tipsText: throttle(function (e) {
    if (this.data.arrTitltIndex != e.currentTarget.dataset.index) {
      this.setData({
        classificationList: [],
        arrTitltIndex: '-1',
        page: 1,
        middleSmallSample: 1,
        isCatId: '',
      }, () => {
        this.getGoodsCategoryList(this.data.isCatId);
      });
    }
  }),
  getGoodsCategoryList() {
    // 分类商品列表
    goodsCategoryList({
      catId: this.data.isCatId,
      middleSmallSample: this.data.middleSmallSample,
      page: this.data.page,
      pageSize: this.data.pageSize,
    }).then(res => {

      var allList = this.data.classificationList.concat([], ...res.data.goodsList);

      allList.forEach(element => {
        var goodsPrice = element.goodsInfo && String(element.goodsInfo.goodsPrice)
        var onePrice = goodsPrice.split('.')
        element.goodsInfo.intPrice = onePrice[0];
        if (onePrice[1]) {
          element.goodsInfo.flootPrice = onePrice[1];
        } else {
          element.goodsInfo.flootPrice = '00';
        }
      });
      if (res.data.goodsList.length < this.data.pageSize) {
        this.setData({
          isLoading: false
        })
      } else {
        this.setData({
          isLoading: true
        })
      }
      this.setData({
        classificationList: allList,
        page: this.data.page + 1
      })
    })
  },
  onIsBigBrand(e) {
    var classificationList = this.data.classificationList;
    classificationList.forEach(element => {
      if (element.goodsInfo.goodsId == e.detail.goodsId) {
        element.goodsInfo.reminder = e.detail.reminder
      }
    });
    this.setData({
      classificationList,
    })
  },
  ontoUpImgs() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 200,
    })
  },
  showEventPopups() {
    this.setData({
      isEventPopupsHide: true
    })
  },
  onEventPopups() {
    this.setData({
      isEventPopupsHide: false
    })
  },
  goShop: throttle(function (e) {
    var goodsList = {};
    goodsList.goodsInfo = e.currentTarget.dataset.goodslist.goodsInfo
    var that = this;
    this.setData({
      isPopCart: true,
      addGoodsId: e.currentTarget.dataset.goodsid,
      addGoodslist: goodsList,
    }, () => {
      app.onevokeAddCart(that, e);
    })
  }),
  ongetTotle(e) {
    this.setData({
      totalCounts: e.detail.totalCount
    })
  },
  onhideCart(e) {
    var that = this
    app.onhideCart(that, e);
  },
  onStartPlay: throttle(function (e) {
    var videoWidth = +e.currentTarget.dataset.videowidth;
    var videoHeight = +e.currentTarget.dataset.videoheight;
    var changeWidth = '';
    var changeHeight = '';
    if (videoWidth > videoHeight) {
      if (videoWidth == 750) {
        changeWidth = videoWidth;
        changeHeight = videoHeight;
      } else {
        changeWidth = 750;
        changeHeight = 750 / (videoWidth / videoHeight)
      }

    } else {
      if (videoHeight == 750) {
        changeHeight = videoHeight;
        changeWidth = videoWidth;
      } else {
        changeHeight = 750;
        changeWidth = (videoWidth / videoHeight) * 750
      }

    }
    this.setData({
      shouVideo: e.currentTarget.dataset.isvideo,
      changeWidth,
      changeHeight,
    })
    console.log(videoWidth, videoHeight, changeWidth, changeHeight)
  }),
  hideVideo() {
    this.setData({
      shouVideo: ''
    })
  },
  xuanzhuang(e) {
    if (e.detail.fullScreen) {
      console.log('进入');
      this.setData({
        optional: false
      })
    } else {
      console.log('全屏关闭');
      this.setData({
        optional: true,
      })

    }
  },
  videoEnd(e) {
    this.setData({
      shouVideo: ''
    })

  },
  move() {
    return false;
  },
  onSegmentationList: throttle(function (e) {
    if (e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '/pages/goods/brandDetail/brandDetail?brandId=' + e.currentTarget.dataset.id
      })
    }

  }),
  goJumpUrl: throttle(function (e) {
    if (e.currentTarget.dataset.isvideo) {
      this.onStartPlay(e)
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
    }

  }),
  goProduct: throttle(function (e) {

    app.appProduct(e.currentTarget.dataset.goodsid)
  }),
  goAllShop: throttle(function (e) {
    wx.navigateTo({
      url: '/pages/goods/brandDetail/brandDetail?brandId=' + e.currentTarget.dataset.goodsid
    })
  }),
  // 名品汇聚轮播

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      foundList: true,
    })
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
    if (this.data.isLoading) {
      let page = this.data.page + 1
      this.getGoodsCategoryList(page)
    }

  },
  onPageScroll(e) {

    if (e.scrollTop > this.data.foundList) {
      if (this.data.tipsTextHideNum == '0') {
        this.setData({
          tipsTextHide: true
        })
      }
      this.setData({
        isFoundList: true,
      }, () => {
        if (this.data.tipsTextHideNum == '0') {
          setTimeout(() => {
            this.setData({
              tipsTextHide: false,
              tipsTextHideNum: 1
            })
          }, 3000)
        }

      })
    } else {
      this.setData({
        isFoundList: false
      })
    }
    if (e.scrollTop > app.globalData.phoneScreenHeight) {
      this.setData({
        toTheTop: true
      })
    } else {
      this.setData({
        toTheTop: false
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})