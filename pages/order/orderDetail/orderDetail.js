// pages/orderDetail/orderDetail.js
import api from '../../../utils/api.js'
const {
  orderDetail,
  paymentHuifuApp,
  orderGroupCancel,
  orderGroupCheckStock,
  orderGroupCheckPayable
} = api
const app = getApp();
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    confirm: '确认',
    pagesModal: false,
    currentTab: '',
    statusRmb: '应付总额',
    goodsAmountTwo:'',
    isTimeGroup:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var currentTab = options.currentTab && options.currentTab
    orderDetail({
      groupSn: options.groupSn
    }).then(res => {
      console.log(res.data, '7778555');
      var num = res.data.feeInfo.goodsAmount.split('.');
      if (num[1] == '00') {
        var goodsAmountTwo = num[0];
      } else {
        var goodsAmountTwo =res.data.feeInfo.goodsAmount
      }
    
        // if (res.data.groupShoppingInfo.length > 0) {
        //   let realNumber = res.data.groupShippingInfo.fullNum - res.data.groupShippingInfo.needNum
        //   var groupInfoList = Array(res.data.groupShippingInfo.fullNum).fill(1).fill(0, realNumber)
        // } else {
        //   var groupInfoList = []
        // }

        this.setData({
          ...res.data,
          currentTab: currentTab,
          goodsAmountTwo,
        })
      var status = res.data.status;
      if (status == '已付款' || status == '处理中' || status == '已完成' || status == '已发货' || status == '待收货 ') {
        this.setData({
          statusRmb: '实付总额'
        })
      }
    })
  },
  handleCancelOrder: throttle(function (e) {
    orderGroupCancel({
      groupSn: e.currentTarget.dataset.groupsn
    }).then(res => {
      wx.navigateTo({

        url: '/pages/order/allOrders/allOrders?currentTab=' + this.data.currentTab
      })
    }).catch(fail => {
      console.log(fail);

    })
  }),
  handlePay: throttle(function (e) {
    orderGroupCheckPayable({
      groupSn: e.currentTarget.dataset.groupsn
    }).then(ele => {
      if (ele.code == 0 || ele.code == 1002) {
        if (ele.code == 1002) {
          $Toast({
            content: res.msg
          });
        }
        paymentHuifuApp({
          groupSn: e.currentTarget.dataset.groupsn
        }).then(Res => {

          if (Res.code == 0) {
            //支付开始
            this.pay(Res.data.payInfo, e.currentTarget.dataset.groupsn)
          } else if (Res.code == 1001) {
            // 支付订单失败
            this.setData({
              desc: Res.msg,
              pagesModal: true,
              confirm: '去认证'
            })
          } else {
            // 支付订单失败
            this.setData({
              desc: Res.msg,
              pagesModal: true,
              confirm: '确认'
            })
          }
        }).catch(fail => {
          console.log(fail)
        })
      } else {
        $Toast({
          content: res.msg
        });
      }

    })

  }),
  pay(param, groupsn) {
    let groupId = groupsn
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: (res) => {
        wx.navigateTo({
          url: '/pages/aboutCart/paySuccess/paySuccess?groupId=' + groupId,
        })
      },
    })
  },
  pagesModals() {
    this.setData({
      pagesModal: false
    });
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
    this.setData({
      isTimeGroup:true,
    })
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isTimeGroup:false,
    })
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

    if (this.data.groupShoppingInfo.groupId) {
      console.log(this.data.groupShoppingInfo.groupId, 'this.data.groupShippingInfo.needNum')
      return {
        title: this.data.groupShoppingInfo.shareText && this.data.groupShoppingInfo.shareText,
        path: '/pages/goods/spellDetails/spellDetails?groupId=' + this.data.groupShoppingInfo.groupId,
        imageUrl: this.data.groupShoppingInfo.img && this.data.groupShoppingInfo.img,
        success: (res) => {
          console.log("转发成功", res);
        },
        fail: (res) => {
          console.log("转发失败", res);
        },
        complete: (res) => {
          console.log("转败", res);
        }
      }
    }
  }
})