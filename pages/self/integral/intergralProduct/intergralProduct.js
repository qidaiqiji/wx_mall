// pages/integral/intergralProduct/intergralProduct.js
import api from '../../../../utils/api.js'
const {
  getshops
} = api;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsTxtView: '',
    toTheTop: false,
    isabsolute: '',
    nodetop: '', //节点坐标
    scrollTop: 0,
    heights: '',
    unnum: 1,
    ishide: false,
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
        this.setData({
          heights: calc
        })
      }
    });
    getshops({
      ...options,
    }).then(res => {
      res.data.price = parseInt(res.data.price);
      this.setData({
        ...res.data,
      }, () => {
        //创建节点选择器
        var that = this
        const query = wx.createSelectorQuery()
        //选择节点
        query.select('.product_zhi').boundingClientRect()

        query.select('#detailsTxt').boundingClientRect()
        query.exec(function (res) {
          console.log(res[1])
          that.setData({
            nodetop: res[0].top, // #the-id节点的上边界坐标
            detailsTxtView: res[1].top-38
          })

        });
      });
    });
  },
  ontoUpImgs() {
    console.log('+++++++3')
    this.setData({
      unnum: '1',
      scrollTop: this.data.scrollTop,
      isabsolute: '',
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
  },

  tap() {
    wx.pageScrollTo({
      scrollTop: this.data.detailsTxtView,
      duration: 100,
    })
  },
  tapMove() {
    this.setData({
      unnum: '1',
      scrollTop: this.data.scrollTop,
      isabsolute: '',
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
  },
  shopadd(e) {
    this.selectComponent('.Integralshopping').onConfirm()
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
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
    console.log(e.scrollTop, this.data.nodetop)
    if (e.scrollTop >= this.data.nodetop) {
      if (this.data.ishide) {
        return false;
      } else {
        this.setData({
          unnum: '2',
          isabsolute: 'isabsolute',
          ishide: true,
        })
      }
    } else {
      if (this.data.ishide) {
        this.setData({
          unnum: '1',
          isabsolute: '',
          ishide: false,
        })
      } else {
        return false;
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})