// pages/confirmOrder/confirmOrder.js
const {
  $Message
} = require('../../../dist/base/index');
import api from '../../../utils/api.js';
const {
  $Toast
} = require('../../../dist/base/index');
const {
  orderGroupGoods,
  orderGroupCreate,
  paymentHuifuApp,
  addressDefault,
  orderGroupCheckStock,
  articleContent
} = api
const app = getApp();
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integralArticleTxt: '', //积分兑换规则
    hidePopupWindow: false,
    integralList: [],
    integralIndex: '',
    integralNo: '-1',
    integralTxt: '', //返回的积分文字
    chooseIntegral: false,
    confirm: '确认',
    returnsThePath: '',
    desc: '',
    pagesModal: false,
    discount: '0',
    prepay: '',
    shippingFee: '',
    FullCutCouponTips: '',
    address: null,
    couponList: '',
    groupList: [],
    isShowFullCutCouponTips: false,
    shippingInfo: null,
    total: null,
    zhifaInfo: null,
    inputValue: '',
    groupSn: 0,
    isactionSheet: false, //邮费选择
    actiions: [{
        name: '男',
      },
      {
        name: '女'
      },
    ],
    couponId: '',
    reduceprice: '',
    addressId: '',
    gsGroupId: '',
    groupId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, '确认订单接收的数据')
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      imgHead,
      version
    })
    this.setData({
      exclusive_black: imgHead + 'activeDirectory/exclusive_black_card.png?version=' + version,
    }, () => {})
    addressDefault({

    }).then(res => {
      this.setData({
        ...res.data
      })
    });
    this.setData({
      ...options,
      couponId: options.couponId || this.data.couponId,
      reduceprice: options.reduceprice || this.data.reduceprice,
    }, () => {
      console.log(this.data, '778744555')
    })
  },
  isOrder() {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var pages = getCurrentPages() //获取加载的页
    var prevPage = pages[pages.length - 2];

  },
  integralUp: function (e) {
    this.setData({
      chooseIntegral: true
    })
  },
  onCloses() {
    this.setData({
      chooseIntegral: false,
    })
  },
  // 返回的积分
  handleClose(e) {
    this.setData({
      integralNo: this.data.integralList[e.detail.values].integraRmb,
      integralIndex: this.data.integralList[e.detail.values].integra,
      chooseIntegral: false
    })
    console.log('返回的城市', this.data.integralNo, this.data.integralIndex);
    // 选择积分拉取数据

    // 拉取确认订单页数据
    var noreFresh = 'noreFresh'
    this.newTheOrder(noreFresh)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
    addressDefault({}).then(res => {
      var addressId = ''
      if (res.code == 0) {

        if (this.data.addressId) {
          addressId = this.data.addressId
        } else {
          addressId = res.data.addressId
        }
        this.getOrderDetail(addressId)
        this.setData({
          ...res.data
        })
      } else {
        this.getOrderDetail(addressId)
      }

    })
  },
  getOrderDetail(addressId) {
    orderGroupGoods({
      addressId,
      couponId: this.data.couponId,
      groupShoppingId: this.data.groupShoppingId,
      groupNum: this.data.groupNum,
      gsGroupId: this.data.gsGroupId
    }).then(val => {
      if (val.code != 0) {

        $Toast({
          content: val.msg
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)

        return false
      }
      console.log(val.data.couponList.length, '第一次请求', val.data.couponList)
      var couponId = '';
      if (this.data.extCode != "group_shopping") {
        if (val.data.couponList) {
          console.log('第一次请求1')
          if (this.data.couponId == -1) {
            console.log('第一次请求2')
            couponId = ''
          } else {
            console.log('第一次请求3')
            couponId = this.data.couponId || val.data.couponList.bestCouponId;
            this.setData({
              couponId: this.data.couponId || val.data.couponList.bestCouponId
            })
          }


          let reduceprice = val.data.couponList.canUse.filter(item => (item.cut == val.data.couponList.bestCouponId))
          this.setData({
            reduceprice: this.data.couponId == -1 ? '' : reduceprice,
          })


        }
      }
      console.log(this.data.couponId, '+++++', val.data.couponList.bestCouponId)
      orderGroupGoods({
        addressId,
        couponId,
        groupShoppingId: this.data.groupShoppingId,
        groupNum: this.data.groupNum,
        gsGroupId: this.data.gsGroupId
      }).then(res => {
        this.setData({
          ...res.data,
        });

        console.log(res.data.total, '第二次请求');
        // 调用计算积分
        this.onMaxIntegral(res.data.total.maxIntegral, res.data.total.integralRate)
        if (res.data.total.fullCutDiscount >= 0) {
          this.setData({
            discount: res.data.total.fullCutDiscount
          })
        } else {
          this.setData({
            discount: res.data.total.couponDiscount
          })
        }
        var list = this.data.groupList[0];
        if (list.shippingName !== '包邮') {
          this.setData({
            prepay: '0'
          })
        };
        var shippingFee = ''
        list.shippingSelections && list.shippingSelections.map(item => {
          if (item.shippingName == list.shippingName) {
            shippingFee = item.shippingFee
            this.setData({
              shippingFee
            });
          }
        });
        articleContent({
          id: res.data.integralArticleId
        }).then(item => {
          this.setData({
            integralArticleTxt: item.data.content
          })
        })
      })



    })

  },
  // 计算使用的积分
  onMaxIntegral(maxIntegral, integralRate) {
    // 计算使用的积分
    var cycle = maxIntegral / integralRate;
    var maxIntegral = maxIntegral;
    var integralRate = integralRate;
    var integralList = [];
    // 结果
    for (let index = 0, integra = 0, integraRmb = 0; index < cycle; index++) {
      integra = maxIntegral;
      integraRmb = maxIntegral / integralRate;
      integralList.push({
        integra: '使用' + integra + '积分，抵扣¥' + integraRmb + '.00元',
        integraRmb: integra
      })
      maxIntegral = maxIntegral - integralRate
    }
    integralList.unshift({
      integra: '不使用积分',
      integraRmb: -1
    });
    this.setData({
      integralList
    })
  },
  onShowAllGoods(e) {
    let showGoodsList = e.currentTarget.dataset.goodslist
    let showGoodsNum = e.currentTarget.dataset.goodsnum
    let showKind = e.currentTarget.dataset.kind
    this.setData({
      isShowBottomModal: true,
      showGoodsList,
      showGoodsNum,
      showKind
    }, () => {
      this.selectComponent("#showBottomModal").showModal();
    })
  },
  onhideMask(e) {
    this.setData({
      isShowBottomModal: false,
      showGoodsList: [],
      showGoodsNum: 0,
      showKind: '',
      shippingSelections: []
    })
  },
  handleShowPostage(e) {
    let showKind = e.currentTarget.dataset.kind
    this.setData({
      isShowBottomModal: true,
      showKind
    }, () => {
      this.selectComponent("#showBottomModal").showModal();
    })
  },
  handleSelectPostAge(e) {
    let showKind = e.currentTarget.dataset.kind
    let shippingSelections = e.currentTarget.dataset.shippingselections
    this.setData({
      isShowBottomModal: true,
      showKind,
      shippingSelections
    }, () => {
      this.selectComponent("#showBottomModal").showModal();
    })
  },
  onJumptoAddr: throttle(function () {
    wx.navigateTo({
      url: '../address/address'
    });
    this.setData({
      integralNo: '-1',
    })
  }),
  onOrderMsg: throttle(function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  }),
  // 创建订单
  toPayOrder: throttle(function (e) {
    let addressId = this.data.address.addressId;
    if (!addressId) {
      app.onToast('请选择收货地址')
      return false
    }
    let remark = this.data.inputValue;
    let couponId = '';
    if (this.data.couponId <= 0) {
      couponId = this.data.bestCouponId
    } else {
      couponId = this.data.couponId
    }
    // 检查商品库存
    orderGroupCheckStock({
      addressId: addressId,
      extCode: this.data.extCode || '',
      actId: this.data.groupShoppingId || '',
      goodsNum: this.data.groupNum || ''
    }).then(res => {
      console.log(res, '开始创建')
      if (res.code == 0) {
        this.onePay(addressId, remark, couponId, e)
      } else if (res.code == 1001) {
        this.setData({
          desc: res.msg,
          pagesModal: true,
          confirm: '去认证'
        })
      } else {
        this.setData({
          desc: res.msg,
          pagesModal: true,
          confirm: '确认'
        })
      }
    })
  }, 3000),
  onePay(addressId, remark, couponId, e) {
    console.log('创建')
    orderGroupCreate({
      addressId,
      remark,
      prepay: +this.data.prepay,
      couponId: couponId,
      formId: e.detail.formId,
      integral: this.data.integralNo,
      groupShoppingId: this.data.groupShoppingId,
      gsGroupId: this.data.gsGroupId,
      groupNum: this.data.groupNum,
    }).then(res => {
      console.log('创建res、', res)
      if (res.code == 0) {
        let groupSn = res.data.groupSn
        this.setData({
          groupSn
        })
        wx.showToast({
          title: '请求中',
          icon: 'success',
          duration: 2000
        })
        paymentHuifuApp({
          groupSn
        }).then(Res => {
          //支付开始
          if (Res.code == 1 || Res.code == 2) {
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/order/allOrders/allOrders?status=needPay'
              })
            }, 1000)
            $Toast({
              content: Res.msg
            });
          } else {
            this.pay(Res.data.payInfo)
          }

        })
      } else if (res.code == 1001) {
        // 支付订单失败
        this.setData({
          desc: res.msg,
          pagesModal: true,
          confirm: '去认证'
        })
      } else {
        this.setData({
          desc: res.msg,
          pagesModal: true,
          confirm: '确认'
        })
      }
    }).catch(fail => {
      console.log(fail)
    })
  },
  // toPayOrder(e) {

  // },
  pay(param) {
    console.log("支付", param)
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: (res) => {
        wx.redirectTo({
          url: '/pages/aboutCart/paySuccess/paySuccess?groupId=' + this.data.groupSn,
          success: function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
          },
        })
      },
      fail: function (res) {
        wx.redirectTo({
          url: '/pages/order/allOrders/allOrders?status=' + 'needPay',
        })
        wx.showToast({
          title: '支付失败',
          icon: 'warning',
          duration: 2000
        })
      },
      complete: function () {}
    })
  },
  getSex() {
    this.setData({
      isactionSheet: true
    });
  },
  actionSheetCancel() {
    this.setData({
      isactionSheet: false
    });
  },
  actionSheetClickItem(e) {
    this.data.actiions.forEach((item, index) => {
      if (index == e.detail.index) {
        this.setData({
          sexName: item.name,
          isactionSheet: false
        })
      }
    })

  },
  // 运费方式的修改
  parentComponent(e) {
    var prepay = e.detail.values
    console.log('子组件的值');
    this.setData({
      prepay: prepay,
      integralNo: '-1',
    })
    this.newTheOrder()
  },
  ordercoupon() {
    this.setData({
      integralNo: '-1',
    })
    wx.navigateTo({
      url: '/pages/ordercoupon/ordercoupon?couponId=' + this.data.couponId + '&reduceprice=' + this.data.reduceprice + '&couponList=' + JSON.stringify(this.data.couponList),
    })
  },
  pagesModals() {
    this.setData({
      pagesModal: false
    }, () => {
      wx.switchTab({
        url: '/pages/cart/cart'
      })
    });
  },
  onIconguiZe: throttle(function () {
    this.setData({
      hidePopupWindow: true
    })
  }),
  // 隐藏弹窗
  onMyshow() {
    this.setData({
      hidePopupWindow: false
    })
  },
  // 修改费用后重新拉取订单数据
  newTheOrder(noreFresh) {
    orderGroupGoods({
      addressId: this.data.address.addressId,
      prepay: this.data.prepay,
      couponId: this.data.couponId,
      integral: this.data.integralNo
    }).then(res => {
      this.setData({
        ...res.data,
        integralList: [],
        integralNo: this.data.integralNo
      }, () => {
        this.onMaxIntegral(res.data.total.maxIntegral, res.data.total.integralRate)
      });
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