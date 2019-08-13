// components/goodsShow_active/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    desc:String,
    goodsList:{
      type:Array,
      value:[],
      observer(newData,oldData){
        this._getGoodsList(newData)
      },
    },
  },
  attached: function () { 
   
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
    _getGoodsList(newData){
      this.setData({
        goodsList:newData
      })
    }
  }
})
