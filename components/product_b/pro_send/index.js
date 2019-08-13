// components/product_b/pro_send/index.js
var tcity = require("../../../utils/citys.js");
import api from '../../../utils/api.js'
const {
  getprovinceID
} = api
const app = getApp()



Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        this.getstatus(newData)
      }
    },
    mystatus: String,
    skuSizeList: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        if (newData !== null) {
          this._skuSizeList(newData)
        }
      }
    }, 
    goodsId: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        if (newData !== null) {
          this._goodsId(newData)
        }
      }
    },
    defaultShippingProvince: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        if (newData !== null) {
          this.getdefaultShippingProvince(newData)

        }

      }
    },
    shippingInfo: String,
    expireDate: String,
    skuNameList: String,
    attributes: Object,
    addCartList: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    hm: ['正品行货', '物流补贴', '七天退换'],
    index: '',
    provinceName: '',
    provinceId: '',
    value: [0, 0, 0],
    condition: false,
    onlyProvince: false,
  },
  attached: function (e) {
    // 在组件实例进入页面节点树时执行

  },
  ready() {
    var query=  wx.createSelectorQuery()
    query.in(this).select('.pro_send_wrap').boundingClientRect()
    query.in(this).select('.pro_send_wrap1').boundingClientRect()
    query.in(this).select('.pro_send_wrap_hanghuo').boundingClientRect()
    query.in(this).select('.zhenghuo').boundingClientRect()

    query.exec(res => {
     
      this.setData({
        nodetop: res[0].top ||res[0].top,

      })

    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _goodsId(newData){
      this.setData({
        goodsId: newData,
      })
      
    },
    _skuSizeList(newData) {
      this.setData({
        skuSizeList: newData,
      })
    },
    getdefaultShippingProvince(newData) {

      this.setData({
        defaultShippingProvince: newData,
        provinceName: newData.provinceName,
        provinceId: newData.provinceId
      },()=>{
        var provinceId = this.data.provinceId
       
        tcity.init(this);
        var cityData = this.data.cityData;
        for (let i = 0; i < cityData.length; i++) {
          if (+cityData[i].id == +provinceId) {
            this.setData({
              value: [i, 0, 0],
              provinceName: this.data.provinceName
            })
          }
        }
      })
    
    },
    // 弹窗修改
    handleShowAddr: function (e) {
      this.setData({
        condition: true,
        onlyProvince: true,
        isShowAddr:true
      })
    },
    showArea(values) {
      var cityData = this.data.cityData;
      var provinceId = ''
      var provinceName = ''

      for (let i = 0; i < cityData.length; i++) {
        if (+i == +values[0]) {
          provinceId = cityData[i].id
          provinceName = cityData[i].name
        }
      }
     
      this.setData({
        provinceId,
        provinceName,
        condition: false,
        value: [values[0],0,0]
      }, () => {
        this.bindPickerChange()
      })
      this.triggerEvent('chooseAddr', {
        provinceId
      })
    },
    handleClose(e) {
      this.showArea(e.detail.values);
      this.setData({
        isShowAddr: false
      })
    
    },
    // 选择邮费
    bindPickerChange: function (e) {
     
      getprovinceID({
        provinceId: this.data.provinceId,
        goodsId: this.data.goodsId,
      }).then(res => {
        this.setData({
          ...res.data,
          shippingInfo: res.data.shippingDesc
        })
       
      }, function (error) {
        console.log("错误", error)
      })
    },
    handleToBuy(e) {

      this.setData({
        isPopCart: true,
        goodsId: e.currentTarget.dataset.goodsid,
        goodslist: e.currentTarget.dataset.goodslist
      })
      if (this.data.isPopCart) {
        this.selectComponent("#addCart").showModal();
      };
    
      this.triggerEvent('mycoudan', { newdata: false });
    },
    onhideCart(e) {
      if (e.detail && e.detail.isRequestCouDanList) {
        this.triggerEvent('mycoudan', { newdata: true, isRequestCouDanList: true });

      } else {
        this.triggerEvent('mycoudan', { newdata: true });
      }
    
      if (e.detail && e.detail.tip) {
        this.setData({
          showToast: true,
          content: e.detail.tip,
        });
        this.setData({
          isPopCart: false
        })
      
      } else {
       
        this.setData({
          isPopCart: false
        })

      }
    },
    getstatus(newData) {
      if (newData) {
        // vip 1 套餐 2 聚划算3 秒杀4 直发5 代发6
        if (newData.isVip) {
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
        } else {
          this.setData({
            dibu: 6
          })
        }
      } else { }
    },


  }
})