// pages/self/integral/integral/integral.js
import api from '../../../../utils/api.js'
const {
  getshops,
  getuser,
  getExchangeIndex,
  couponTake
} = api
const app = getApp();
const throttle = app.throttle
Page({
  data: {
    toTheTop:false,
    userInfo: {},
    myUser: '',
    datas: '',
    pBalance: '',
    pAddCartList: {},
    pParketPrice: "",
    isShowNavigation: false,
    isPageId: 'pages/self/integral/integral/integral',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo.version
    this.setData({
      userInfo: app.globalData.userInfo,
      img_user: imgHead + "my/img_user.png?version=" + version,
      header_bg: imgHead + "self/bg.png?version=" + version,
      icon_dingdan: imgHead + "activeDirectory/icon_dingdan.png?version=" + version,
      icon_mingxi: imgHead + "activeDirectory/icon_mingxi.png?version=" + version,
      integral_activeHeader: imgHead + "activeDirectory/integral_activeHeader.png?version=" + version,
    })
    // 商品列表
    getExchangeIndex({}).then(res => {
      var goodsList = res.data.goodsList
      goodsList.forEach(item => {
        item.integral=parseInt(item.integral);
      })
      this.setData({
        ...res.data
      });
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {


  },
  // 领券
  coupon(e) {
    console.log(this.selectComponent('#premind'))
    var ruleId = e.currentTarget.dataset.ruleid;
    couponTake({
      ruleId: ruleId
    }).then(res => {
      app.onToast(res.msg)
      this.getMyUser();
      // 商品列表
      getExchangeIndex({}).then(res => {
        this.setData({
          ...res.data
        });
      });
    });

  },
  // 兑换商品
  shopexchange:throttle(function(e){
    var goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '/pages/self/integral/intergralProduct/intergralProduct?goodsId=' + e.currentTarget.dataset.goodsid,
    })
  }),
  mingxi:throttle(function(){
    wx.navigateTo({
      url: '/pages/self/integral/integralDataDetail/integralDataDetail',
    })
  }),
  dingdan:throttle(function(){
    wx.navigateTo({
      url: '/pages/self/integral/integralOrderList/integralOrderList',
    })
  }),
  handleJumpToRule() {
    wx.navigateTo({
      url: '/pages/self/integral/integralRule/integralRule',
    })
  },
  getMyUser() {
    getuser({}).then(res => {
      if (!res.data.nickName) {
        res.data.nickName = this.data.userInfo.nickName
      }
      this.setData({
        myUser: res.data,
      })
    });
  },
  immediatelyExchange:throttle(function(e){
    console.log(this.selectComponent('.Integralshopping').onConfirm())
    var goodsId = e.currentTarget.dataset.goodsid
    getshops({
      goodsId
    }).then(res => {
      this.setData({
        pBalance: res.data.balance,
        pAddCartList: res.data.addCartList,
        pParketPrice: res.data.marketPrice,
      });
    });
  }),
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
    app.handleNavMenu(initIsPageId, this, index)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
    this.getMyUser()
    this.setData({
      menus: wx.getStorageSync('menus'),
      isActTime: wx.getStorageSync('isInActivity')
      // isActTime:true
    })
  },
  ontoUpImgs() {
    app.handleJumpToTop();
   
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that,e.scrollTop )
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})