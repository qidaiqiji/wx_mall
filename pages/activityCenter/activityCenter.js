// pages/activityCenter/activityCenter.js
import api from '../../utils/api.js'
const app = getApp()
const {
  getactivityCenter,
  getactivityindex,
  getactivitygiftpkg,
  getactivityfullgift,
  getactivityfullcut
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemsText: ['小美活动', '限时秒杀', '精选套餐', '超值满赠'],
    currentTab: '0',
    activityCenter: '',
    toTheTop: false,
    date: '', //请求精选套餐的列表
    goodsList: [], // 列表
    fullCutTitle: '', // 惊喜满减头部文字
    startTime: '', // 惊喜满减头部时间
    requestLock: false,
    page: 1, //页数
    pageSize: 20, //数据多少
    hasMoreData: true,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tab
    if (!options.tab) {
      tab = 0
    }
    if (tab == 0) {
      this.setData({
        currentTab: options.tab || 0,
        requestLock: true
      })
      getactivityCenter().then(res => {
        this.setData({
          activityCenter: res.data,
          requestLock: false
        })
      }).catch(fail => {
        console.log('请求失败处理', fail);
      })
    } else {
      let index = options.tab
      this.itemtext(index)
    }
    // 常规活动
  },
  itemtext(e) {
    if (!e.currentTarget) {
      this.setData({
        currentTab: e,
        requestLock: true
      })
      this.isrequest(e);
    } else {
      var itemindex = e.currentTarget.dataset.itemindex
      if (this.data.currentTab == itemindex) {
        return false
      }else{
        this.setData({
          currentTab: itemindex,
          requestLock: true
        })
        this.isrequest(itemindex);
      }
     
    }

  },
  isrequest(index) {
    this.setData({
      goodsList: [],
      date: '',
      fullCutTitle: "",
      startTime: ""
    })
    if (index == 0) {
      this.zero()
    } else if (index == 1) {
      this.one()
    } else if (index == 2) {
      this.two()
    } else if (index == 3) {
      this.three()
    } else if (index == 4) {
      // this.four()
    }
  },
  switchSwiper: function (e) {
    if (this.data.requestLock) {
      return false;
    } else {
      var index = e.detail.current;
      this.setData({
        goodsList: [],
        date: '',
        fullCutTitle: "",
        startTime: ""
      })
      if (index == 0) {
        this.zero()
      } else if (index == 1) {
        this.one()
      } else if (index == 2) {
        this.two()
      } else if (index == 3) {
        this.three()
      } else if (index == 4) {
        // this.four()
      }
    }
    this.setData({
      currentTab: e.detail.current
    })
  },
  // 常规活动
  zero() {
    getactivityCenter().then(res => {
      this.setData({
        activityCenter: res.data,
      });
    });
    getactivityCenter().then(res => {
      this.setData({
        activityCenter: res.data,
        requestLock: false
      })
    }).catch(fail => {
      console.log('请求失败处理', fail);
    })


  },
  // 限量秒杀
  one() {
    console.log(this.data.requestLock, 'one1')
    getactivityindex().then(res => {
      this.setData({
        date: res.data.flashSaleList.date,
        goodsList: res.data.flashSaleList.goodsList,
        requestLock: false
      })
    });
  },
  // 请求精选套餐
  two() {
    getactivitygiftpkg().then(res => {
      this.setData({
        goodsList: res.data.goodsList,
        requestLock: false
      })
    });
  },
  // 超值满赠
  three() {
    getactivityfullgift({}).then(res => {
      this.setData({
        goodsList: res.data.flashSaleList,
        requestLock: false
      })
    });
  },
  // 惊喜慢慢(满减)
  four() {
    getactivityfullcut({

    }).then(res => {
      this.setData({
        fullCutTitle: res.data.fullCutTitle,
        goodsList: res.data.goodsList,
        startTime: res.data.timeStr,
        requestLock: false
      })
    });
  },
  onReady: function () {
    var windowHeight = app.globalData.appHeight;
    this.setData({
      windowHeight,
    });
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
  onReachBottom: function (e) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})