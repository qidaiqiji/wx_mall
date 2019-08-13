// components/modal/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    confirm: {
      type: String,
      value: '',
      observer(newData, oldData) {
        this._confirm(newData)
      }
    },
    desc: {
      type: String,
      value: '确定要删除失效宝贝吗？',
      observer(newData, oldData) {
        this._desc(newData)
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    isConfirm() {

      if (this.properties.confirm == 'confirm') {
        this.triggerEvent('confirmTo');
      } else if (this.properties.confirm == '确认') {
        this.triggerEvent('pagesModal');
      } else if (this.properties.confirm == '去认证') {
        this.triggerEvent('pagesModal', {
          positions: 1
        });
      }
    },
    modalDelete(e) {
      var positions = e.currentTarget.dataset.positions

      this.triggerEvent('pagesModal', {
        positions: positions
      })

    },
    handleLogOut(e) {
      var positions = e.currentTarget.dataset.positions

      this.triggerEvent('pagesModal', {
        positions: positions
      })
    },
    modalGo() {
      wx.navigateTo({
        url: '/pages/usable/usable'
      })
    },
    _desc(newData) {

      this.setData({
        desc: newData
      })
    },
    _confirm(newData) {

      this.setData({
        confirm: newData
      })
    },
  }
})