// components/xinpinGoodsItem/index.js
import api from '../../utils/api.js'
const {
  getremovdremind,
  noremovdremind,
} = api
const app = getApp();
const throttle = app.throttle
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {},
      observer: '_getGoodsItem'
    },
    xinpinGoodsItem: {
      type: Boolean,
      value: true,
      observer: "_xinpinGoodsItem"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    reminder: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _xinpinGoodsItem(e) {
      this.setData({
        xinpinGoodsItem: e
      })
    },
    _getGoodsItem() {
      let item = this.data.item
      let price = item.goodsPrice.split('.')
      item.price_int = price[0]
      item.price_float = price[1]
      this.setData({
        item,
        reminder: item.reminder ? item.reminder : 0
      })
    },
    jumpToDetail(e) {

      wx.navigateTo({
        url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid,
      })
    },
    // 增加我想要
    myWantTo: throttle(function (e) {
      var list = this.data.item
      var goodsId = e.currentTarget.dataset.goodsid;
      getremovdremind({
        goodsId: goodsId
      }).then(res => {
       
        if (res.code == 0) {
          this.setData({
            reminder: 1
          })
          this.triggerEvent('newPrompt', {
            e: '已设置想要'
          })
        } else if (res.code == 1002) {
          this.setData({
            reminder: 1
          })
          this.triggerEvent('newPrompt', {
            e: res.msg
          })
        } else {
          this.triggerEvent('newPrompt', {
            e: res.msg
          })
        }
      });
    }),
    //取消我想要
    wantTo: throttle(function (e) {
      var goodsId = e.currentTarget.dataset.goodsid;
      noremovdremind({
        goodsId: goodsId
      }).then(res => {
       
        if (res.code == 0) {
          this.setData({
            reminder: 2
          })
          this.triggerEvent('newPrompt', {
            e: '已取消想要'
          })
        } else {
          this.triggerEvent('newPrompt', {
            e: res.msg
          })
        }
      })
    }),
  }
})