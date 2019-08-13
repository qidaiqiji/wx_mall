// components/remind/remind.js
const app = getApp();
var WxParse = require('../../utils/wxParse/wxParse.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: Number,
      value: 10000,
      observer: function (newData, oldData) {
        this._type(newData)
      }
    },
    ruleText: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        this._ruleText(newData)
      }
    },
    name: String,
    msg: String,
    kind: String,
    letter: String,
    recordList: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        if (newData.length > 0) {
          this._recordList(newData)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    content: '取消提醒',
    contentBOn: false,
    contenGarden: false,
    contentGarden: '',
    zhuceguize: [{
      title: '1、活动内容 ',
      desc: ['（1）小美诚品的会员，通过活动发出链接邀请好友注册小美诚品;', '（2）受邀好友通过链接注册并认证成功，双方各获得900元优惠券。']
    }, {
      title: '2、参与方式',
      desc: ['用户通过此次活动邀请好友注册，受邀者在邀请链接中输入注册手机号并提交，完成认证后即算邀请成功']
    }, {
      title: '3、注意事项',
      desc: ['（1）受邀者需从未注册过小美诚品账号，每位新用户只能被邀请一次；', '（2）邀请关系以受邀者第一次提交注册手机号码信息为准，完成注册后不可转移和解除。', '（3）拥有相同账户、手机号及设备的用户视同一用户，该规则适用于邀请者与被邀请者；', '（4）活动派发的优惠券适用于小美直发商品，自获得之日起30天内有效。']
    }],
    windowHeight: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _type(newData) {
    
      this.setData({
        type: newData
      })
    },
    _ruleText(newData) {
    
      var that = this;
      var article = newData;
      WxParse.wxParse('article', 'html', article, that, 5);
    },
    _recordList(newData) {
      this.setData({
        recordList: newData
      });
     
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

      }, 1000);
    },
    move() {
      return false;
    },
    Gardenremind(letter) {
      this.setData({
        contentGarden: letter,
        contenGarden: true,
      })
    
      clearTimeout(letters);
      var letters = setTimeout(() => {
        this.setData({
          contenGarden: false,
        })
      }, 1000);
    },
    determine() {
      this.triggerEvent('myshow', {
        next: false
      })
    },
    determineC() {
      this.triggerEvent('myshow', {
        next: false
      })
    },
    nextGet(){
      this.triggerEvent('nextGet', {
        next: false
      })
    },
    youhuijuan() {
      wx.redirectTo({
        url: '/pages/ordercoupon/ordercoupon',
      })
    },
    jiangpin() {
      wx.redirectTo({
        url: '/pages/self/integral/integralOrderList/integralOrderList',
      })
    },
    nextTime() {
      this.triggerEvent('myshow', {
        next: true
      })
    }
  },
  youhuijuan() {
    wx.navigateTo({
      url: '/pages/self/ownCoupon/ownCoupon',
    })
  },
  ready() {
    var windowHeight = app.globalData.appHeight - 60;
    this.setData({
      windowHeight,
    });
  
  }
})