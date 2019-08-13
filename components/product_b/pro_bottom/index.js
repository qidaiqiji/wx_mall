// components/product_b/pro_bottom/index.js
const app = getApp();
const throttle = app.throttle;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spellDetailsHide: Boolean,
    actPrice: String,
    price: String,
    spellBottom: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        this._spellBottom(newData)
      }
    },
    groupInfo: Object,
    brandId: String,
    addCartList: Object,
    goodsId: String,
    status: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        this.getstatus(newData)
      }
    },
    totalCount: {
      type: String,
      value: {},
      observer: function (newData, oldData) {
        this._totalCount(newData)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isSpell: 1,
    dibu: 0,
  },


  /**
   * 组件的方法列表
   */
  methods: {
    _spellBottom(newData) {
      console.log(newData)
      this.setData({
        spellBottom: newData,
        isSpell: 0
      })
    },
    _totalCount(newData) {
      if (newData >= 100) {
        this.setData({
          totalCount: "99+"
        })
      } else {
        this.setData({
          totalCount: newData
        })
      };

    },
    getstatus(newData) {
      if (newData) {
        // vip 1 套餐 2 聚划算3 秒杀4 直发5 代发6 拼团即将开始  7 拼团发起 8
        // 先判断是不是拼团是 isSpell 2，不是 isSpell 1
        if (newData.isGroupShopping) {
          this.setData({
            dibu: 8,
            isSpell: 2,
          })
        } else if (newData.isVip) {
          this.setData({
            dibu: 1
          })
        } else if (newData.isJuHuaSuan) {
          this.setData({
            dibu: 3
          })
        } else if (newData.isFlashSale) {
          this.setData({
            dibu: 4
          })
        } else if (newData.isSuperPkg) {
          this.setData({
            dibu: 2
          })
        } else if (newData.isZhiFa) {
          this.setData({
            dibu: 5
          })
        } else if (newData.isNotStartGroupShopping) {
          this.setData({
            dibu: 7,
            isSpell: 2,
          })
        } else {
          this.setData({
            dibu: 6
          })
        }
      }
    },
    myup: function (e) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    },
    gouwuup() {
      wx.switchTab({
        url: '/pages/cart/cart'
      })
    },
    brandDetail(e) {
      var brandId = this.properties.brandId

      wx.navigateTo({
        url: '/pages/goods/brandDetail/brandDetail?brandId=' + brandId,
      })
    },
    handleToBuy(e) {
      this.triggerEvent('evokeAddCart', {
        isPopCart: true,
        addGoodsId: e.currentTarget.dataset.goodsid,
        addGoodslist: e.currentTarget.dataset.goodslist,
        isSpell: e.currentTarget.dataset.isspell || '',
        groupId: e.currentTarget.dataset.groupid || '',
      })

    },
    handleToSpell(e) {
      console.log(e.currentTarget.dataset)
      this.triggerEvent('evokeAddCart', {
        isPopCart: true,
        bottomSwitch: true,
        addGoodsId: e.currentTarget.dataset.goodsid,
        addGoodslist: e.currentTarget.dataset.goodslist,
        isSpell: e.currentTarget.dataset.isspell || '',
        groupId: e.currentTarget.dataset.groupid || '',
      })
    },
    handleToSpells() {
      this.triggerEvent('groupShoppingCart', )
    }
  },
})