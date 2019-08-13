// components/groupShoppingCart/index.js
const {
  $Toast
} = require('../../dist/base/index');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actGoodsId: {
      type: Number,
      value: 0,
      observer: function (newData, oldData) {
        this._actGoodsId(newData)
      }
    },
    actGoodsId: Number,
    groupId: String,
    checkoutList: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        if (newData) {
          this._checkoutList(newData)
        }

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    groupCartShow: false,
    value: 0,
    totalprice: 0,
    content: '',
    contentBOn: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _getGroupShoppingInfo(newData) {
      console.log(newData)
      this.setData({
        groupShoppingInfo: newData
      })
    },
    _checkoutList(newData) {

       var price = newData.actPrice * newData.start
       this.count(newData.start,price) 
      this.setData({
        checkoutList: newData,
        value: newData.start,
        groupCartShow: true,
      })
    },
    onConfirm() {
      this.setData({
        groupCartShow: false
      })
      this.triggerEvent('groupCartHide')
    },
    reduce(e) {
      console.log(e.currentTarget.dataset)
      var actPrice = +e.currentTarget.dataset.actprice;
      var value = +e.currentTarget.dataset.value;
      var start = e.currentTarget.dataset.start;
      var numberPerBox = e.currentTarget.dataset.numberperbox;
      var isbuybybox = e.currentTarget.dataset.isbuybybox;
      if (isbuybybox) {
        if (value - numberPerBox < start) {
          this.setData({
            value,
          })
          let msg = '亲，已经不能再少了哦';
          this.remind(msg);
        } else {
          this.setData({
            value: value - numberPerBox,
          }, () => {
            var price = this.data.value * actPrice
            this.count(this.data.value,price) 
          })
        }
      } else {
        if (value - 1 < start) {
          this.setData({
            value,
          })
          let msg = '亲，已经不能再少了哦';
          this.remind(msg);
        } else {
          this.setData({
            value: value - 1,
          }, () => {
            var price = this.data.value * actPrice  
            this.count(this.data.value,price) 
          })
        }
      }

    },

    addnum(e) {
      console.log(e.currentTarget.dataset)
      var actPrice = +e.currentTarget.dataset.actprice;
      var value = +e.currentTarget.dataset.value;
      var goodsNum = e.currentTarget.dataset.goodsnum;
      var numberPerBox = e.currentTarget.dataset.numberperbox;
      var isbuybybox = e.currentTarget.dataset.isbuybybox
      if (isbuybybox) {
        if (value + numberPerBox > goodsNum) {
          this.setData({
            value,
          })
          let msg = '超过当前可购数量';
          this.remind(msg);
        } else {
          this.setData({
            value: value + numberPerBox,
          }, () => {
            var price = this.data.value * actPrice
            this.count(this.data.value,price) 
          })
        }
      } else {
        if (value + 1 > goodsNum) {
          this.setData({
            value,
          })
          let msg = '超过当前可购数量';
          this.remind(msg);
        } else {
          this.setData({
            value: value + 1,
          }, () => {
            console.log(this.data.value)
            var price = this.data.value * actPrice
            this.count(this.data.value,price) 
          })
        }
      }
    },
    goshop(e) {
      var actGoodsId = this.data.actGoodsId ? this.data.actGoodsId : this.properties.actGoodsId
      console.log(this.data, '++++++1++++++');
      wx.navigateTo({
        url: '/pages/aboutCart/confirmOrder/confirmOrder?groupShoppingId=' + actGoodsId + '&gsGroupId=' + this.data.groupId + '&groupNum=' + this.data.value + '&extCode=group_shopping',
      })
    },
    remind(msg) {
      this.setData({
        content: msg,
        contentBOn: true,
      })
      clearTimeout(timmer);
      var timmer = setTimeout(() => {
        if (msg == '亲，已经不能再少了哦' || msg == '超过当前库存') {
          this.setData({
            contentBOn: false,
          })
        } else {
          this.setData({
            contentBOn: false,
            modalName: null
          })
        }
      }, 1500);
    },
    changenum(e) {
      console.log(e)
      var value = +e.detail.value;
      var start = e.target.dataset.start;
      var actPrice = +e.target.dataset.actprice;
      var goodsNum = e.target.dataset.goodsnum;
      var numberPerBox = e.target.dataset.numberperbox;
      var isbuybybox = e.target.dataset.isbuybybox
      // 箱规带处理
      // if (isbuybybox) {

      // } else {

      // }

      if (value >= goodsNum) {
        this.setData({
          value: goodsNum,
        }, () => {
          var price = this.data.value * actPrice
          this.count(this.data.value,price) 
        })
      } else if (value <= start) {
        this.setData({
          value: start,
        }, () => {
          var price = this.data.value * actPrice
          this.count(this.data.value,price) 
        })
      } else {
        this.setData({
          value: value,
        }, () => {
          var price = this.data.value * actPrice
          this.count(this.data.value,price) 
        })
      }
    },




    count(value,totalprice) {
      this.setData({
        value,
        totalprice: totalprice && totalprice.toFixed(2),
      })
    },
  }
})