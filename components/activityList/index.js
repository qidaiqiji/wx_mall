// components/activityList/index.js
const app = getApp()
const throttle = app.throttle
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    url:String,
    titleTop:String,
    title: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        if (newData != oldData) {
          this._title(newData)
        }

      }
    },
    goodsList: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
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
    _title(newData){
      this.setData({
        title:newData
      })
    },
    _goodsList(newData) {
      newData.forEach(element => {
        element.goodsInfo.objectPrice = app.segmentationPrice(element.goodsInfo.goodsPrice)
      });
      this.setData({
        goodsList: newData
      })
    },
    goPrice: throttle(function (e) {
      app.appProduct(e.currentTarget.dataset.goodsid)
    }),
   
    goParticulars: throttle(function (e) {
      wx.navigateTo({
        url:e.currentTarget.dataset.url,
      })
    }),
  }
})