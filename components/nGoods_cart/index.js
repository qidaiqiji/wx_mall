// components/nGoods_cart/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList: {
      type: Array,
      value: [],
      observer(newData, oldData){
      
        if (newData.length !== oldData.length) {
          
          this._getGoodsList(newData)
        }

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready() {
 
  },
  detached() {
  

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
    handleToPurchase(){
      wx.navigateTo({
        url: '/pages/goods/goodsLists/goodsLists',
      })
    }
  }
})