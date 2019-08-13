// components/orderGoodsItem_row/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    kind: String,
    goodsName: String,
    num: String,
    price: String,
    thumb: String,
    orderGoodsList: {
      type: Array,
      value: [],
      observer(newData, oldData) {
      
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodsItems: []
  },
  ready() {
   
  },
  attached() {
   
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goProduct(e) {
    
      var goodsId= e.currentTarget.dataset.goodsid;
      var kind = e.currentTarget.dataset.kind;
      app.appProduct(goodsId,kind)
    }
  }
})