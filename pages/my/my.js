// pages/my/my.js
var coord = 0;
const app = getApp()
const throttle = app.throttle
import api from '../../utils/api.js'
const {
  userCheckIn,
  userIsCheckIn,
  getuser,
  orderGroupStatusNumList,
  blackCardAd
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_my_lingquan: '',
    toTheTop: false,
    userInfo: {},
    pagesModal: false,
    officialShow: false,
    checkInArr: [{
      date: 1,
      isCheckIn: false,
      omit: false
    }, {
      date: 2,
      isCheckIn: false,
      omit: false,
    }, {
      date: 3,
      isCheckIn: false,
      omit: false
    }, {
      date: 4,
      isCheckIn: false,
      omit: false
    }, {
      date: 5,
      isCheckIn: false,
      omit: false
    }, {
      date: 6,
      isCheckIn: false,
      omit: false
    }, {
      date: 7,
      isCheckIn: false,
      omit: false
    }],
    isShowSignInMsg: false,
    reacquire: false,
  },
  jumpToOrderList: throttle(function (e) {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {

      app.userType()
    } else {
      wx.navigateTo({
        url: '/pages/order/allOrders/allOrders?status=' + e.currentTarget.dataset.orders,
      })
    }

  }),
  jumpToCoupon: throttle(function (e) {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {

      app.userType()
    } else {
      wx.navigateTo({
        url: '/pages/self/coupon/coupon',
      })
    }
  }),
  jumpToOwnCoupon: throttle(function (e) {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
    } else {
      wx.navigateTo({
        url: '/pages/self/ownCoupon/ownCoupon',
      })
    }
  }),
  jumpToAddress: throttle(function () {
    wx.navigateTo({
      url: '/pages/aboutCart/address/address',
    })
  }),
  myCollection: throttle(function () {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {

      app.userType()
    } else {
      wx.navigateTo({
        url: '/pages/self/myCollection/myCollection',
      })
    }
  }),
  jumpToHelpCenter: throttle(function () {
    wx.navigateTo({
      url: '/pages/self/helpCenter/helpCenter',
    })
  }),
  jumpToMyInformation: throttle(function (e) {
    wx.navigateTo({
      url: '/pages/self/myInformation/myInformation',
    })
  }),
  daohuotixing: throttle(function () {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {

      app.userType()
    } else {
      wx.navigateTo({
        url: '/pages/self/remindlist/remindlist',
      })
    }

  }),
  handletips: throttle(function () {
    wx.navigateTo({
      url: '/pages/self/integral/integral/integral',
    })
  }),
  handletipssss() {
    this.setData({
      showToast: true,
      content: '功能暂未开发',
    })
  },
  handleJumpToIntegral: throttle(function () {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {

      app.userType()
    } else {
      wx.navigateTo({
        url: '/pages/self/integral/integral/integral',
      })
    }

  }),
  handlePhoneCall: throttle(function () {
    var number = '18928457720'
    if (app.globalData.userInfo.servicePhone) {
      number = app.globalData.userInfo.servicePhone
    }
    wx.makePhoneCall({
      phoneNumber: number,
    })
  }),
  handleOftenBuyList: throttle(function () {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {

      app.userType()
    } else {
      wx.navigateTo({
        url: '/pages/self/oftenBuyList/oftenBuyList',
      })
    }
  }),
  handleOfficialAccounts: throttle(function () {
    wx.navigateTo({
      url: '/pages/webView/webView?text=公众号',
    })
  }),
  handleLogOut: throttle(function () {
    this.setData({
      desc: '更换绑定的账号，原账号将自动解绑，是否继续？',
      pagesModal: true,
      confirm: 'logOut'
    })
  }),
  pagesModals(e) {
    // positions 1 取消；2继续
    var positions = e.detail.positions
    if (positions == 1) {
      this.setData({
        pagesModal: false
      })
    } else if (positions == 2) {

      this.setData({
        pagesModal: false
      }, () => {
        wx.clearStorage({
          fail: (error) => {
            consoile.log(error)
          }
        })
        wx.navigateTo({
          url: '/pages/login/login',
        })
      });
    }
  },
  officialShow(e) {
    this.setData({
      officialShow: e.detail.status == 0 ? false : true
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
      userInfo: app.globalData.userInfo,
      black_card: imgHead + 'activity/black_card.png?version=' + version,
      topBg: imgHead + 'my/img_my_bg@2x.png?version=' + version,
      vipIcon: imgHead + 'my/icon_crown_white.png?version=' + version,
      person_icon_order: imgHead + 'my/person_icon_order@2x.png?version=' + version,
      person_icon_payment: imgHead + 'my/person_icon_payment@2x.png?version=' + version,
      person_icon_receive: imgHead + 'my/person_icon_receive@2x.png?version=' + version,
      person_icon_return: imgHead + 'my/person_icon_return@2x.png?version=' + version,
      img_invitation: imgHead + 'my/img_invitation@2x.png?version=' + version,
      jifen: imgHead + 'my/jifen@2x.png?version=' + version,
      coupon: imgHead + 'my/￥@2x.png?version=' + version,
      person_icon_service: imgHead + 'my/person_icon_service@2x.png?version=' + version,
      person_icon_add: imgHead + 'my/person_icon_add@2x.png?version=' + version,
      icon_remind: imgHead + 'my/icon_remind@2x.png?version=' + version,
      icon_buyagain: imgHead + 'my/icon_buyagain@2x.png?version=' + version,
      help: imgHead + 'my/帮助中心@2x.png?version=' + version,
      person_icon_contact: imgHead + 'my/person_icon_contact@2x.png?version=' + version,
      person_icon_about_us: imgHead + 'my/person_icon_about us@2x.png?version=' + version,
      person_icon_exit: imgHead + 'my/person_icon_exit@2x.png?version=' + version,
      img_user: imgHead + "my/img_user.png?version=" + version,
      img_checkin: imgHead + "my/img_checkin@2x.png?version=" + version,
      icon_my_lingquan: imgHead + "icon_my_lingquan@2x.png?version=" + version
    })


  },
  showIscheckIn(data) {
    this.data.checkInArr.forEach(val => {
      data.signList.forEach(item => {
        if (item == val.date) {
          val.isCheckIn = true
        }
      })
      if (data.unsignList.length > 0) {
        data.unsignList.forEach(item => {
          if (item == val.date) {
            val.omit = true
          }
        })
      }
    })
    this.setData({
      checkInArr: this.data.checkInArr
    })
  },
  move() {
    return false;
  },
  handleSignIn() {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {

      app.userType()
    } else {
      userCheckIn().then(res => {
        if (res.code == 0) {
          this.setData({
            msg: res.msg,
            ...res.data,
            isShowSignInMsg: true
          })
          this.showIscheckIn(res.data)
          getuser().then(data => {
            if (!data.data.nickName) {
              data.data.nickName = app.globalData.userInfo.nickName
            }
            app.globalData.userInfo = {
              ...app.globalData.userInfo,
              ...data.data
            }
            this.setData({
              userInfo: app.globalData.userInfo
            })
          })
        } else {
          app.onToast(res.msg)
        }
      })
    }
  },
  handleConfirm() {
    this.setData({

      isShowSignInMsg: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
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
    if (!this.data.reacquire) {
      getuser().then(res => {
        if (!res.data.nickName) {
          res.data.nickName = app.globalData.userInfo.nickName
        }
        app.globalData.userInfo = {
          ...app.globalData.userInfo,
          ...res.data
        }
        this.setData({
          userInfo: app.globalData.userInfo,
          reacquire: true
        })
      }).catch(fail => {
        this.setData({
          reacquire: false
        })
      })
      userIsCheckIn().then(res => {
        this.setData({
          ...res.data,
          reacquire: true
        })
        this.showIscheckIn(res.data)
      }).catch(fail => {
        this.setData({
          reacquire: false
        })
      })
      blackCardAd().then(res => {
        this.setData({
          ...res.data,
          reacquire: true
        })
      }).catch(err => {
        this.setData({
          reacquire: false
        })
      })
    }
    this.onLoad()
    orderGroupStatusNumList().then(res => {
      this.setData({
        ...res.data
      })
    });

  },
  handleJump: throttle(function (e) {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {

      app.userType()
    }else{
      var item = e.currentTarget.dataset.item
      app.adSpaceJump(item)
    }
   
  }),
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.setStorageSync('isMy', true)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})