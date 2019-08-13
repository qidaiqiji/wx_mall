// components/reachTheBottom/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    reachTheBottom:{
      type:String,
      value:'已经到底了',
      observer(newData, oldData) {
        if (newData !=oldData) {
          this._reachTheBottom(newData)
        }
      }
    },
    isBgWhite:Boolean
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
    _reachTheBottom(newData){
      this.setData({
        reachTheBottom:newData
      })
    }
  }
})
