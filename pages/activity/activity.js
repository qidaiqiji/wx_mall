// pages/activity/activity.js
const {
  $Toast
} = require('../../dist/base/index');
import api from '../../utils/api.js';
const {
  activityMask,
  goodsGuessList,
  orderGroupLastOrder,
} = api
const app = getApp();
const throttle = app.throttle;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPageId: 'pages/activity/activity',
    requestLock: false,
    isLoading: false,
    toTheTop: false,
    wrapColor: '#2D42F7',
    goodsList: [],
    isPopCart: false,
    isActTime: false,
    page: 0,
    pageSize: 10,
    countDownShow: true,
    indextop: true,
    interval: '',
    arr: '',
    indextop: true,
    activityListTwo: [],
    goodsListLive: [],
    setIntervalOne: '',
    animationOne: {},
    animationTwo: {},
    miaoshaurl: '/pages/homePage/miaosha/miaosha',
    juhuasuangurl: '/pages/homePage/juhuasuan/juhuasuan',
    taocanurl: '/pages/homePage/anniversary/anniversary?title=2',
    manzengurl: '/pages/homePage/anniversary/anniversary?title=1',
    temaiScrollTop: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      manzeng_title: imgHead + 'activity/manzeng_title.png?version=' + version,
      juhuasuan_title: imgHead + 'activity/juhuasuan_title.png?version=' + version,
      will_rob: imgHead + 'activity/will_rob.png?version=' + version,
      miaosha_title: imgHead + 'activity/miaosha_title.png?version=' + version,
      taocan_title: imgHead + 'activity/taocan_title.png?version=' + version,
      temai_title: imgHead + 'activity/temai_title.png?version=' + version,
      will_rob_background: imgHead + 'activity/will_rob_background.png?version='+version,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 动画
    this.animation = wx.createAnimation();
    var setIntervalOne = setInterval(() => {
      this.translate();
      this.translateTwo();
      this.translateThree()
    }, 2000)
    this.setData({
      setIntervalOne,
    })
  },
  goParticulars: throttle(function () {
    wx.navigateTo({
      url: '/pages/homePage/miaosha/miaosha',
    })
  }),
  translate() {
    this.animation.translateY(-4).scale(0.8).step({
      duration: 800
    });
    this.animation.translateY(0).scale(0.8).step({
      duration: 800
    });

    this.setData({
      animationOne: this.animation.export()
    })
  },
  translateTwo() {
    this.animation.translateY(0).scale(0.8).step({
      duration: 800
    });
    this.animation.translateY(-4).scale(0.8).step({
      duration: 800
    });

    this.setData({
      animationTwo: this.animation.export()
    })
  },
  translateThree() {
    this.animation.translateY(-4).scale(0.9).step({
      duration: 800
    });
    this.animation.translateY(0).scale(0.9).step({
      duration: 800
    });

    this.setData({
      animationThree: this.animation.export()
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.ongetTotle()
    console.log(wx.getStorageSync('menus'), '33333333')
    orderGroupLastOrder().then(res => {
      this.setData({
        ...res.data,
        menus: wx.getStorageSync('menus'),
      }, () => {
        this.indexTopOnUp(this.data.lastOrderList)
      })
    })
    activityMask().then(res => {
      var activityListTwo = res.data.activityGoodsList
      activityListTwo.forEach(element => {
        element.objectPrice = app.segmentationPrice(element.goodsPrice)
      });
      wx.setBackgroundColor({
        backgroundColor: res.data.pageBgColor
      })
      wx.setNavigationBarTitle({
        title: res.data.actTitle,
      })
      this.setData({
        ...res.data,
        activityListTwo,
      }, () => {
        const query = wx.createSelectorQuery()
        query.select('.temai').boundingClientRect((res) => {
          console.log(res, '走了这里')
          if (res && res.top) {
            if (this.data.type == 'temai') {
              wx.pageScrollTo({
                scrollTop: res.top,
                duration: 0,
              })
            }
            this.setData({
              temaiScrollTop: res.top
            })
          }
        }).exec()
        this.setData({
          countDownShow: true
        })
      })
    })
    this.getGoodsGuessList(0);
  },
  goAdvertising: throttle(function (e) {
    app.adSpaceJump(e.currentTarget.dataset.item)
  }),
  indexTopOnUp(arr) {
    var indexNumber = arr.length;
    this.setData({
      interval: setInterval(() => {
        if (this.data.indextop) {
          setTimeout(() => {
            this.setData({
              indextop: false
            });
          }, 1500);
          var index = (Math.round(Math.random() * (indexNumber - 1) + 1) - 1);
          this.setData({
            arr: arr[index] || ''
          });
        } else {
          setTimeout(() => {
            this.setData({
              indextop: true,
            });
          }, 1500)
        }
      }, 2000)
    })

  },
  ongetTotle(e) {
    this.setData({
      totalCounts: app.globalData.totalCount
    })
  },
  goIndex() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  onevokeAddCart(e) {
    var that = this
    console.log(e)
    app.onevokeAddCart(that, e);
  },
  onhideCart(e) {
    var that = this
    that.setData({
      isPopCart: false
    }, () => {
      this.ongetTotle();
      if (e.detail && e.detail.msg) {
        $Toast({
          content: e.detail.msg
        });
      }

    })
  },
  allremind() {
    this.setData({
      isShowNavigation: true
    })
  },
  onallPreferential() {
    this.setData({
      isShowNavigation: false
    })
  },
  handleMenus(e) {
    this.setData({
      isShowNavigation: false
    })
    let intoPageId = e.detail.pageId
    let index = e.detail.index
    let initIsPageId = this.data.isPageId
    app.handleNavMenu(initIsPageId,this,index)
  },
  getGoodsGuessList(page) {
    goodsGuessList({
      page: page,
      pageSize: this.data.pageSize,
    }).then(res => {
      var allData = this.data.goodsListLive;
      allData = allData.concat([], ...res.data.goodsList)
      console.log(res.data.goodsList.length, this.data.pageSize)
      if (res.data.goodsList.length >= this.data.pageSize) {
        this.setData({
          goodsListLive: allData,
          page,
          requestLock: true,
          isLoading: true,
        })
      } else {
        this.setData({
          goodsListLive: allData,
          page,
          requestLock: false,
          isLoading: false,
        })
      }

    })
  },
  goShop: throttle(function (e) {
    app.appProduct(e.currentTarget.dataset.goodsid)
  }),
  ontoUpImgs() {
    app.handleJumpToTop();

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.interval)
    this.setData({
      countDownShow: false,
      goodsList: [],
      page: 0
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onPageScroll(e) {
    if (e.scrollTop > 550) {
      this.setData({
        isActTime: true
      })
    } else {
      this.setData({
        isActTime: false
      })
    }
    var that = this
    app.scrollRolling(that, e.scrollTop)
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
    console.log('requestLock', this.data.requestLock)
    if (this.data.requestLock) {
      let page = +this.data.page + 1
      this.getGoodsGuessList(page)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})