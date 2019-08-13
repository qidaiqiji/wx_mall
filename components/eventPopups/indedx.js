// components/eventPopups/indedx.js
var WxParse = require('../../utils/wxParse/wxParse.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    purchaseTips: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        this._purchaseTips(newData)
      }
    },
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
    _purchaseTips(newData){

      var that = this;
      var article = newData;
      WxParse.wxParse('article', 'html', article, that, 5);
    },
    move() {
      return false;
    },

    showConfirm(e) {
      this.triggerEvent('eventPopups')
    },
  }
})