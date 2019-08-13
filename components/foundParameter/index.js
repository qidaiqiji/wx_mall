// components/foundParameter/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modal: String,
    foundgoods: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        if (newData.length !== oldData.length) {
          this._foundgoods(newData)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    modalName: null,
    maskLayer: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _foundgoods(newData) {
      this.setData({
        foundgoods: newData
      });
    },
    onConfirm(e) {
      this.triggerEvent('foundParameter')
    },
    showModal() {
      this.setData({
        modalName: this.properties.modal
      })
    },
    shopShow(e) {
      var goodsId = e.currentTarget.dataset.goodsid;
      var goodsList = e.currentTarget.dataset.foundgoods;
      this.triggerEvent('shopba', {
        goodsList,
        goodsId
      });
    },
    move() {
      return false;
    },
    scroll(e) {
    },
    isprice(e) {
      var goodsid = e.currentTarget.dataset.goodsid;
      wx.navigateTo({
        url: '/pages/goods/product/product?goodsId=' + goodsid,
        success: () => {}
      })
    }
  }
})