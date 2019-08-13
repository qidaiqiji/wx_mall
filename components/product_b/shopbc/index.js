// components/bottomModal/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    kind: String,
    attributes: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    items: [{
      tie: '正品行货',
      value: '原装进口，证件齐全，贴有中文背贴',
    },  {
      tie: '物流补贴',
      value: '（1）收货地址为广东、湖南、湖北、福建、广西、贵州、江西、浙江的订单，订单金额满2999元包邮，不足2999元收取物流费用20元；（2）收货地址为云南、重庆、四川、陕西、山西、河北、宁夏、北京、天津、上海、山东、江苏、安徽、河南的订单，订单金额满3999元包邮，不足3999元收取物流费用30元；（3）收货地址为新疆、西藏、青海、甘肃、内蒙、辽宁、吉林、黑龙江、海南的订单，订单金额满4999元包邮，不足4999元收取物流费用50元。特别说明：①以上邮费政策不支持自选物流，如需自选物流，请联系小美诚客服。②若不满足包邮条件，客户可以选择现付运费和到付运费。',
    }, {
      tie: '七天退换',
      value: '若出现错发、货不对版等任何货品问题，自收到产品7天内平台给以退换。',
    },],
    quan: false,
    modalName: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal: function (e) {
      var modalName = this.properties.kind
      this.setData({
        modalName,
      });
    },
    onConfirm: function (e) {
      this.setData({
        modalName: null
      })
    },
    move(){
      return false;
    }
  },
})