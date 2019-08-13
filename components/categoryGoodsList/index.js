// components/categoryGoodsItem_col/index.js
const app = getApp()
const throttle = app.throttle
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    kind: String,
    goodsList: {
      type: Array,
      value: [],
      observer(newData, oldData) {
        this._getGoodsList(newData)
      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isPopCart: false
  },
  attached: function () {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo.version
    this.setData({
      imgHead,
      version
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _getGoodsList(newData) {
      this.setData({
        goodsList: newData
      })
    },
    handleToBuy(e) {
    
      this.triggerEvent('evokeAddCart', {
        isPopCart: true,
        addGoodsId: e.currentTarget.dataset.goodsid,
        addGoodslist: e.currentTarget.dataset.goodslist
      })

    },
    jumpToGoodsDetail: throttle(function (e) {
      wx.navigateTo({
        url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid,
      })
    },2000),
  }
})