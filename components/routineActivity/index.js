// components/routineActivity/index.js

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    windowHeight:String,
    activityCenter: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        if (newData !== null) {
          this.getactivityCenter(newData)
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready() {
  },
  created() {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getactivityCenter(newData) {
     
      this.setData({
        activityCenter:newData
          })
        
    }
  }
})