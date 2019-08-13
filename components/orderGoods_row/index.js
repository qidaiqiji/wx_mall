// components/orderGoods_row/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsListConfirm: {
      type: Array,
      value: [],
      observer(newData, oldData) {
        this._getGoodsListConfirm(newData)
      }
    },
    kind: String,
    confirmOrder: Boolean,
    goodsList: {
      type: Array,
      value: [],
      observer(newData, oldData) {

        if (newData !== null && newData.length > 0) {
          this._getGoodsList(newData)
        }
      }
    },
    orderGoodsListItem: Array,
    orderGoodsList: {
      type: Array,
      value: [],
      observer(newData, oldData) {

        if (newData !== null && newData.length > 0) {
          this._getOrderGoodsList(newData)
        }

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached() {

  },
  ready() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    _getGoodsListConfirm(newData) {
      console.log(newData);
      this.setData({
        goodsListConfirm:newData,
      })
    },
    _getOrderGoodsList(newData) {
      console.log(newData, 'orderGoodsList')
      this.setData({
        orderGoodsList: newData
      })
    },
    _getGoodsList(newData) {
      console.log(newData, 'newData')
      this.setData({
        goodsList: newData
      }, () => {

        const goodsList = this.data.goodsList
        var burdening = goodsList.map(item => (({
          giftList,
          wuliaoList
        }) => ({
          giftList,
          wuliaoList
        }))(item))

        var allItemArr = burdening.map(val => [].concat(...val.giftList, ...val.wuliaoList))

        const goodsListItem = goodsList.map(item =>
          (({
            cartNum,
            goodsName,
            price,
            showOutTag,
            tag,
            tagColor,
            thumb
          }) => ({
            cartNum,
            goodsName,
            price,
            showOutTag,
            tag,
            tagColor,
            thumb
          }))(item))

        this.setData({
          showGoodsList: [].concat(goodsListItem, ...allItemArr)
        })
      })
    }
  }
})