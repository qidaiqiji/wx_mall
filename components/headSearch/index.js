// components/headSearch/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hezi: {
      type: String,
      value: '',
      observer(newData, oldData) {

        this._hezi(newData)

      }
    },
    iscolor: String,
    keywords: {
      type: String,
      value: '',
      observer: '_getKeyWords'
    },
    kind: String,
    isid: String,
    noLook: Boolean,
    isAccredit: {
      type: Boolean,
      value: true
    },
    index: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    iscolor: '',
    noLook: false,
  },
  attached() {

  },
  ready() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    _hezi(newData) {
      this.setData({
        hezi: newData
      })
    },
    _getKeyWords() {
      this.setData({
        keywords: this.data.keywords
      })
    },
    isbackground(e) {
      this.setData({
        iscolor: e
      })
    },
    handleJumpToSearch() {
      if (this.data.noLook) {
        app.userType()
      } else {
        var pages = getCurrentPages() //获取加载的页面
        var prevPage = pages[pages.length - 2] //获取上页面的对象
        if (prevPage && prevPage.route == 'pages/search/search') {

          prevPage.setData({
            kind: this.properties.kind,
            isid: this.properties.isid,
          });
          wx.navigateBack({
            delta: 1
          })
          return false
        } else {
          wx.navigateTo({
            url: '/pages/search/search?kind=' + this.properties.kind + '&isid=' + this.properties.isid + '&keywords=' + this.properties.keywords +'&hezi='+this.properties.hezi,

          })
        }
      }

    }
  }
})