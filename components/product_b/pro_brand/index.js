// components/product_b/pro_brand/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mystatus:String,
    brand: Object,
    linkGoods:{
      type:  Array,
      value: [],
      observer: function (newData, oldData) {
        this.getlinkGoods(newData)
      }
    },
    goodsDesc: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        this._getData(newData)
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    goodsDesc: '',
    linkGoods:''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _getData(newData) {
      this.setData({
        goodsDesc: newData
      })
    },
    getlinkGoods(newData) {
      this.setData({
        linkGoods: newData
      });
     
    },
    jumpToBrandDetail(e){
      wx.navigateTo({
        url: '/pages/goods/brandDetail/brandDetail?brandId=' + e.currentTarget.dataset.brandid,
      })
    },
    linkGoods(e){
      wx.navigateTo({
        url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid,
      })
    },
    midad(){
      wx.navigateTo({
        url: '/pages/webView/webView?text=' + '正品保障',
      })
    }
  }
})