// components/goodsItem_row/index.js
const app = getApp();
const throttle = app.throttle;
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
        this._getData(newData)
      }
    },
    haveDelete: Boolean,
    kind: String,
    noLook: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowMore: false,
    isShowId: '',
    isPopCart: false,
    goodsList: [],
    toggle2: false,
    actions: [{
      name: '删除',
      color: '#ed3f14'
    }],
  },
  ready() {},

  /**
   * 组件的方法列表
   */
  methods: {
    isAudit() {

      wx.navigateTo({
        url: '/pages/usable/usable',
      })
      return false;
    },
    _getData(data) {
      data.forEach(element => {

        element.arr = [];
        if (element.tagList) {
          element.tagList.forEach(item => {
            if (item.text == '新品' || item.text == '明星') {
              element.arr.push(item)
            }
          })
        }
        var onePrice = element.goodsInfo.goodsPrice.split('.');
        element.goodsInfo.intPrice = onePrice[0];
        element.goodsInfo.flootPrice = onePrice[1]
      });
      this.setData({
        goodsList: data
      });

    },
    onShowMore(e) {
      if (this.data.noLook) {
        this.isAudit()
      } else {
        this.setData({
          isShowMore: true,
          isShowId: e.currentTarget.dataset.goodsid
        })
      }
    },
    handleToBuy(e) {
      if (this.data.noLook) {
        this.isAudit()
      } else {
        this.triggerEvent('evokeAddCart', {
          isPopCart: true,
          addGoodsId: e.currentTarget.dataset.goodsid,
          addGoodslist: e.currentTarget.dataset.goodslist
        })
      }
    },
    jumpToGoodsDetail: throttle(function (e) {
      if (this.data.isLock) {
        return false;
      } else {
        this.setData({
          isLock: true
        })
        if (this.data.noLook) {
          this.isAudit()
          return false;
        } else {
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
        }
      }
    }),
    onfixedPage(e) {
      this.triggerEvent('fixedPage', {
        isPopCart: e.detail.fixedPage
      })
    },
    handlerCloseButton() {
      this.setData({
        toggle2: this.data.toggle2 ? false : true
      });
    },

  }
})