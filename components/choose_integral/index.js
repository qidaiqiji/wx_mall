// components/choose_integral/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    integralList: {
      type: Array,
      value: '',
      observer(newData, oldData) {
        this._integralList(newData)

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    values: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _integralList(newData) {
      this.setData({
        integralList: newData
      })
    },
    move() {
      return false
    },
    cancels() {
      var values = '';

      if(this.data.values){
        values = this.data.values
      }else{
        values = this.properties.integralList.length -1
      }
      this.triggerEvent('close', {
        values,
      });
    },
    confirm() {

      var values = '';
     
      if(this.data.values){
        values = this.data.values
      }else{
        values ='0'
      }
      this.triggerEvent('close', {
        values,
      });
    },
    bindChange: function (e) {
      const val = e.detail.value;
    
      this.setData({
        values: val
      })
    }
  }
})