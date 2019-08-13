// components/navigationToolsTwo/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    RbottomToTheTopight: {
      type: Number,
      value: 24,
      observer: function(newData, oldData) {
       
        this._isRbottomToTheTopight(newData)
      }
    },
    bottomToTheTop: {
      type: Number,
      value: 20,
      observer: function(newData, oldData) {
        this._bottomToTheTop(newData)
      }
    },
    toTheTop: Boolean,
    backTop: {
      type: Boolean,
      value: true,
      observer: function (newData, oldData) {
       
        this._backTop(newData)
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
    _isRbottomToTheTopight(newData) {
      this.setData({
        RbottomToTheTopight: newData
      })
    },
    _bottomToTheTop(newData) {
      this.setData({
        bottomToTheTop: newData
      })
    },
    _backTop(newData) {
      this.setData({
        backTop: newData
      })
    },
    toUpImg() {
      this.triggerEvent('toUpImgs')
    },
    handleContact(e) {
     
    }
  }
})