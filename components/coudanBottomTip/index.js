// components/coudanBootomTip/index.js
var tcity = require("../../utils/citys.js");
const app = getApp()
const throttle = app.throttle
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    typess: String,
    discount: String,
    hasZhifa: Boolean, //是不是直发
    kind: String,
    shippingAmountAbove: String, //满多少包邮
    shippingFreeNeedsMoreAmount: String, //差额
    provinceName: String,
    provinceId: String,
    alreadyAmount: String,
    alreadyCut: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: [0, 0, 0],

    condition: false,
    onlyProvince: false,
    provinceId: ''
  },
  attached() {
    var provinceId = this.properties.provinceId
    tcity.init(this);
    var cityData = this.data.cityData;
    for (let i = 0; i < cityData.length; i++) {
      if (+cityData[i].id == +provinceId) {
        this.setData({
          value: [i, 0, 0],
          provinceName: this.properties.provinceName,
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleShowAddr: function (e) {
    
      this.setData({
        condition: true,
        onlyProvince: true,
        isShowAddr: true
      });

    },
    showArea(values) {

      var cityData = this.data.cityData;
      var provinceId = ''
      for (let i = 0; i < cityData.length; i++) {
        if (+i == +values[0]) {
          provinceId = cityData[i].id
        }
      }

      this.setData({
        provinceId,
        condition: false,
        value: [values[0], 0, 0]
      });
      console.log('picker发送选择改变，携带值为', this.data.provinceId, )
      this.triggerEvent('chooseAddr', {
        provinceId
      })

    },
    handleClose(e) {
    
      this.showArea(e.detail.values)
      this.setData({
        isShowAddr: false
      })
    },
    queRenBottom: throttle(function (e) {
    
      var discount = e.currentTarget.dataset.discount;
      var haszhifa = e.currentTarget.dataset.haszhifa;
      var provinceid = e.currentTarget.dataset.provinceid
      wx.navigateTo({
        url: "/pages/aboutCart/coudanList/coudanList?title=直发凑单" + '&kind=zhifa' + '&isid=' + '' + '&typess=zhifa' + '&discount=' + discount + '&hasZhifa=' + haszhifa + '&provinceId=' + provinceid
      })
    })
  }
})