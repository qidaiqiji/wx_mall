// components/saleComponents/index.js
const app = getApp()
const throttle = app.throttle
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        if (newData.length != oldData.length) {
          this._title(newData)
        }

      }
    },
    actPageList: {
      type: Array,
      value: [],
      observer(newData, oldData) {
        if (newData.length != oldData.length) {
          this._actPageList(newData)
        }

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isActTime: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _actPageList(newData) {
      console.log(newData,'特卖')
      this.setData({
        actPageList: newData
      })
    },
    goDiscounts: throttle(function (e) {
      if (this.data.noLook) {
        app.userType()
      } else {
        var pageId = e.currentTarget.dataset.pageid;
        if (pageId) {
          wx.navigateTo({
            url: '/pages/homePage/preferential/preferential?pageId=' + pageId,
          })
        }
      }
    }),
  }
})