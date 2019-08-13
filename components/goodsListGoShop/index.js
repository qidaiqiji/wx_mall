// components/goodsListGoShop/index.js
const app = getApp()
const throttle = app.throttle
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        this._goodsList(newData)
      }
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
    _goodsList(newData) {
      this.setData({
        goodsList: newData
      })
    },
    cGoShop: throttle(function (e) {
      var goodsId = e.currentTarget.dataset.goodid
      app.appProduct(goodsId)
    }),
  }
})