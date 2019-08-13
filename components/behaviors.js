module.exports = Behavior({

  behaviors: [],

  properties: {

  },

  data: {

    myBehaviorData: {}

  },

  attached: function () {},

  methods: {
    buyNumReduce(e) {

      //拿到当前点击对象
      var cartNum = e.currentTarget.dataset.cartnum
      var recId = e.currentTarget.dataset.index
      var brandId = e.currentTarget.dataset.brandid
      var boxNum = e.currentTarget.dataset.boxnum
      var startNum = e.currentTarget.dataset.startnum




      var realNum = this._inputNum(cartNum, boxNum, startNum, 'left')
      console.lo
      if (realNum < startNum) {
        return false;
      } else {
        this.triggerEvent('getNum', {
          startNum,
          brandId,
          recId,
          cartNum: realNum
        })

        console.log('引入成功', e)


      }
    },
    buyNumChange(e) {
      var cartNum = +e.detail.value
      var recId = e.currentTarget.dataset.index
      var brandId = e.currentTarget.dataset.brandid
      var boxNum = e.currentTarget.dataset.boxnum
      var startNum = e.currentTarget.dataset.startnum
      var maxNum = e.currentTarget.dataset.maxnum


      if (cartNum < startNum) {
        this._inputNum(cartNum, boxNum, startNum, 'left')

        this.triggerEvent('getNum', {
          brandId,
          recId,
          cartNum: startNum
        })
      } else if (cartNum > maxNum) {
        this._inputNum(cartNum, boxNum, maxNum, 'right')

        this.triggerEvent('getNum', {
          brandId,
          recId,
          cartNum: maxNum
        })
      } else {
        this.triggerEvent('getNum', {
          brandId,
          recId,
          cartNum
        })
      }


    },
    buyNumAdd(e) {
      console.log(e)
      var cartNum = e.currentTarget.dataset.cartnum
      var recId = e.currentTarget.dataset.index
      var brandId = e.currentTarget.dataset.brandid
      var boxNum = e.currentTarget.dataset.boxnum
      var maxNum = e.currentTarget.dataset.maxnum

      var realNum = this._inputNum(cartNum, boxNum, maxNum, 'right')

      if (realNum > maxNum) {
        return false;
      } else {
        this.triggerEvent('getNum', {
          brandId,
          recId,
          cartNum: realNum
        })
      }
    },
    _inputNum: function (val, boxNum, condition, direction) {
      console.log(val, boxNum, condition, direction)
      if (direction === 'left') {

        if (boxNum) {
          if (val - boxNum < condition) {
            this.triggerEvent('showToast', {
              warning: '采购数不可低于最低起订量'
            }, {})
            return val
          } else {
            return val - boxNum
          }
        }else{
          if (val - 1 < condition) {
            this.triggerEvent('showToast', {
              warning: '采购数不可低于最低起订量'
            }, {})
            return val
          } else {
            return val - 1
          }
        }
      } else {
        if (boxNum) {
          if (val + boxNum > condition) {
            this.triggerEvent('showToast', {
              warning: '采购数不可高于库存量'
            })
            return val
          } else {
            return val + boxNum
          }
        } else {
          if (val + 1 > condition) {
            this.triggerEvent('showToast', {
              warning: '采购数不可高于库存量'
            })
            return val
          } else {
            return val + 1
          }
        }
      }
    },

  }

})