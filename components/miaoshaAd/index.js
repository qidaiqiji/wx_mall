// components/miaoshaAd/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    indexGoods: {
      type: Boolean,
      value: false,
      observer(newData, oldData) {
        this._indexGoods(newData)
      },
    },
    noLook: Boolean,
    isAccredit: {
      type: Boolean,
      value: true,
    },
    hotGoods: {
      type: Object,
      value: {},
      observer: '_getHotGoods'
    },
    isJumpToDetail: {
      type: Boolean,
      value: true
    }
  },
  attached() {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo.version || ''
    this.setData({
      imgHead,
      version,
      img_tag_miaosha: imgHead + 'img_tag_miaosha.png?version=' + version,
    })
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
    _indexGoods(newData) {
     
    },
    _getHotGoods() {
    
      if (this.data.hotGoods !== null) {
        let hotGoods = this.data.hotGoods
        let goodsPrice = String(hotGoods.goodsPrice)
      
        let goodsPriceArr = goodsPrice && goodsPrice.split('.')
       
        hotGoods.intGoodsPrice = goodsPriceArr[0]
        if (goodsPriceArr[1]) {
          hotGoods.decimalsGoodsPrice = goodsPriceArr[1]
        } else {
          hotGoods.decimalsGoodsPrice = '00'
        }
        this.setData({
          hotGoods: this.data.hotGoods
        })
      }
    },
    jumpToPage(e) {
      if (this.data.isJumpToDetail) {
        wx.navigateTo({
          url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid,
        })
      }
    }
  }
})