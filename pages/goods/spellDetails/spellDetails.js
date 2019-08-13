// pages/goods/spellDetails/spellDetails.js
import api from '../../../utils/api.js'
const app = getApp();
const throttle = app.throttle;
const {
  groupShoppingView
} = api
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    spellDetailsHide: true,
    hidePopupWindow: false,
    scrollTop: 0,
    totalCount: '0',
    isLoading: 2,
    adviceLists: [],
    goodsId: '',
    onGroupCartShow:false,
  },

  /** 
   * 生命周期函数--监听页面加载 
   */

  onLoad: function (options) {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version;
    console.log(options.groupId, 'options.groupId,')
    groupShoppingView({
      groupId: options.groupId,
    }).then(res => {
      var adviceLists = [];
      res.data.objectPrice = app.segmentationPrice(res.data.groupInfo.price);
      res.data.adviceList.forEach(element => {
        element.groupId != options.groupId;
        adviceLists.push(element)
      });
      this.setData({
        ...res.data,
        imgHead: imgHead,
        version: version,
        adviceLists,
      }, () => {
        console.log(this.data, '+++++++')
        this.setData({
          isLoading: 1,
          img_pintuan_bg: this.data.imgHead + 'details/img_pintuan_bg.png?version=' + this.data.version,
        });

      });


    });
  },
  onGroupCart(e) {
    console.log(e.detail)
    if(e.detail){
      console.log(e.detail.groupId,'像偶像哦');
      this.setData({
        groupId:e.detail.groupId,
      })
    }else{
      console.log(e.detail,'信息偶像偶像哦')
    }
    this.setData({
      onGroupCartShow: true,
    })
  },
  ongroupCartHide() {
    this.setData({
      onGroupCartShow: false,
      groupId:'',
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
    this.setData({
      totalCount: app.globalData.totalCount,
      spellDetailsHide: true,
    })
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      // app.userType()
    }
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
  },
  isMaxShow(e) {
    var img = e.currentTarget.dataset.img || '';
    var imgs = e.currentTarget.dataset.imgs || [];
    wx.previewImage({
      current: img, // 当前显示图片的http链接 
      urls: imgs // 需要预览的图片http链接列表 
    })
  },
  isSpellRules: throttle(function () {
    this.setData({
      hidePopupWindow: true
    })
  }),
  onMyshow() {
    this.setData({
      hidePopupWindow: false
    })
  },
  onevokeAddCart(e) {
    console.log(e)
    var that = this;
    this.setData({
      isSpell: e.detail.isSpell,
      bottomSwitch: e.detail.bottomSwitch
    }, () => {
      app.onevokeAddCart(that, e)
    })
    console.log(this.data)
  },
  onhideCart(e) {
    this.setData({
      totalCount: app.globalData.totalCount,
      bottomSwitch: false
    })
    var that = this
    app.onhideCart(that, e)
  },
  /** 
   * 生命周期函数--监听页面隐藏 
   */
  onHide: function () {
    this.setData({
      spellDetailsHide: false
    })
  },

  /** 
   * 生命周期函数--监听页面卸载 
   */
  onUnload: function () {},
  ontoUpImgs() {
    app.handleJumpToTop();
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
  onShareAppMessage: function (options) {
    return {
      title: this.data.goodsName && this.data.goodsName,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }

  }
})