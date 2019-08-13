// components/navigationTools/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isBottom:{
      type:String,
      value:'20',
    },
    totalCount:{
      type:String,
      value:'',
      observer(newData,oldData){
        this._gettotalCount(newData)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    modalName: null,
    totalCount: '0'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _gettotalCount(newData){
      this.setData({
        totalCount:newData
      })
    },
    onIsShow: function () {
    
      if (this.data.isShow) {
        this.setData({
          isShow: false,
          modalName: null
        })
      } else {
        this.setData({
          isShow: true,
          modalName: 'navigation'
        })
      };
      var totalCount = app.globalData.totalCount;
      if (totalCount >= 100) {
        this.setData({
          totalCount : "99+"
        })
       
      } else {
        this.setData({
          totalCount
        })
      }
     
    },
  },
  ready() {
    
    var totalCount = app.globalData.totalCount;
    if (totalCount >= 100) {
      this.setData({
        totalCount : "99+"
      })
     
    } else {
      this.setData({
        totalCount
      })
    }
  },
  _appTotalCount() {
   

  }
})