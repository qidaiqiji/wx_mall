// components/popupWindow/popupWindow.js
var WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp();
const throttle = app.throttle

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleText:String,
    goodsId:String,
    groupList: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        this._groupList(newData)
      }
    },
    addCartList: Object,
    goodsId: String,
    recordList: {
      type: Object,
      value: [],
      observer: function (newData, oldData) {
        if (newData.length > 0) {
          this._recordList(newData)
        }
      }
    },
    integralArticleTxt: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        this._integralArticleTxt(newData)
      }
    },
    kind: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        this._kind(newData)
      }
    },
    ruleText: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        this._ruleText(newData)
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    modalName: null,
  },
  ready() {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      imgHead,
      version,
      appHeight: app.globalData.appHeight,
    }, () => {
      this.setData({
        img_weizhongjiang: imgHead + 'goldenEggs/img_weizhongjiang.png?version=' + version,
      })
    })

  },
  /**
   * 组件的方法列表
   */
  methods: {
    _groupList(newData) {
      this.setData({
        groupList: newData
      })
    },
    _integralArticleTxt(newData) {
      var that = this;
      var article = newData;
      WxParse.wxParse('article', 'html', article, that, 5);
    },
    _kind(newData) {
      this.setData({
        kind: newData
      }, () => {
        this.setData({
          modalName: 'aaaaaaaa'
        })
      })
    },
    _recordList(newData) {
      this.setData({
        recordList: newData
      })
    },
    _ruleText(newData) {

      var that = this;
      var article = newData;
      WxParse.wxParse('article', 'html', article, that, 5);
    },
    confirm() {
      if (this.data.kind == 'spellMore') {
        return false;
      } else {
        this.triggerEvent('myshow', {
          next: false
        })
      }

    },
    confirmSpell() {
      this.triggerEvent('myshow', {
        next: false
      })
    },
    move() {
      return false;
    },
    showModal: function () {
      var modalName = this.properties.kind
      this.setData({
        modalName,
      })
    },
    onevokeAddCart(e) {
      console.log(e)
      var that = this;
      this.setData({
        isSpell: e.detail.isSpell
      }, () => {
        app.onevokeAddCart(that, e)
      })
      console.log(this.data)
    },
    onhideCart(e) {
      this.setData({
        totalCount: app.globalData.totalCount
      })
      var that = this
      app.onhideCart(that, e)
    },
  }
})