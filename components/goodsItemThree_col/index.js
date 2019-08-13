// components/goodsItemThree_col/index.js
const app = getApp();
const throttle = app.throttle;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        this._goodsList(newData)
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
    _goodsList(newData) {
      let goodsInfo = newData.goodsInfo && newData.goodsInfo
      var onePrice = goodsInfo.goodsPrice&&goodsInfo.goodsPrice.split('.');
      goodsInfo.intPrice = onePrice&&onePrice[0];
      if (onePrice &&onePrice[1]) {
        goodsInfo.flootPrice = onePrice&&onePrice[1];
      } else {
        goodsInfo.flootPrice = '00';
      }
      this.setData({
        goodsList: newData
      });
    },
    jumpToGoodsDetail: throttle(function (e) {
      if (this.data.kind == "vip") {
        wx.navigateTo({
          url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid + '&userRank=4',
          success: () => {
            this.setData({
              isLock: false
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid,
          success: () => {
            this.setData({
              isLock: false
            })
          }
        })
      }
    }),
    preferentialShop: throttle(function () {
      var goodsList = this.data.goodsList;
  
      this.triggerEvent('evokeAddCart', {
        isPopCart: true,
        addGoodsId: goodsList.goodsInfo.goodsId,
        addGoodslist: goodsList,
      });
    }),
  }
})