// components/receiveSecurities/index.js
const app = getApp()
const throttle = app.throttle;
import api from '../../utils/api.js'
const {
  couponTake,
} = api
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    couponList: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        this._couponList(newData)
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},
  ready() {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      imgHead,
      version,
      img_quan: imgHead + 'img_quan.png?version=' + version,
      img_quan_ling: imgHead + 'img_quan_ling.png?version=' + version,
    }, () => {
      console.log(this.data, app.globalData.userInfo, app.globalData.userInfo.version)
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _couponList(newData) {
      // takeCoupon :0 是已抢光不展示；1 可领取；2 已领取且不能领
      //  能不能领
      newData.forEach(element => {
        if (element.canTake) {
          // 能领
          if (element.canTakeNums) {
            element.takeCoupon = 1;
          } else {
            if (element.takenCount) {
              element.takeCoupon = 2;
            } else {
              element.takeCoupon = 0;
            }
          }
        } else {
          // 不能
          if (element.takenCount) {
            element.takeCoupon = 2;
          } else {
            element.takeCoupon = 0;
          }
        }
      });
      this.setData({
        couponList: newData,
      })
    },
    toReceive: throttle(function (e) {
      couponTake({
        ruleId: e.currentTarget.dataset.ruleid
      }).then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 2000
          });
        } else if (res.code == 4) {
          wx.showToast({
            title: '领取数超出限制',
            image: '/images/warning.png',
            duration: 2000
          })
          var couponList = this.data.couponList;
          couponList.forEach(element => {
            if (e.currentTarget.dataset.ruleid == element.ruleId) {
              element.takeCoupon = 2;
            }

          });
          this.setData({
            couponList,
          })
        } else {
          wx.showToast({
            title: '领取失败',
            image: '/images/warning.png',
            duration: 2000
          })
        }
      })
    }),
    haveToReceive() {
      wx.showToast({
        title: '已领取',
        image: '/images/warning.png',
        duration: 2000
      })
    },
  }
})