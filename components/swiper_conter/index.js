// components/swiper_conter/index.js
const app = getApp();
const throttle = app.throttle;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showList: Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showListdetails:throttle(function(e){
      var goodId=e.currentTarget.dataset.goodid;
      wx.navigateTo({
        url: '/pages/goods/product/product?goodsId='+goodId,
      })
    })
  }
})