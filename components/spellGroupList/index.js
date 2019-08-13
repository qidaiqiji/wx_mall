// components/spellGroupList/index.js
const app = getApp();
const throttle = app.throttle;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsId: String,
    addCartList: Object,
    kind: String,
    groupList: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        this._groupList(newData)
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
    _groupList(newData) {
      newData.forEach(element => {
        element.mobiles = element.mobile.substring(0, 7) + '****'
      });
      this.setData({
        groupList: newData
      })
    },
    goOrder: throttle(function (e) {
      this.triggerEvent('evokeAddCart', {
        isPopCart: true,
        bottomSwitch: true,
        addGoodsId: e.currentTarget.dataset.goodsid,
        addGoodslist: e.currentTarget.dataset.goodslist,
        isSpell: e.currentTarget.dataset.isspell || '',
        groupId: e.currentTarget.dataset.groupid || '',
      })
    }),
  }
})