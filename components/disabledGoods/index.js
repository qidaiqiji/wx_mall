// components/disabledGoods/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    goodsName: String,
    goodsThumb: String,
    status: String,
    recId:String,
    goodsId:String,
  },
  attached: function () {
   
  },
  /**
   * 组件的初始数据
   */
  data: {
    visible2: false,
    //小程序没有refs，所以只能用动态布尔值控制关闭
    toggle: false,
    actions: [{
        name: '删除',
        color: '#fff',
        width: 150,
        background: '#ff3366'
      }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancelGoods(e){
    
      this.triggerEvent("hideModal",{recId:this.properties.recId});
    
      this.setData({
        toggle: this.data.toggle ? false : true
      });
    },
  }
})
