// components/checkGoodsItem/index.js
var myBehavior = require('../behaviors.js');
const app = getApp()
const throttle = app.throttle
const {
  $Message
} = require('../../dist/base/index');
Component({
  /**
   * 组件的属性列表
   */

  behaviors: [myBehavior],
  externalClasses: ['my-class'],
  options: {
    multipleSlots: true
  },
  properties: {
    brandId: Number,
    recId: Number,
    goodsName: String,
    goodsThumb: String,
    cartNum: Number,
    price: Number,
    isSelect: Number,
    startNum: Number,
    boxNum: Number,
    maxNum: Number,
    eventInfo: Array,
    buyByBox: Boolean,
    isAllEdit: Boolean,
    changed: Boolean,
    isVip:Boolean,
    goodsList: {
      type: Array,
      value: [],
      observer(newData, oldData) {
        this._getGoodsList(newData)
      }
    }
  },
  attached: function () {
  },
  /**
   * 组件的初始数据
   */
  data: {
    //  cartNum:0,
    //  isckecked:false,
    visible2: false,
    //小程序没有refs，所以只能用动态布尔值控制关闭
    toggle: false,
    actions: [{
        name: '删除',
        color: '#fff',
        width: 150,
        background: '#ff3366'
      }]
  },

  /**
   * 组件的方法列表
   */

  onShow() {
  },
  methods: {
    _getGoodsList(newData) {
      this.setData({
        goodsList: newData
      })
    },
    handleChecked(e) {
      var recId = e.currentTarget.dataset.index
      var isSelect = e.currentTarget.dataset.isselect
      var brandId = e.currentTarget.dataset.brandid
      this.triggerEvent('check', {
        recId,
        isSelect,
        brandId
      }, {})
    },
    handleToDetail: throttle(function(e) {
      if (e.currentTarget.dataset.isvip){
        wx.navigateTo({
          url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid +'&userRank=4',
        })
      }else{
        wx.navigateTo({
          url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid,
        })
      }

    }),
    cancelGoods(e){
      var index=e.currentTarget.dataset.index;

      this.triggerEvent("whatDelete",{recIdList:index});
      this.setData({
        toggle: this.data.toggle ? false : true
      });
    },
  }
})