// components/bottomModal/index.js
import api from '../../utils/api.js'
const app = getApp()
const {
  couponMatchCouponList
} = api
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    prepay: String,
    kind: String,
    goodsAllNum: String,
    goodsItemAll: {
      type: Array,
      value: [],
      observer(newData, oldData) {
        this._getGoodsList(newData)
      }
    },
    brandPop: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        this._getbrandPop(newData)
      },
    },
    pkgList: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        this._getpkgList(newData)
      },
    },
    couponList: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        this._getcouponList(newData)
      },
    },
    goodsIdList: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        this._getgoodsIdLists(newData)
      },
    },
    shippingInfo: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        this._getshippingInfo(newData)
      },
    },
    isarticle: {
      type: Boolean,
      value: false,
      observer(newData, oldData) {
        this._isarticle(newData)
      },
    },
    shippingSelections: {
      type: Array,
      value: [],
      observer(newData, oldData) {
        this._shippingSelections(newData)
      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    modalName: null,
    modalNames: false
  },
  created() {},
  ready() {
    if (this.data.kind == 'lingquan') {
      couponMatchCouponList({
        goodsIdList: this.data.goodsIdLists
      }).then(res => {
        this.setData({
          ...res.data
        })
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _isarticle(newData) {
      this.setData({
        _isarticle: newData
      })
    },
    _getgoodsIdLists(newData) {
      this.setData({
        goodsIdLists: newData
      })
    },
    _shippingSelections(newData) {
      this.setData({
        shippingSelections: newData
      })
    },
    _getGoodsList(newData) {
      this.setData({
        goodsList: newData
      })
    },
    _getbrandPop(newData) {
      this.setData({
        brandPop: newData
      })
    },
    _getpkgList(newData) {
      this.setData({
        pkgList: newData
      })
    },
    _getcouponList(newData) {
      this.setData({
        couponList: newData
      })
    },
    _getshippingInfo(newData) {
      this.setData({
        shippingInfo: newData
      })
    },
    move() {
      return false;
    },
    showModal: function (e) {
      var modalName = this.properties.kind
      this.setData({
        modalName,
      });
      this.setData({
        modalNames: true
      })
    },
    onConfirm: function (e) {
      this.setData({
        modalName: null,
        modalNames: false
      })
      this.triggerEvent('hideBrandMsg')
    },
    onCommonConfirm() {
      this.setData({
        modalName: null,
        modalNames: false
      })
      this.triggerEvent('hideMask')
    },
    onConfirmBrandActive() {
      this.setData({
        modalName: null,
        modalNames: false
      })
      this.triggerEvent('hideBrandActive')
    },
    jumpToDetailMsg() {
      var isShowRichText = true
      this.triggerEvent('showRichText', {
        isShowRichText
      }, {})

    },
    jumpToGoodsDetail(e) {
      wx.navigateTo({
        url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid,
      })
    },
    radioChange(e) {
      this.onConfirms(e.detail.value)
    },
    onConfirms(e) {
      this.setData({
        modalName: null,
        modalNames: false
      })
      this.triggerEvent('selectPostage', {
        values: e
      }, )
    }
  }

})