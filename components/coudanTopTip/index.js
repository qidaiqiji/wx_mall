// components/coudanTip/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hasZhifa: {
      type: Boolean,
      value: '',
      observer: function (newData, oldData) {
        this._hasZhifa(newData)
      }
    },
    eventId:String,
    typess: String,
    eventDesc: String,
    zhifaAmount: String,
    shippingAmountAbove: String, //包邮要求的货币金额下限
    kind: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
      
        if (newData !== null) {
          this._getkind(newData)
        }
      }
    },
  
    higherAmount: String,
    higherCut: String,
    fullCutNeedsMoreAmount: String,
    subtotal: {
      type: Object,
      value: '',
      observer: function (newData, oldData) {

        if (newData !== null) {
          this._getdate(newData)
        }
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    kinds: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _hasZhifa(newData) {
    
      this.setData({
        hasZhifa: newData
      })
    },
    _getkind(newData) {
      this.setData({
        kind: newData,
        kinds: newData
      });
    
    },
    _getdate(newData) {
     
    },
    handleShowBottomModal() {
      this.setData({
        isShowBottomModal: true
      }, () => {
        this.selectComponent("#showBottomModal").showModal();
      })
    },
    onhideMask() {
      this.setData({
        isShowBottomModal: false
      })
    },
  }
})