// components/product_b/package_details/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    price: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        this._price(newData)

      }
    },
    savePrice: String,
    pkgList: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        if (newData.length !== oldData.length) {
       
          this._getData(newData)
        }
      }
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    details_rmb: 0,
    nums: 0,
    numInt: '',
    decimal: '',
  },
  ready: function () {
    this.setData({

    })
  },
  /**
   * 组件的方法列表
   */
  attached(){
    this.triggerEvent('taoCanUp',)

  },
  methods: {
    _price(newData) {
      var numInt = parseInt(newData);
      var decimal = parseInt((+newData - numInt)) * 100;
      if (decimal == 0) {
        decimal = '0' + String(decimal)
      }
      this.setData({
        numInt: numInt,
        decimal: decimal
      });
    },
    _getData(newData) {
    
      var num = 0;
      newData.forEach(item => {
        num += item.num
      })
      this.setData({
        pkgList: newData,
        nums: num,
      });
    },
    showListdetails(e) {
    
      var goodsId = e.currentTarget.dataset.goodid;
      wx.navigateTo({
        url: '/pages/goods/product/product?goodsId=' + goodsId,
        success: function (res) {
        
        },
        fail: function (error) {
          console.log(error)
        }
      })
    },
  }
})