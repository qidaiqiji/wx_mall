// pages/allOrders/allOrders.js
const {
  $Toast
} = require('../../../dist/base/index');
import api from '../../../utils/api.js';
const app = getApp();
const throttle = app.throttle
const {
  allOrderList,
  orderGroupConfirmReceive,
  paymentHuifuApp,
  orderGroupCheckPayable,
  orderGroupCheckStock
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    confirm: '确认',
    pagesModal: false,
    statusType: [{
        name: "全部",
        page: 0
      },
      {
        name: "待付款",
        page: 0
      },
      {
        name: "待收货",
        page: 0
      },
      {
        name: "退换货",
        page: 0
      }
    ],
    currentTab: 0,
    currentPage: 1,
    pageSize: 20,
    groupList: [],
    requestLock: false,
    status: '',
    toTheTop: false,
    isLoading: 2,
    isLoadings: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.currentTab) {
      this.switchTab(options.currentTab)
    } else {
      this.setData({
        ...options
      })
    }
  },
  confirmReceipt(e) {
    var groupSn = e.currentTarget.dataset.groupsn
    orderGroupConfirmReceive({
      groupSn
    }).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '确认成功',
          icon: 'success',
          duration: 2000
        })
      };
      // 回到全部订单
      if (this.data.currentTab == 0) {
        // 防止currentTab 与传入的参数相等导致不请求数据
        this.setData({
          currentTab: '999'
        });
        this.switchTab(0);
      } else {
        this.switchTab(0);
      }
    })
  },
  jumpToWLDetail(e) {
    wx.navigateTo({
      url: '/pages/order/wlDetail/wlDetail?groupSn=' + e.currentTarget.dataset.groupsn,
    })
  },
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
            this.setData({
              desc: Res.msg,
              pagesModal: true,
              confirm: '确认'
            })
          }
        }).catch(fail => {})
      } else {
        $Toast({
          content: res.msg
        });
      }
    });



  }, 3000),

  pay(param, groupsn) {
    let groupId = groupsn
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: (res) => {
        wx.redirectTo({
          url: '/pages/aboutCart/paySuccess/paySuccess?groupId=' + groupId,
        })
      },
      fail: res => {
        // 如果 全部时，跳到待支付
        // 待支付 不跳 
        this.switchTab(1)
      }
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
    var windowHeight = app.globalData.appHeight;
    this.setData({
      windowHeight,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
    var status = this.data.status
    var tab = 0
    if (status == '') tab = 0
    if (status == 'needPay') tab = 1
    if (status == 'needReceive') tab = 2
    if (status == 'refuse') tab = 3
    this.setData({
      currentTab: tab
    })
    var pageSize = this.data.pageSize
    var currentPage = 1
    allOrderList({
      status,
      currentPage,
      pageSize
    }).then(res => {
      this.setData({
        ...res.data,
        currentPage,
        requestLock: res.data.groupList.length == pageSize ? false : true,
        reachTheBottom: res.data.groupList.length >= 3 && res.data.groupList.length < pageSize ? true : false,
        pageSize,
        status,
        isLoading: res.data.groupList.length > 0 ? 1 : 0,
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  switchTab: function (e) {
    var tab = e.currentTarget ? e.currentTarget.dataset.current : e
    var pageSize = this.data.pageSize
    var currentPage = 1
    if (this.data.currentTab === tab) {
      return false
    } else {
      this.setData({
        requestLock: true,
        isLoading: 2
      })
      this.setData({
        currentTab: tab,
        isLoadings: false,
      }, () => {
        var status = ''
        if (tab == 0) status = ''
        if (tab == 1) status = 'needPay'
        if (tab == 2) status = 'needReceive'
        if (tab == 3) status = 'refuse'
        allOrderList({
          status,
          currentPage,
          pageSize
        }).then(res => {
          this.setData({
            ...res.data,
            requestLock: res.data.groupList.length == pageSize ? false : true,
            reachTheBottom: res.data.groupList.length > 3 && res.data.groupList.length < pageSize ? true : false,
            currentPage,
            status,
            isLoading: res.data.groupList.length > 0 ? 1 : 0,
          })
        })
      })

    }
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
  pullUpLoad(e) {
    if (!this.data.requestLock) {
      let pageSize = +this.data.pageSize
      let allData = this.data.groupList
      let currentPage = +this.data.currentPage + 1
      let status = this.data.status
      this.data.requestLock = true

      this.setData({
        isLoadings: allData.length < pageSize ? false : true
      }, () => {
        allOrderList({
          status,
          currentPage,
          pageSize
        }).then(res => {
          if (res.data.groupList.length > 0) {
            allData = allData.concat([], ...res.data.groupList)
            if (res.data.groupList.length == pageSize) {
              this.setData({
                groupList: allData,
                pageSize,
                currentPage,
                requestLock: false,
                status,
                isLoadings: true,
                reachTheBottom: false
              })
            } else {
              this.setData({
                groupList: allData,
                pageSize,
                currentPage,
                requestLock: true,
                status,
                isLoadings: false,
                reachTheBottom: true
              })
            }

          } else {
            this.setData({
              pageSize,
              currentPage: this.data.currentPage,
              requestLock: true,
              status,
              reachTheBottom: true
            })
          }


        })
      })

    }
  },
  ontoUpImgs() {
    app.handleJumpToTop();

  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e.target.dataset);
    let gsgroupid = e.target.dataset.gsgroupid;
    let img = e.target.dataset.img;
    let sharetext = e.target.dataset.sharetext;
    if (gsgroupid && img && sharetext) {
      return {
        title: sharetext,
        path: '/pages/goods/spellDetails/spellDetails?groupId=' + gsgroupid,
        imageUrl: img,
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