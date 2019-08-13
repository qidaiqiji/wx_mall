// components/goodlsListTwo_col/index.js
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
    system: ''
  },
  attached() {
    this.setData({
      system: app.globalData.system, //获取手机是不是ios
    });
   

  },
  /**
   * 组件的方法列表
   */
  methods: {
    goGoodsId: throttle(function (e) {
      wx.navigateTo({
        url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid,
      })
    }),
    _goodsList(newData) {
      var onePrice = newData.goodsInfo.goodsPrice.split('.');
      newData.goodsInfo.intPrice = onePrice[0];
      if (onePrice[1]) {
        newData.goodsInfo.flootPrice = onePrice[1];
      } else {
        newData.goodsInfo.flootPrice = '00';
      }
      this.setData({
        goodsList: newData
      });
    },
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