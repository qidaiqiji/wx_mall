// pages/activeDirectory/ledPassword/ledPassword.js
const {
  $Toast
} = require('../../../dist/base/index');
import api from '../../../utils/api.js'
const {
  passwordCouponTakePrize,
  getActivityInfo,
} = api
const app = getApp();
const throttle = app.throttle
Page({

  /** 
   * 页面的初始数据 
   *  
   */
  data: {
    viewHeight: '',
    imgHead: '',
    version: '',
    img_bg: '',
    value: '', //口令 
    pagesModal: false,
    passwordCode: '',
    prizeRuleId:'',
  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        console.log(calc, 'calc', res.windowHeight, res.screenHeight, res.screenHeight * (750 / res.screenWidth))
        this.setData({
          viewHeight: calc
        })

      }
    });
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      imgHead,
      version,

    })
    this.setData({
      img_bg: imgHead + 'img_bg.png?version=' + version,
    })
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
    getActivityInfo().then(res => {
      console.log(res, '44444');
      this.setData({
        ...res.data
      })
    })
  },
  bindnumder(e) {
    var value = e.detail.value
    console.log();
    this.setData({
      value
    });
  },
  award() {

  },
  tuIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  theRules() {
    this.setData({
      isKind: 'guize'
    })
  },
  isShow(e) {
    this.setData({
      isKind: ''
    });
  },
  onNextGet() {
    if (this.data.passwordCode == 1001) {
      wx.navigateTo({
        url: '/pages/login/login?prizeRuleId='+this.data.prizeRuleId
      })
    } else {
      wx.navigateTo({
        url: '/pages/self/ownCoupon/ownCoupon'
      })
    }
  },
  pagesModals() {
    this.setData({
      pagesModal: false
    });
  },
  isGetPhoneNumber: throttle(function () {
    $Toast({
      content: '请输入口令'
    });
  }),
  getPhoneNumber: throttle(function (e) {
    // 同意 getPhoneNumber:ok
    // 拒接 getPhoneNumber:fail user deny
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      this.agreedTo(e.detail)
    } else {
      console.log('2')
    }
  },1500),
  agreedTo(e) {
    console.log(e)

    wx.login({
      success: (res) => {
        passwordCouponTakePrize({
          code: res.code,
          password: this.data.value,
          encryptedData: e.encryptedData,
          iv: e.iv
        }).then(val => {
          this.setData({
            prizeRuleId:val.data.prizeRuleId||val.data.prizeRuleId
          })
          if (val.code == 0 || val.code == 1001) {
            this.setData({
              isKind: 'isPassword',
              passwordCode: val.code,
            })
          } else {
            $Toast({
              content: val.msg
            });
          }
        })

      }
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
  onPageScroll(e) {

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

    return {
      title: this.data.activityName,
      // imageUrl: this.data.share,
      path: `/pages/activeDirectory/ledPassword/ledPassword`, //点击分享的图片进到哪一个页面
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  }
})