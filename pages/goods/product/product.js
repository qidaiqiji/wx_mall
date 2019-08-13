// pages/product/product.js
// pages/cart/cart.js
const {
  $Toast
} = require('../../../dist/base/index');
import api from '../../../utils/api.js'
const app = getApp();
const throttle = app.throttle;
// import { finished } from 'stream';
const {
  getshops
} = api
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    productTimesHide: true,
    articleContent: '',
    groupList: [],
    groupListMore: [],
    spellMore: false,
    isSpell: '',
    hidePopupWindow: false,
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
    flashSaleMystatus: 0,
    isShopTagUp: false,
    info: '',
    isShowCoupon: false,
    kind: '',
    ishide: false,
    unnum: '1',
    nodetop: '',
    productZhiFlex: 'product_zhi_absolid',
    scrollTop: 0,
    productIf: '1',
    myFormat: ['', '', ''],
    myFormat1: ['', '', '', ''],
    clearTimer: false,
    mystatus: '',
    goodsId: '',
    totalCount: '0',
    isLoading: 2,
    productToUp: '',
    groupShoppingInfo: {},
    bottomSwitch: false,
    groupId: '',
    onGroupCartShow: false,
  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onGroupCart(e) {
    if (e.detail) {
      console.log(e.detail.groupId, '像偶像哦');
      this.setData({
        groupId: e.detail.groupId,
      })
    } else {
      console.log(e.detail, '信息偶像偶像哦')
    }
    this.setData({
      onGroupCartShow: true,
    })
  },
  ongroupCartHide() {
    this.setData({
      onGroupCartShow: false,
      groupId: '',
    })
  },

  onevokeAddCart(e) {
    var that = this;
    this.setData({
      isSpell: e.detail.isSpell,
      bottomSwitch: e.detail.bottomSwitch,
      groupId: e.detail.groupId
    }, () => {
      app.onevokeAddCart(that, e)
    })
  },
  onhideCart(e) {
    this.setData({
      totalCount: app.globalData.totalCount,
      bottomSwitch: false,
    })
    var that = this
    app.onhideCart(that, e)
  },
  onLoad: function (options) {
    let goodsId = '';
    let userRank='';
    console.log(options, 'options')
    const scene = decodeURIComponent(options.scene);
    console.log(scene, 'scene');
    if (scene == 'undefined') {
      goodsId = options.goodsId
    } else {
      var splitArr = scene.split('=');

      console.log(splitArr)
      goodsId = splitArr[1]
    }
   if(options.userRank){
    userRank=options.userRank
   }

    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    getshops({
      goodsId: goodsId,
      userRank:userRank,
    }).then(res => {
      if (res.code == 1) {
        wx.navigateBack({
          delta: 1 // 返回上一级页面。 
        })
      } else {
        var groupList = [];
        if (res.data.status.isGroupShopping) {
          if (res.data.groupShoppingInfo.groupList.length > 0) {
            res.data.groupShoppingInfo.groupList.forEach(element => {
              if (element.needNum > 0) {
                groupList.push(element)
              }
            })
          }
        }
        // 更多拼团
        let groupListMore = []
        // if (groupList.length > 1) {
        //   var groupListMore = groupList.slice(2)
        // } else {
        //   var groupListMore = []
        // }
        if (res.data.videoFace) {
          res.data.gallery.src.unshift(res.data.videoFace);
        }
        if (res.data.status.isGroupShopping) {
          res.data.objectPrice = app.segmentationPrice(String(res.data.actPrice))
        } else {
          res.data.objectPrice = app.segmentationPrice(res.data.price)
        }

        this.setData({
          ...res.data,
          ...options,
          groupList,
          groupListMore,
          imgHead: imgHead,
          version: version,
          vipImg: imgHead + 'my/img_vip_shopping@2x.png?version=' + version,
          list: imgHead + 'details/list.png?version=' + version,
        }, () => {
          this.setData({
            isLoading: 1,
            totalCount: app.globalData.totalCount
          });
          const query = wx.createSelectorQuery();
          query.select('#zhifatop').boundingClientRect();
          query.select('.product_shop_photo').boundingClientRect();
          query.exec((res) => {
            this.setData({
              nodetop: res[0] && res[0].top, // #the-id节点的上边界坐标 
              productToUp: res[1] && res[1].top - 38
            })
          });
        });
        this.headers(res.data.status);
      }
    });

  },
  longTap(e) {

    var isTitle = e.currentTarget.dataset.title
    wx.setClipboardData({
      data: isTitle,
      success: function (res) {}
    });
  },
  midad(e) {
    var url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url: url
      })
    }
  },
  onshopTagUp() {
    this.setData({
      isShopTagUp: false
    })
  },
  onhideMask() {
    this.setData({
      isShowCoupon: false
    })
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
    if (e.scrollTop >= this.data.nodetop) {
      if (this.data.ishide) {
        return false;
      } else {
        this.setData({
          unnum: '2',
          productZhiFlex: 'product_zhi_flex',
          ishide: true,
        })
      }
    } else {
      if (this.data.ishide) {
        this.setData({
          unnum: '1',
          productZhiFlex: 'product_zhi_absolid',
          ishide: false,
        })
      } else {
        return false;
      }
    }
  },
  isMaxShow(e) {
    var img = e.currentTarget.dataset.img || '';
    var imgs = e.currentTarget.dataset.imgs || [];
    wx.previewImage({
      current: img, // 当前显示图片的http链接 
      urls: imgs // 需要预览的图片http链接列表 
    })
  },
  // 锚点定位 
  tapMove(e) {
    this.setData({
      unnum: '1',
      productZhiFlex: 'product_zhi_absolid'
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
  },

  tap(e) {
    wx.pageScrollTo({
      scrollTop: this.data.productToUp,
      duration: 100,
    })
    this.setData({
      unnum: '2',
      productZhiFlex: 'product_zhi_flex'
    })
  },
  shopTagUp(e) {
    this.setData({
      isShopTagUp: true
    })
    var info = e.currentTarget.dataset;
    if (info.type == '领劵') {
      this.setData({
        isShowCoupon: true,
        info: info.couponList
      })
    } else {

      this.selectComponent("#shopTagUp").unConfirm(info);

    }


  },
  goRanking(e) {

    wx.navigateTo({
      url: '/pages/homePage/rankingDetail/rankingDetail?id=' + e.currentTarget.dataset.item.floorId,
    })
  },
  // 显示头部 
  headers(e) {

    //vip 1 套餐 2 聚划算3 秒杀4 售价5 是否参加限时秒杀 6 
    //  预售 7 正在拼团 8
    if (e && e.isGroupShopping) {
      this.setData({
        mystatus: 8,
      })
    } else if (e && e.isVip) {
      this.setData({
        mystatus: 1,
      })
    } else if (e && e.isJuHuaSuan) {
      this.setData({
        mystatus: 3,
        item_huasuan: this.data.imgHead + 'details/icon_item_huasuan.png?version=' + this.data.version,
      })
    } else if (e && e.isFlashSale) {
      this.setData({
        mystatus: 4,
        item_miaosha: this.data.imgHead + 'details/icon_item_miaosha.png?version=' + this.data.version,

      })
    } else if (e && e.isSuperPkg) {
      this.setData({
        mystatus: 2,
        item_taocan: this.data.imgHead + 'details/icon_item_taocan.png?version=' + this.data.version,
      })
    } else if (e && e.isNotStartGroupShopping) {
      this.setData({
        mystatus: 7,
      })
    } else {
      this.setData({
        mystatus: 5,
      }, () => {
        if (e && e.isNotStartFlashSale && this.data.mystatus == '5') {
          this.setData({
            flashSaleMystatus: 6,
            item_miaosha: this.data.imgHead + 'details/icon_item_miaosha.png?version=' + this.data.version,
          })
        }
      })
    }


  },
  isMaxShow(e) {

    var img = e.currentTarget.dataset.img || '';
    var imgs = e.currentTarget.dataset.imgs || [];
    wx.previewImage({
      current: img, // 当前显示图片的http链接 
      urls: imgs // 需要预览的图片http链接列表 
    })
  },
  isSpellRules: throttle(function (e) {
    this.setData({
      spellMore: true,
    })
  }),
  onMyshow() {
    this.setData({
      kindSpell: '',
      hidePopupWindow: false
    })
  },
  onMyHide(e) {
    this.setData({
      kindSpell: 'spell',
      hidePopupWindow: true,
      articleContent: e.currentTarget.dataset.ruletext,
    })
  },
  move() {
    return false;
  },
  confirmSpell() {
    this.setData({
      spellMore: false,
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
    this.setData({
      productTimesHide: true,
    })
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
    }
  },

  /** 
   * 生命周期函数--监听页面隐藏 
   */
  onHide: function () {
    this.setData({
      productTimesHide: false,
    })
  },

  /** 
   * 生命周期函数--监听页面卸载 
   */
  onUnload: function () {},
  ontoUpImgs() {
    app.handleJumpToTop();
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
  onShareAppMessage: function (options) {
    if (this.data.mystatus == 8 && this.data.groupShoppingInfo.groupList[0].groupId) {
      return {
        title: this.data.goodsName && this.data.goodsName,
        path: '/pages/goods/spellDetails/spellDetails?groupId' + this.data.groupShoppingInfo.groupList[0].groupId,
        success: (res) => {
          console.log("转发成功", res);
        },
        fail: (res) => {
          console.log("转发失败", res);
        }
      }
    } else {
      return {
        title: this.data.goodsName && this.data.goodsName,
        success: (res) => {
          console.log("转发成功", res);
        },
        fail: (res) => {
          console.log("转发失败", res);
        }
      }
    }

  }
})