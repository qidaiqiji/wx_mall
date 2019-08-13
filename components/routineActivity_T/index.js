// components/routineActivity_T/index.js
const app = getApp();
const throttle = app.throttle;
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    windowHeight: String,
    currentTab: Number,
    date: {
      type: String,
      value: '',
      observer: function (newData, oldData) {

        if (newData !== null) {
          this.getdate(newData)
        }
      }
    },
    goodsList: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
     
        if (newData.length !== 0) {
         
          this._getgoodsList(newData)
        }
      }
    },
    // 满减2数据
    fullCutTitle: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        if (newData !== null) {
          this.getfullCutTitle(newData)
        }
      }
    },
    startTime: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
      
        if (newData !== null) {
          this.getstartTime(newData)
        }
      }
    },

  },





  ready() {

  },
  /**
   * 组件的初始数据
   */
  data: {
    stockStatusTxt: '',
    ifcolor: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 得到时间
    getdate(newData) {
      this.setData({
        date: newData
      })
    },
    // 得到列表
    _getgoodsList(newData) {
      this.setData({
        goodsList: newData,
      });
    

    },

    // 得到满减tap
    getfullCutTitle(newData) {
      this.setData({
        fullCutTitle: newData
      });
  
    },
    getstartTime(newData) {
      this.setData({
        startTime: newData
      });
    },
    showListdetails: throttle(function (e) {
      var goodsId = e.currentTarget.dataset.goodid;
      wx.navigateTo({
        url: '/pages/goods/product/product?goodsId=' + goodsId,
        success: function (res) {
       
        },
        fail: function (error) {
        
        }
      })
    }),
    handleToBuy(e) {
      this.triggerEvent('evokeAddCart', {
        isPopCart: true,
        addGoodsId: e.currentTarget.dataset.goodsid,
        addGoodslist: e.currentTarget.dataset.goodslist
      })


    },
    onhideCart(e) {
      clearTimeout(timmers);
      var timmers = setTimeout(() => {
        this.setData({
          isPopCart: false
        })

      }, 1500);
    },
    _numbers() {

    }
  }
})