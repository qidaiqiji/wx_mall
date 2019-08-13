// pages/cart/cart.js
import api from '../../utils/api.js'
const {
  $Toast
} = require('../../dist/base/index');
const app = getApp();
const throttle = app.throttle
const {
  getCartData,
  changeCartNum,
  deleteCartGoods,
  selectGoods,
  cancelSelectGoods,
  goodsAdviceList,
  orderGroupCheckStock
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    desc: '',
    confirm: '删除',
    alllist: false,
    pagesModal: false,
    failuRerecId: '',
    recIdList: '',
    toTheTop: false,
    copyValidGoodsList: [],
    copySubRecId: [],
    copyAllChecked: false,
    showToast: false,
    visible: false,
    allChecked: false,
    allPrice: 0,
    isAllEdit: false,
    FixedTips: false,
    scrollTop: 0,
    failureGoodsId: [],
    invalidGoodsList: [],
    validGoodsList: [],
    goodsList: [],
    provinceId: '',
    showCouponList: [],
    visible1: false,
    hasCartGoods: true,
    actions: [{
        name: '取消',
        color: '#889696'
      },
      {
        name: '确定',
        color: '#FF3366'
      }
    ],
    reacquire: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {


  },
  // 失效左滑删除
  hideModals(e) {
    console.log(e, '失效左滑删除id')
    var failureGoodsId = [];
    failureGoodsId.push(e.detail.recId)
    this.setData({
      desc: '确定删除该失效商品吗？',
      failureGoodsId,
      pagesModal: true,

    });
  },
  pagesModals(e) {
    console.log(e, '是取消还是确认')
    // positions 1 取消；2确定
    var positions = e.detail.positions
    console.log(positions);
    if (positions == 1) {
      this.setData({
        pagesModal: false
      })
    } else if (positions == 2) {

      this.setData({
        pagesModal: false,
        alllist: true
      }, () => {
        this.onDisDelete()
      });
    }
  },
  confirmTos() {
    this.setData({
      pagesModal: false,
    }, () => {
      this.onShow()
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {

    getCartData().then(res => {
      console.log(res);
      app.onTotalCount(res.data.total.totalCount, 3)
      this.setData({
        hasCartGoods: res.data.hasCartGoods
      })
      if (res.data.hasCartGoods) {
        res.data.validGoodsList.forEach(item => {

          const bool = item.goodsList.some(val => val.changed == true)
          if (bool) {
            this.setData({
              FixedTips: true
            })
          }
          item.couponItem = item.goodsList.map(val => {
            return val.goodsId
          })


        })
        this.setData({
          ...res.data
        })
      } else {
        goodsAdviceList({
          num: 20
        }).then(res => {
          console.log(res)
          this.setData({
            ...res.data,
          })
        })
      }

    }).catch(fail => {
      console.log
    })
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
  },
  handleShowCoupon(e) {
    console.log(e)
    this.setData({
      isShowCoupon: true,
      showCouponList: e.currentTarget.dataset.goodsidlist
    }, () => {
      this.selectComponent("#showCoupon").showModal();
    });
    console.log(e.currentTarget.dataset.goodsidlist)
  },
  onhideMask() {
    this.setData({
      isShowCoupon: false
    })
  },
  onPageScroll(event) {
    this.setData({
      scrollTop: +event.scrollTop
    });
    var that = this
    app.scrollRolling(that, event.scrollTop)
  },
  handleDelete(e) {
    console.log(e);
    if (e.detail.index) {
      var recIdList = this.data.recIdList
      if (recIdList) {
        deleteCartGoods({
          recIdList: recIdList
        }).then(res => {
          console.log(res)
          this.setData({
            ...res.data,
            copySubRecId: [],
            copyValidGoodsList: [],
            copyAllChecked: false,
            isAllEdit: false,
            visible1: false
          })
          if (res.data.total) {
            app.onTotalCount(res.data.total.totalCount, 3)
          }
          if (res.data.invalidGoodsList.length == 0 && res.data.validGoodsList.length == 0) {
            goodsAdviceList({
              num: 20
            }).then(res => {
              this.setData({
                ...res.data
              })
            })
          }

        })
      } else {
        console.log('未勾选', copySubRecId)
      }
    };
    this.setData({
      visible1: false
    });
  },
  onAllDelete(e) {
    var recIdList = [];
    recIdList.push(e.detail.recIdList);

    console.log(recIdList);
    this.setData({
      visible1: true,
      recIdList
    });

  },
  // 编辑商品
  onAllEdit(e) {
    var validGoodsList = this.data.validGoodsList
    var total = this.data.total
    const copyValidGoodsList = JSON.parse(JSON.stringify(validGoodsList))
    copyValidGoodsList.forEach(item => {
      item.isSelect = false
      item.goodsList.forEach(val => val.isSelect = false)
    })
    this.setData({
      copyValidGoodsList,
      isAllEdit: true,
      copySubRecId: [],
      copyAllChecked: false
    })
  },
  onAllcheck(e) {
    var isAllEdit = this.data.isAllEdit

    if (isAllEdit) {
      var copyAllChecked = this.data.copyAllChecked
      var copyValidGoodsList = this.data.copyValidGoodsList
      var arrRecId = []
      if (copyAllChecked) {
        copyValidGoodsList.forEach(item => {
          arrRecId = []
          item.isSelect = false
          item.goodsList.map(val => val.isSelect = false)
        })
        copyAllChecked = false
      } else {
        copyValidGoodsList.forEach(item => {
          const recId = item.goodsList && item.goodsList.map(val => val.recId)
          arrRecId = arrRecId.concat(recId)
          item.isSelect = true
          item.goodsList.map(val => val.isSelect = true)
        })
        copyAllChecked = true
      }
      this.setData({
        copyValidGoodsList,
        copySubRecId: arrRecId,
        copyAllChecked
      })

    } else {
      var validGoodsList = this.data.validGoodsList
      var total = this.data.total
      var arrRecId = []
      validGoodsList.forEach(item => {

        const recId = item.goodsList && item.goodsList.map(val => val.recId)
        arrRecId = [].concat(recId)
        if (total.isSelect) {
          cancelSelectGoods({
            recIdList: arrRecId
          }).then(res => this.setData({
            ...res.data
          }))
        } else {
          selectGoods({
            recIdList: arrRecId
          }).then(res => this.setData({
            ...res.data
          }))
        }
      })
    }
  },
  goodsCheck(e) {

    var brandId = e.currentTarget.dataset.brandid
    var validGoodsList = this.data.validGoodsList
    var copyValidGoodsList = this.data.copyValidGoodsList
    var isAllEdit = this.data.isAllEdit
    var copyAllChecked = this.data.copyAllChecked
    var recIds = [];

    //可能有更新操作
    if (!isAllEdit) {

      validGoodsList.forEach(item => {
        if (+item.brandId === +brandId) {
          recIds = item.goodsList.map(val => val.recId)
          if (item.isSelect) {
            console.log('取消2')
            cancelSelectGoods({
              recIdList: recIds
            }).then(res => this.setData({
              ...res.data
            }))
          } else {
            // 取消
            console.log('选择')
            selectGoods({
              recIdList: recIds
            }).then(res => this.setData({
              ...res.data
            }))
          }
        }
      })
    } else {

      copyValidGoodsList.forEach(item => {
        if (+item.brandId == +brandId) {

          if (item.isSelect) {
            item.isSelect = false
            item.goodsList.forEach(val => {
              val.isSelect = false
              this.removeCopySubRecId(val.recId)
            })

          } else {
            item.isSelect = true
            item.goodsList.forEach(val => {
              val.isSelect = true
              this.removeCopySubRecId(val.recId)
              recIds.push(val.recId)
            })

          }
        }

      })
      if (copyValidGoodsList.every(item => item.isSelect == true)) {
        copyAllChecked = true
      } else {
        copyAllChecked = false
      }
      this.setData({
        copySubRecId: [...this.data.copySubRecId, ...recIds],
        copyValidGoodsList,
        copyAllChecked
      })
    }
  },
  removeCopySubRecId(recId) {
    this.data.copySubRecId.forEach(item => {
      if (item == recId) {
        var index = this.data.copySubRecId.indexOf(recId);
        if (index > -1) {
          this.data.copySubRecId.splice(index, 1);
        }
      }
    })
    // this.setData({
    //   copySubRecId: this.data.copySubRecId
    // })
  },
  onCheck: function (e) {
    console.log(e, '选择')
    var recId = e.detail.recId
    var isSelect = e.detail.isSelect
    var brandId = e.detail.brandId
    var isAllEdit = this.data.isAllEdit

    var copyValidGoodsList = this.data.copyValidGoodsList
    var copyAllChecked = this.data.copyAllChecked
    var recIds = []
    if (isAllEdit) {
      copyValidGoodsList.forEach(item => {
        if (+item.brandId === +brandId) {
          item.goodsList.forEach(val => {
            if (val.recId == recId) {
              if (val.isSelect) {
                val.isSelect = false
                this.removeCopySubRecId(recId)
              } else {
                val.isSelect = true
                recIds.push(recId)
              }
            }
          })
          console.log(item.goodsList)
          if (item.goodsList.every(val => val.isSelect == true)) {
            item.isSelect = true
          } else {
            item.isSelect = false
          }
        }
      })

      if (copyValidGoodsList.every(item => item.isSelect == true)) {
        copyAllChecked = true
      } else {
        copyAllChecked = false
      }
      this.setData({
        copySubRecId: [...this.data.copySubRecId, ...recIds],
        copyValidGoodsList,
        copyAllChecked
      })
    } else {
      recIds.push(recId)
      if (isSelect) {
        console.log('++取消选中+++')
        cancelSelectGoods({
          recIdList: recIds
        }).then(res => {
          this.setData({
            ...res.data
          })
        })
      } else {
        console.log('++单个选中+++')
        selectGoods({
          recIdList: recIds
        }).then(res => {
          if (res.code != 0) {
            this.hintToast(res.msg)
          }
          this.setData({
            ...res.data
          })
        })
      }
    }

  },
  onShowToast: function (e) {
    var timmer = null
    this.setData({
      showToast: true,
      visible: true,
      warning: e.detail.warning
    })
    if (timmer) clearTimeout(timmer);
    timmer = setTimeout(() => {
      this.setData({
        showToast: false
      })
      timmer = null;
    }, 3000);
    if (!this.data.showToast) {
      this.setData({
        visible: false
      })

    }
  },
  onCancelFixedTips: function () {

    const validGoodsList = this.data.validGoodsList
    validGoodsList && validGoodsList.forEach(item => {
      item.goodsList && item.goodsList.forEach(item => {
        item.changed = false
      })
    })
    this.setData({
      FixedTips: false,
      validGoodsList,
    })
  },
  onGetNum: function (e) {

    console.log(e, 'test')
    var num = +e.detail.cartNum
    var brandId = e.detail.brandId
    var recId = e.detail.recId
    changeCartNum({
      recId,
      num
    }).then(res => {
      this.setData({
        ...res.data
      })
      if (res.data.total) {
        app.onTotalCount(res.data.total.totalCount, 3)
      }
    })

  },
  onDisDelete: function (e) {
    console.log(this.data.alllist, 'this.data.alllist')
    var list = []
    if (this.data.alllist) {
      list = this.data.failureGoodsId;
    } else {
      list = this.data.invalidGoodsList.map(item => item.recId)
    }
    console.log(list, 'recIds00000');
    deleteCartGoods({
      recIdList: list
    }).then(res => {
      this.setData({
        ...res.data,
      })
      if (this.data.alllist) {
        console.log(res.data)
        if (res.data.invalidGoodsList.length == 0 && res.data.validGoodsList.length == 0) {

          goodsAdviceList({
            num: 20
          }).then(res => {
            console.log(res);
            this.setData({
              ...res.data,
              alllist: false
            })
          })
        }
        this.setData({
          alllist: false,
        })
      } else {
        console.log(res.data)
        goodsAdviceList({
          num: 20
        }).then(res => {
          console.log(res)
          this.setData({
            ...res.data,
            alllist: false
          })
        })
      }
    })
  },
  onAllEditCancel: function (e) {

    this.setData({
      isAllEdit: false,
      copyValidGoodsList: [],
      copySubRecId: [],
      copyAllChecked: false
    })
  },

  onChooseAddr(e) {
    this.setData({
      provinceId: e.detail.provinceId
    });
    console.log(this.data.provinceId);
    getCartData({
      provinceId: e.detail.provinceId
    }).then(res => {
      this.setData({
        ...res.data
      })
    })
  },
  handleToPayOrder: throttle(function () {
    if (this.data.total.goodsCount == 0) {
      $Toast({
        content: '请勾选商品'
      });
    } else {
      // wx.navigateTo({
      //   url: '/pages/aboutCart/confirmOrder/confirmOrder',
      // })
      // 检查数量
      orderGroupCheckStock({
        extCode: 'checkout'
      }).then(res => {
        if (res.code == 0) {
          wx.navigateTo({
            url: '/pages/aboutCart/confirmOrder/confirmOrder?extCode=checkout',
          })
        } else if (res.code == 1001) {
          this.setData({
            desc: res.msg,
            pagesModal: true,
            confirm: '去认证'
          })
        } else {
          console.log(res.msg)
          this.setData({
            desc: res.msg,
            pagesModal: true,
            confirm: 'confirm'
          })
        }
      })
    }
  }),
  handleToPurchase() {
    wx.navigateTo({
      url: '/pages/goods/goodsLists/goodsLists',
    })
  },
  onevokeAddCart(e) {
    var that = this
    app.onevokeAddCart(that, e)
  },
  onhideCart(e) {
    var that = this
    app.onhideCart(that, e)
    //添加一个刷新购物车功能操作
    getCartData().then(res => {
      this.setData({
        ...res.data
      })
    })
  },
  onHide() {
    var addCartComponentsHide = this.selectComponent("#addCart");
    if (addCartComponentsHide != null) {
      addCartComponentsHide.onConfirm()
    }
    // wx.setStorageSync('isCart', true)
    this.setData({
      copyValidGoodsList: [],
      isAllEdit: false,
      copySubRecId: [],
      copyAllChecked: false
    })
  },
  hintToast(msg) {
    $Toast({
      content: msg
    });
  },
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  onUnload() {
    // wx.setStorageSync('isCart', true)
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {
  //   console.log("分享")
  // }
})