// components/cartPopup/autoPopup/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showToast:{
      type:Boolean,
      value:false,
      observer(newData,oldData){
        this._getData(newData)
      }
    },
    warning:String,
    content:String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:false
  },

  /**
   * 组件的方法列表
   */
  onShow(){

  },
  methods: {
    _getData(newData){
     
      this.setData({
        showToast:newData
      },()=>{
        if (this.data.showToast){
          setTimeout(()=>{
            this.setData({
              showToast: false
            })
          },2000)
        }
      })
    },
  }
})
