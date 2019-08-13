const {
  $Toast
} = require('../../dist/base/index');
import api from '../../utils/api.js';
const {
  getExchangeDrawRecord,
  getExchangeDraw,
  exchangePrizeList,
  exchangeLastRecordList,
} = api
const app = getApp();
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [], //中奖纪录
    eggWho: '',
    eggsInterval: '',
    isHammer: false,
    smashingEgg: true,
    isHammerTwo: true,
    eggWho: true,
    isScale: true,
    hidePopupWindow: false,
    childKind: '', //弹窗显示那个
    prizeInformation: {},
    controlHammer: true,
    lastRecordRist: {},
    shopList: {},
    myStart: '',
    mrEnd: '',
    balance: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      imgHead,
      version,
      appHeight: app.globalData.appHeight,
    }, () => {
      this.setData({
        icon_guize: imgHead + 'goldenEggs/icon_guize.png?version=' + version,
        icon_hammer: imgHead + 'goldenEggs/icon_hammer.png?version=' + version,
        icon_jilu: imgHead + 'goldenEggs/icon_jilu.png?version=' + version,
        img_benqi: imgHead + 'goldenEggs/img_benqi.png?version=' + version,
        img_bg: imgHead + 'goldenEggs/img_bg.png?version=' + version,
        img_egg: imgHead + 'goldenEggs/img_egg.png?version=' + version,
        img_egg_open: imgHead + 'goldenEggs/img_egg_open.png?version=' + version,
        img_jiangchi: imgHead + 'goldenEggs/img_jiangchi.png?version=' + version,
        img_jiangchibg: imgHead + 'goldenEggs/img_jiangchibg.png?version=' + version,
        img_liehen: imgHead + 'goldenEggs/img_liehen.png?version=' + version,
        img_qianbg: imgHead + 'goldenEggs/img_qianbg.png?version=' + version,
        img_duihua: imgHead + 'goldenEggs/img_duihua.png?version=' + version,
        img_jifen: imgHead + 'goldenEggs/img_jifen.png?version=' + version,
        choujiang: imgHead + "integral/img_choujiang.png?version=" + version,
      })
    })
    // 奖品列表
    exchangePrizeList({}).then(res => {
      var myStart = res.data.startTime.substring(0, 10).replace(/\//g, "-").split('-'); //开始截取日期 
      var mrEnd = res.data.endTime.substring(0, 10).replace(/\//g, "-").split('-'); //借宿截取日期 
      this.setData({
        shopList: res.data,
        myStart: myStart[1] + '月' + myStart[2] + '日',
        mrEnd: mrEnd[1] + '月' + mrEnd[2] + '日',
        balance: res.data.balance,
      })
    });
    // 中奖信息
    exchangeLastRecordList().then(res => {
      this.setData({
        lastRecordRist: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    clearTimeout(this.data.eggsInterval)
    this.onHammer();
  },

  // 抽奖活动
  onSmashingEgg() {
    if (this.data.controlHammer) {
      getExchangeDraw({}).then(res => {
        if (res.code == 0) {
          this.setData({
            controlHammer: false,
            prizeInformation: res.data,
            balance: res.data.balance,
          }, () => {
            this.nextSmashingEgg()
          })
        } else {
          $Toast({
            content: res.msg
          });
        }
        // 判断能否抽奖
      });
    }

  },
  // 抽奖
  nextSmashingEgg() {
    // eggWho显示那个蛋和控制弹窗； isHammerTwo 锤子是否显示；isHammer锤子摇摆；smashingEgg金蛋裂口
    clearInterval(this.data.eggsInterval)
    this.setData({
      smashingEgg: false,
      isHammer: true,
    }, () => {
      setTimeout(() => {
        this.setData({
          isHammerTwo: false,
          smashingEgg: true,
          eggWho: false,
        }, () => {
          setTimeout(() => {
            this.setData({
              isScale: false,
            })
          }, 500)
        })
      }, 500)
    })
  },
  // 控制锤子
  onHammer() {
    var eggsInterval = setInterval(() => {
      this.setData({
        isHammer: !this.data.isHammer,
      })
    }, 500)
    this.setData({
      eggsInterval,
    })
  },
  // 取消
  onCancel() {
    this.setData({
      eggWho: true,
      isHammerTwo: true,
      isScale: true,
      controlHammer: true,
    });
    this.onHammer();
  },
  // 再砸一次
  onOnceAgain() {
    this.setData({
      eggWho: true,
      isHammerTwo: true,
      isScale: true,
      controlHammer: true,
    }, () => {
      this.onHammer();
      setTimeout(() => {
        this.onSmashingEgg()
      }, 1000)
    });


  },
  onIconguiZe: throttle(function () {
    this.setData({
      childKind: 'guize',
      hidePopupWindow: true
    })
  }),
  // 积分中奖纪录
  onIconJilu: throttle(function () {
    getExchangeDrawRecord({}).then(res => {
      this.setData({
        recordList: res.data.recordList,
        childKind: 'record',
        hidePopupWindow: true
      });
    });
  }),

  dingdan: throttle(function () {
    this.setData({
      eggWho: true,
      isHammerTwo: true,
      isScale: true,
      controlHammer: true,
    });
    wx.navigateTo({
      url: '/pages/self/integral/integralOrderList/integralOrderList',
    });
  }),
  // 隐藏弹窗
  onMyshow() {
    this.setData({
      hidePopupWindow: false
    })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.eggsInterval)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})