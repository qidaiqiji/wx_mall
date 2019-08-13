// components/shopTagUp/index.js
var WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    couponList: [],
    arr: [{
      name: 'juhuasuan',
      url: '/images/icon_huasuan.png',
      width: '120',
      height: '34'
    }, {
      name: 'flashSale',
      url: '/images/icon_miaosha.png',
      width: '166',
      height: '34'
    }, {
      name: 'taocan',
      url: '/images/product_taocan.png',
      width: '48',
      height: '28'
    }, {
      name: 'cutPrice',
      url: '/images/product_zhijiang@2x.png',
      width: '48',
      height: '28'
    }, {
      name: '优惠券',
      url: '/images/product_lingquan.png',
      width: '48',
      height: '28'
    }, {
      name: '物料',
      url: '/images/product_wuliao.png',
      width: '48',
      height: '28'
    }, {
      name: '满赠',
      url: '/images/product_manzneg.png',
      width: '48',
      height: '28'
    }, {
      name: '满减',
      url: '/images/product_manjian.png',
      width: '48',
      height: '28'
    }],
    articleType: false,
    modalName: '',
    info: {
      type: Object,
      value: {},
      observer: '_getInfo'
    },
    kind: ''
  },
  ready() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    _getInfo() {},
    unConfirm(e) {
      console.log(e)
      var that = this;
      if (e.kind == "eventList") {
        this.setData({
          kind: e.kind,
          info: e.info,
          couponList: e.info.couponList || [],
          modalName: 1
        });
      } else {
        if (e.info.type == 'juhuasuan' || e.info.type == 'flashSale' || e.info.type == 'cutPrice'||e.info.type=='groupShopping') {
          var desc = e.info.desc;
          WxParse.wxParse('article', 'html', desc, that, 5);
          this.setData({
            modalName: 1,
            kind: e.kind,
            articleType: true
          })
        } else {
          this.setData({
            kind: e.kind,
            info: e.info,
            modalName: 1
          });
        }
      }
    },
    onConfirm: function (e) {
      this.triggerEvent('shopTagUp')
      this.setData({
        modalName: ''
      })
    },
    move() {
      return false;
    },
    shopTagUpGoshop(e) {
      var isOnSale = e.currentTarget.dataset.isonsale
      var goodsId = e.currentTarget.dataset.goodsid;
      var kind = e.currentTarget.dataset.kind;
      if (kind == 'eventList') {
        if (goodsId) {
          if (isOnSale) {
            app.appProduct(goodsId)
          }
        }
      } else {
        if (goodsId) {
          app.appProduct(goodsId)
        }
      }
    }
  }
})