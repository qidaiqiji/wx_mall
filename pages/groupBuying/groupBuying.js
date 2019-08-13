// pages/groupBuying/groupBuying.js
import api from '../../utils/api.js'
const {
  groupShoppingIndex,
  groupShoppingAdviceList
} = api
const app = getApp()
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNoGoods:false,
    groupBuying: true,
    toTheTop: false,
    goodsList: [],
    pageSize: 20,
    page: 1,
    requestLock: false,
    reachTheBottom: false,
    isLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      img_rexiao: imgHead + 'groupBuying/img_rexiao.png?version=' + version,
      img_bipin: imgHead + 'groupBuying/img_bipin.png?version=' + version,
    })
    groupShoppingIndex().then(res => {
      if (res.code == 0) {
        this.setData({
          isNoGoods: false
        })
      } else {
        this.setData({
          isNoGoods: true
        })
      }
      console.log(res, 'top')
      // let arr = res.data.hotList
      // let cloneArr = arr.slice()
      // let hotLists = cloneArr.map((item, index, self) => {
      //   return arr.splice(0, 4)
      // }).filter(item => item.length > 0)
      this.setData({
        ...res.data,
        // hotLists,
        groupBuying: true,
      })
    }).then(() => {
      let page = +this.data.page
      this.getGoodsList(page);
    }).catch(err => {
      console.log(err)
    })


  },
  getGoodsList(page) {
    if (!this.data.requestLock) {
      this.data.requestLock = true
      let pageSize = +this.data.pageSize
      let allData = this.data.goodsList
      this.setData({
        isLoading: page > 1 ? true : false
      }, () => {

      })
      groupShoppingAdviceList({
        pageSize,
        page,
        ids: this.data.ids
      }).then(res => {
        var listLength = res.data.goodsList.length
        allData = allData.concat([], ...res.data.goodsList);
        allData.forEach(element => {
          console.log(element.price, '价格')
          element.objectPrice = app.segmentationPrice(String(element.price))
        });
        if (res.data.goodsList.length < pageSize) {
          this.setData({
            goodsList: allData,
            page,
            requestLock: true,
            reachTheBottom: true,
            isLoading: false,
          })
        } else {
          this.setData({
            goodsList: allData,
            page,
            requestLock: false,
            isLoading: true,
          })
        }
        console.log(this.data.goodsList, 'goodsList')
      }).catch(res => {
        this.setData({
          requestLock: false,
          isLoading: false,
          reacquire: false
        })
      })
    }
  },
  jumpToBiPin: throttle(function (e) {

    wx.navigateTo({
      url: '/pages/goods/groupBiPinList/groupBiPinList',
    })

  }),
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  goProduct(e) {
    app.appProduct(e.currentTarget.dataset.goodsid)
  },
  goAdvertising: throttle(function (e) {
    app.adSpaceJump(e.currentTarget.dataset.item)
  }),
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      groupBuying: false
    })
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
    let page = +this.data.page + 1
    this.getGoodsList(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})