
import api from '../../../utils/api.js'
const { vipIndex, goodsList } = api
const app = getApp()
const throttle = app.throttle;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop:false,
    istrue:true,
    page: 1,
    pageSize: 20,
    requestLock: false,
    goodsList: [],
    reachTheBottom: false,
    isLoadings: true
  },
  jumpTogoodsList() {
    wx.createSelectorQuery().select('.vip_goodsList').boundingClientRect(function (rect) {
      wx.pageScrollTo({
        scrollTop: rect.top,
        duration: 0,
      })
    }).exec()


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
      totalCountVip: e.detail.totalCount
    })
  },
  onfixedPage(e){
    this.setData({
      isPopCart:e.detail.isPopCart
    })
  },
  handleShowBottomModal(){
    this.setData({
      isShowBottomModal: true
    }, () => {
      this.selectComponent("#showBottomModal").showModal();
    })
  },
  onhideMask(){
    this.setData({
      isShowBottomModal: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this.data.page
    let pageSize = this.data.pageSize
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo.version
    this.setData({
      imgHead,
      version,
      img_top_bg:imgHead+'vip/img_top_bg.png?version='+version,
      icon_vip_shop: imgHead+'vip/icon_vip_shop.png?version='+version,
      icon_vip_service: imgHead+'vip/icon_vip_service.png?version='+version,
      icon_rule: imgHead+'vip/icon_rule.png?version='+version,
      img_item: imgHead+'vip/img_item.png?version='+version,
      img_goods_bg: imgHead+'vip/img_goods_bg.png?version='+version,
      img_mendian: imgHead+'vip/img_mendian.png?version='+version,
      img_zhuanshuyouhui: imgHead+'vip/img_zhuanshuyouhui.png?version='+version,

    })
    vipIndex({ userRank: 4 }).then(res => {
      this.setData({
        ...res.data
      }, () => {
        goodsList({ userRank: 4, page, pageSize }).then(data => {
          this.setData({
            ...data.data
          })
        })
      })
    })
  },
  goAdvertising: throttle(function (e) {
    app.adSpaceJump(e.currentTarget.dataset.item)
  }),
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
    if (this.data.requestLock) {
      return false
    }
    this.setData({
      requestLock: true,
      isLoadings:true
    },()=>{
      let page = this.data.page + 1
      let pageSize = this.data.pageSize
      let oldgoodsList = this.data.goodsList
      goodsList({ userRank: 4, page, pageSize }).then(data => {
        let goodsList = oldgoodsList.concat(...data.data.goodsList)
        if (data.data.goodsList && data.data.goodsList.length < pageSize) {
          this.setData({
            goodsList,
            page,
            requestLock: true,
            reachTheBottom: true,
            isLoadings: false
          })
        } else {
          this.setData({
            goodsList,
            page,
            requestLock: false,
            isLoadings: true
          })
        }


      }).catch(res => {
        this.setData({
          requestLock: false,
          isLoadings: false
        })
      })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})