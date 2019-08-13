// components/activeGoodsItem/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsItem:{
      type:Object,
      value:{},
      observer:'_getGoodsItem'
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
    _getGoodsItem(){

    },
    jumpToDetail(e){
      wx.navigateTo({
        url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.id
      })
    }
  }
})
