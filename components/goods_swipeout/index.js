// components/goodsItem_row/index.js
const {
  $Message
} = require('../../dist/base/index');
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    goodsList: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        if (newData.length !== oldData.length) {
          this._getData(newData)
        }

      }
    },
    haveDelete: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowMore: false,
    isShowId: '',
    undel:true,
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
  attached: function () {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    _getData(data) {
      data.forEach(element => {
        var onePrice = element.goodsInfo.goodsPrice.split('.');
        element.goodsInfo.intPrice = onePrice[0];
        element.goodsInfo.flootPrice = onePrice[1];

      });
      this.setData({
        goodsList: data
      })
    },
    onShowMore(e) {
      this.setData({
        isShowMore: true,
        isShowId: e.currentTarget.dataset.goodsid
      })
    },
    onHiddleMore() {
      this.setData({
        isShowMore: false,
        isShowId: ''
      })
    },
    jumpToGoodsDetail(e) {
      wx: wx.navigateTo({
        url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid,
      })
    },
    dels(){
    

      this.setData({
        undel:!this.data.undel
      })
    },
    cancelGoods(e){
      var goodsid=e.currentTarget.dataset.goodsid;
     
      this.triggerEvent("action",{goodsid:goodsid});
      this.setData({
        toggle: this.data.toggle ? false : true
      });
    },

    handleToBuy(e) {
        this.triggerEvent('evokeAddCart', {
          isPopCart: true,
          addGoodsId: e.currentTarget.dataset.goodsid,
          addGoodslist: e.currentTarget.dataset.goodslist
        })
    },

  }
})