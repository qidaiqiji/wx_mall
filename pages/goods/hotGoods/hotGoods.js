// pages/hotGoods/hotGoods.js
const app = getApp()
const throttle = app.throttle
import api from '../../../utils/api.js'
const {
  hotGoodsIndex
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 10,
    imgHead: '',
    version: '',
    hot_goods: '',
    arr: [{
      name: '巨划算',
      url: '/images/tag_huasuan@2x.png',
      width: '65',
      height: '28'
    }, {
      name: '领劵',
      url: '/images/tag_lingquan.png',
      width: '48',
      height: '28'
    }, {
      name: '满减',
      url: '/images/tag_manjian@2x.png',
      width: '48',
      height: '28'
    }, {
      name: '满赠',
      url: '/images/tag_manzeng@2x.png',
      width: '48',
      height: '28'
    }, {
      name: '秒杀',
      url: '/images/miaosha1.png',
      width: '48',
      height: '28'
    }, {
      name: '贵宾价',
      url: '/images/tag_vip@2x.png',
      width: '65',
      height: '28'
    }, {
      name: '套餐',
      url: '/images/tag_taocan@2x.png',
      width: '48',
      height: '28'
    }, {
      name: '物料',
      url: '/images/tag_wuliao@2x.png',
      width: '48',
      height: '28'
    }, {
      name: '直降',
      url: '/images/zhijiang1.png',
      width: '48',
      height: '28'
    }],
    reachTheBottom: '',
    goodsList: [],
    topListZero: [],
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
    }, () => {
      this.setData({
        hot_goods: imgHead + 'activity/hot_goods.png?version=' + version,

      })
    })
    var page = 1;
    this.goHotGoodsIndex(page);

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
  // 请求数据
  goHotGoodsIndex(page) {
    var pageSize = this.data.pageSize
    hotGoodsIndex({
      page: page,
      pageSize: pageSize
    }).then(res => {
      var goodsList = [].concat(...this.data.goodsList, ...res.data.goodsList);
      goodsList.forEach(element => {
        element.goodsInfo.numInt = element.goodsInfo.goodsPrice.split('.')[0];
        element.goodsInfo.decimal = element.goodsInfo.goodsPrice.split('.')[1];
      });
      // 判断是否显示到底了
      this.isReachTheBottom(res.data.goodsList.length);
      if (page == 1) {
        var topListZero = res.data.topList;
      }else{
        var topListZero = this.data.topListZero
      };
      this.setData({
        ...res.data,
        topListZero,
        goodsList,
        page: this.data.page + 1,
      });
    });
  },
  // 判断是否显示到底了
  isReachTheBottom(e) {
    // 第一次从数据中取三个到顶部
    if (this.data.page == 1) {
      if (e >= 7) {
        var reachTheBottom = false;
      } else {
        var reachTheBottom = true;
      }
    } else {
      if (e >= 10) {
        var reachTheBottom = false;
      } else {
        var reachTheBottom = true;
      }
    }
    this.setData({
      reachTheBottom,
    });
  },
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  handleToBuy(e) {
    this.setData({
      isPopCart: true,
      addGoodsId: e.currentTarget.dataset.goodsid,
      addGoodslist: e.currentTarget.dataset.goodslist
    })

  },
  jumpToGoodsDetail: throttle(function (e) {
    var goodsId = e.currentTarget.dataset.goodsid;
    app.appProduct(goodsId)
  }, 2000),
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
    if (!this.data.reachTheBottom) {
      var page = this.data.page;
      this.goHotGoodsIndex(page)
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})