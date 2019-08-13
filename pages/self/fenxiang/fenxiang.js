// pages/self/fenxiang/fenxiang.js
import api from '../../../utils/api.js'
const {
  userInvite,
  userInfo
} = api
const app = getApp()
Page({
  data: {
    toTheTop: false,
    iskind: '',
    urll: '',
    usernumber: '',
    usercode: '',
    code: '',
    num: 0,
    ms: '#FFAEC2',
    mss: '#FFAEC2',
    maxNum: 0, //验证成功时的坐标，
    // nohidden: false,
    hide: 1,
    userId: '',
    windowHeight:'',
    share:'',
  },
  onLoad: function(options) {
    var windowHeight = app.globalData.appHeight - 60;
    this.setData({
      windowHeight,
    })
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo.version
    if (options.bad) {
      $Toast({
        content: '您的账号异常请联系'
      });
    }
    this.setData({
      ...options,
      img_yaoqing_bg: imgHead + 'img_yaoqing_bg_2.png?version=' + version,
      share:imgHead + 'share.jpg?version=' + version
    })
    userInvite().then(res => {
      this.setData({
        ...res.data
      });
      console.log("商品列表", res)
    });
    userInfo({}).then(res => {
      this.setData({
        ...res.data
      });
      console.log("商品列表", res)
    });

  },
  onShow(){
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
    }
  },

  onShareAppMessage: function(ops) {

    if (this.data.userId){
      return {
        title: '采最正的品，卖最火的货',
        // imageUrl: this.data.share,

        path: `/pages/self/shareSignIn/shareSignIn?userId=${this.data.userId}`, //点击分享的图片进到哪一个页面
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
  },

  ontoUpImgs() {
    app.handleJumpToTop();
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
  },
  hongbao(){
    wx.navigateTo({
      url: '/pages/self/ownCoupon/ownCoupon',
    })
  },
  agreement() {
    wx.navigateTo({
      url: '/pages/aboutCart/agreement/agreement',
    })
  },
  handleJumpToRule() {

    this.setData({
      iskind: true
    });
    console.log(this.data.iskind)
  },
  isShow() {
    this.setData({
      iskind: false
    })
  }
})