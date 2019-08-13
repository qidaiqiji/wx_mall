// pages/miaosha/miaosha.js
import api from '../../../utils/api.js'
const {
  activityFlashSaleNew
} = api
const app = getApp()
Page({
  /**
   * 页面的初始数据
   **/
  data: {
    istxt: '距结束',
    textList: '正在秒杀',
    aboutToBegin: true,
    appHeight: '',
    flashSaleListEach: '',
    textIndex: 0,
    classificationTop: '',
    arrText: ['正在进行中', '即将开始'],
    isDistance: true,
    day: '00',
    timsD: '00',
    timeH: '00',
    times: '00',
    toTheTop: false,
    isPageId: 'pages/homePage/miaosha/miaosha',
    isShowNavigation: false,
    daojiashiTwp:'',

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const query = wx.createSelectorQuery();
    query.select('#banner_bottom_wrap').boundingClientRect();
    query.exec((res) => {
      this.setData({
        classificationTop: res[0].top, // #the-id节点的上边界坐标
      })
    });
    wx.loadFontFace({
      family: 'DINCondensed-Bold',
      source: 'url("https://img.xiaomei360.com/wechat_xiaochengxu/font/DIN-Condensed-Bold-2.ttf")',
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
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      img_no: imgHead + 'img_no.png.png?version=' + version
    })
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
    }
    activityFlashSaleNew().then(res => {
      this.setData({
        ...res.data.flashSaleList,
      })
      if(this.data.textIndex ==0){
        var mydate = res.data.flashSaleList.endDate && res.data.flashSaleList.endDate
        var that = this
        if (mydate) {
          this.counDownFun(that, mydate, 0)
        }
      }else if(this.data.textIndex ==1){
        var mydate = res.data.flashSaleList.startDate && res.data.flashSaleList.startDate
        var that = this
        if (mydate) {
          this.counDownFun(that, mydate, 1)
        }
      }
    })
    this.setData({
      menus: wx.getStorageSync('menus'),
      isActTime: wx.getStorageSync('isInActivity')
    })
  },
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  onevokeAddCart(e) {
    var that = this
    app.onevokeAddCart(that, e)
  },
  onhideCart(e) {
    var that = this
    app.onhideCart(that, e)
  },
  ongetTotle(e) {
    this.setData({
      totalCounts: e.detail.totalCount
    })
  },
  handleShowNavigation() {
    this.setData({
      isShowNavigation: true
    })
  },
  onallPreferential() {
    this.setData({
      isShowNavigation: false
    })
  },
  handleMenus(e) {
    this.setData({
      isShowNavigation: false
    })
    let index = e.detail.index
    let initIsPageId = this.data.isPageId
    app.handleNavMenu(initIsPageId, this, index)
  },
  ontextIndex(e) {
    let index = e.currentTarget.dataset.tapindex;
    var mydate = '';
    var that = this;
    if (this.data.textIndex == index) {
      return false
    } else {
      this.setData({
        textIndex: index
      });
      if (!this.data.isDistance) {
        wx.pageScrollTo({
          scrollTop: this.data.classificationTop,
          duration: 0,
        })
      }
      if (index == 0) {
        if (this.data.startGoodsList.length == 0 && !this.data.isDistance) {
          this.setData({
            appHeight: app.globalData.appHeight
          })
        }
        clearInterval(that.data.daojiashi)
        clearInterval(that.data.daojiashiTwp)
        mydate = this.data.endDate;
        this.counDownFun(that, mydate, 0);
        this.setData({
          aboutToBegin: true,
          textList: '正在秒杀',
          istxt: '距结束'
        })
      } else if (index == 1) {
        if (this.data.notStartGoodsList.length == 0 && !this.data.isDistance) {
          this.setData({
            appHeight: app.globalData.appHeight
          })
        }
        if (this.data.notStartGoodsList.length < 4) {
          this.setData({
            reachTheBottom: false
          })
        }

        clearInterval(that.data.daojiashi)
        clearInterval(that.data.daojiashiTwp)
        mydate = this.data.startDate;
        this.counDownFun(that, mydate, 1);
        this.setData({
          aboutToBegin: false,
          textList: '即将开抢',
          istxt: '距开始'
        });
      }
    }
  },
  counDownFun(that, mydate, tab) {
    clearInterval(that.data.daojiashi)
    clearInterval(that.data.daojiashiTwp)
    if (tab == 0) {
      this.setData({
        daojiashi:setInterval(function () {
          counDown(that, mydate,tab)
        }, 1000)
      })
    } else if (tab == 1) {
      this.setData({
        daojiashiTwp:setInterval(function () {
          counDown(that, mydate,tab)
        }, 1000)
      })
    }
    function counDown(that, newDatadate,tab) {
      var starttime = newDatadate;
      starttime = starttime.replace(new RegExp("-", "gm"), "/");
      var qxTime = (new Date(starttime)).getTime(); //得到毫秒
      //当前时间
      var currenTime = new Date().getTime();
      //两个时间差值
      var time = qxTime - currenTime;
      if (time > 0) {
        time = parseInt(time / 1000)
        //毫秒转化天数
        var d = Math.floor(time / (60 * 60 * 24));
        var h = Math.floor(time / (60 * 60)) - (d * 24);
        var hTotal = Math.floor(time / (60 * 60));
        //分钟
        var s = Math.floor(time / 60) - (d * 24 * 60) - (h * 60);
        var ss = Math.floor(time) - (d * 24 * 60 * 60) - (h * 60 * 60) - (s * 60);
        if (d < 10) {
          d = '0' + d;
        }
        if (h < 10) {
          h = '0' + h;
        }
        if (hTotal < 10) {
          hTotal = '0' + hTotal
        }
        if (s < 10) {
          s = '0' + s
        }
        if (ss < 10) {
          ss = '0' + ss;
        };

        if (d !== '00') {
          that.setData({
            actPageData: d,
            actPageTxt: "天"
          })
        } else if (h !== '00') {
          that.setData({
            actPageData: h,
            actPageTxt: '时'
          })
        } else if (s !== '00') {
          that.setData({
            actPageData: s,
            actPageTxt: '分'
          })
        }
        that.setData({
          day: d,
          timsD: h,
          timeH: s,
          times: ss,
          hTotal: hTotal,
          daojiashi: tab ==0?that.data.daojiashi:'',
          daojiashiTwp: tab ==1?that.data.daojiashiTwp:'',
        })
      } else if (time < 0) {
        clearInterval(that.data.daojiashi);
        clearInterval(that.data.daojiashiTwp);
        that.setData({
          day: 0,
          timsD: 0,
          timeH: 0,
          times: 0,
          hTotal: 0,
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log(this.data.daojiashi)
    clearInterval(this.data.daojiashi);
    clearInterval(this.data.daojiashi);
    // this.ontextIndex(undefined,textIndex)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.daojiashi);
  },
  onPageScroll(e) {
    if (e.scrollTop > this.data.classificationTop) {
      this.setData({
        isDistance: false
      })
    } else {
      this.setData({
        isDistance: true
      })
    }
    let that = this;
    app.scrollRolling(that, e.scrollTop)
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