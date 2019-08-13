// components/goodsItem_col/index.js
const app = getApp()
const throttle = app.throttle
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    noLook: Boolean,
    isAccredit: {
      type: Boolean,
      value: true,
    },
    goodsList: {
      type: Array,
      value: [],
      observer(newData, oldData) {
        if (newData.length > 0) {
          this._getGoodsList(newData)
        }
      }
    },
    kind: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    rightTag: '',
    kind: '',
    isPopCart: false,
    noLook: false,
    imgHead: '',
    version: ''
  },
  ready() {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _getGoodsList(newData) {
    
      var rightTag = "";
      newData.forEach(element => {
        element.arr = [];
        if (element.tagList) {
          element.tagList.forEach(item => {
            if (item.text == '新品' || item.text == '明星') {
              element.arr.push(item)
            }
          })
        }
        element.goodsInfo.objectPrice= app.segmentationPrice(element.goodsInfo.goodsPrice)
      });
      this.setData({
        goodsList: newData,
        rightTag,
      });
    },
    onfixedPage(e) {
      this.triggerEvent('fixedPage', {
        isPopCart: e.detail.fixedPage
      })
    },
    handleToBuy(e) {
      if (this.data.noLook) {
        app.userType()
      } else {
        this.triggerEvent('evokeAddCart', {
          isPopCart: true,
          addGoodsId: e.currentTarget.dataset.goodsid,
          addGoodslist: e.currentTarget.dataset.goodslist
        })
      }

    },
    jumpToGoodsDetail: throttle(function (e) {
      if (this.data.noLook) {
       
        app.userType()
      } else {
        if (this.data.isLock) {
          return false;
        } else {
          this.setData({
            isLock: true
          })
        
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
  }
})