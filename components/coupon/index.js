// components/coupon/index.js
import api from '../../utils/api.js'
const {
  couponTake
} = api
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    couponLists: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        this._couponLists(newData)
      }
    },
    win: String,
    semicircleBg:Boolean,
    couponList: {
      type: Array,
      value: [],
      observer(newData, oldData) {
        this._getcouponList(newData)
      },
    },
    couponItem: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        this._getCouponItem(newData)
      },
    },
    currentTab: {
      type: String,
      value: '',
      observer(newData, oldData) {
        this._getcurrentTab(newData)
      }
    },
    couponId: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    item: '',
    isSelect: true,
    index: '',
    checkedCouponId: ''
  },

  /**
   * 组件的方法列表
   */
  ready() {

    // this.setData({
    //   checkedCouponId: this.data.couponId || ,
    // });
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    console.log(app.globalData)
    this.setData({
      coupon_rightBg: imgHead + 'coupon_rightBg.png?version=' + version,
     })
  },
  methods: {
    _couponLists(newData) {
      this.setData({
        couponLists: newData,
        checkedCouponId: newData.useCouponId
      });
    },
    _getcouponList(newData) {

      this.setData({
        couponList: newData
      }, () => {

      });
    },
    _getCouponItem(newData) {
      this.setData({
        item: newData
      });
    },
    _getcurrentTab(newData) {
      this.setData({
        currentTab: newData
      })

    },
    toUseCoupon(e) {
      wx.navigateTo({
        url: '/pages/goods/goodsLists/goodsLists?eventId=' + e.currentTarget.dataset.eventid,
      })
    },

    getCoupon(e) {
    
      couponTake({
        ruleId: e.currentTarget.dataset.ruleid
      }).then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 2000
          });
          this.triggerEvent('getCouponList')
          if (res.data.canTakeCount == 0) {
            this.triggerEvent('changeType', {
              ruleId: e.currentTarget.dataset.ruleid
            })
          }
        } else if (res.code == 4) {
          wx.showToast({
            title: '领取数超出限制',
            image: '/images/warning.png',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '领取失败',
            image: '/images/warning.png',
            duration: 2000
          })
        }
      })
    },
    haveToReceive() {
      wx.showToast({
        title: '已领取',
        image: '/images/warning.png',
        duration: 2000
      })
    },
    handleChecked(e) {
      var couponId = e.currentTarget.dataset.id || this.data.couponId;
      var reduceprice = e.currentTarget.dataset.price;
      if (this.data.checkedCouponId == couponId) {
        this.setData({
          checkedCouponId: '',
        });
        couponId = 0;
        reduceprice = 0;
      } else {
        this.setData({
          checkedCouponId: couponId
        })
      }
     
      this.triggerEvent('check', {
        couponId,
        reduceprice
      }, {})
    },
  }
})