// components/qiangGouGoods/index.js
const app = getApp();
const throttle = app.throttle;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsItem: {
      type: Object,
      value: {},
      observer: '_getGoodsList'
    },
    aboutToBegin: {
      type: Boolean,
      value: true,
      observer: function (newData, oldData) {

      }
    },
    date: {
      type: String,
      value: '',
      observer: '_getDate'
    }
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
    _aboutToBegin(newData) {
      this.setData({
        aboutToBegin: newData
      })
    },
    _getGoodsList() {
      if (this.data.goodsItem !== null) {
        let price = this.data.goodsItem.price
        let goodsPrice = String(price.goodsPrice)
        let goodsPriceArr = goodsPrice && goodsPrice.split('.')
        price.intGoodsPrice = goodsPriceArr[0]
        if (goodsPriceArr[1]) {
          price.decimalsGoodsPrice = goodsPriceArr[1]
        } else {
          price.decimalsGoodsPrice = '00'
        }
        this.setData({
          goodsItem: this.data.goodsItem
        })
      }
    },
    jumpToDetail: throttle(function (e) {
      wx.navigateTo({
        url: '/pages/goods/product/product?goodsId=' + this.data.goodsItem.goodsInfo.goodsId,
      })
    }),
    handleToBuy(e) {
      this.triggerEvent('evokeAddCart', {
        isPopCart: true,
        addGoodsId: e.currentTarget.dataset.goodsid,
        addGoodslist: e.currentTarget.dataset.goodslist
      })
    },
  }
})