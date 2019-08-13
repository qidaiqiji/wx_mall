// pages/integral/exchangeDraw/exchangeDraw.js
import api from '../../../../utils/api.js'
const {
  getExchangeDrawRecord,
  getExchangeDraw,
  exchangePrizeList
} = api
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    isKind: '',
    jilu: [],
    whatIndex: 100,
    code: '',
    msg: '',
    name: '',
    position: '',
    prizeList: [],
    choujiang_bg: '',
    bananer_img: '',
    isChoujiang: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const imgHead = app.globalData.imgHead;
    const version = app.globalData.userInfo.version;
    this.setData({
      choujiang_bg: imgHead + "integral/img_choujiang_bg.png?version=" + version,
      choujiang_selected: imgHead + "integral/img_choujiang_selected.png?version=" + version,
      choujiang: imgHead + "integral/img_choujiang.png?version=" + version,
      bananer_img: imgHead + "self/bananer.png?version=" + version,
    })
    exchangePrizeList({}).then(res => {
      var prizeList = res.data.prizeList;
      if (prizeList.length <= 0) {
        this.setData({
          prizeList: this.data.prizeList,
          ruleText: res.data.ruleText,
          banner: res.data.banner
        });
      } else {
        prizeList.splice(4, 0, {
          pic: '/images/icon_choujiang.png'
        });
        this.setData({
          prizeList,
          ruleText: res.data.ruleText,
          banner: res.data.banner
        });
      }
    });
  },
  choujiang(e) {
    if (this.data.isChoujiang) {
      var index = e.currentTarget.dataset.listindex;
      // 抽奖
      getExchangeDraw({}).then(res => {
        var position = res.data.position
        if (position > 4) {
          position += 1;
        } else {
          position = position;
        }
        this.setData({
          code: res.code,
          msg: res.msg,
          name: res.data.name,
          position,
          type: res.data.type
        })
        // 立即抽奖
        if (index == 5) {
          // 判断能否抽奖
          if (this.data.code != 0) {
            this.setData({
              isKind: 'choujiangtag',
            })

          } else {
            // 进行抽奖
            this.setData({
              isChoujiang: false
            }, () => {
              this.luckyDraw();
            });
          }
        }
      });


    }
  },
  // 抽奖轮播
  luckyDraw() {

    var that = this;
    var times = 100;
    clearTimeout(timedown);
    var timedown = setInterval(function () {
      var index = Math.round(Math.random() * 8 + 1);
      if (index == 5) {
        index = index + 1
      }
      that.setData({
        whatIndex: index
      });
      times += 30;
      if (times > 1000) {
        clearTimeout(timedown);
        that.setData({
          whatIndex: that.data.position,
          isKind: 'choujiang',
          isChoujiang: true
        });
      }
    }, 100);
  },
  guize() {

    this.setData({
      isKind: 'guize',
    });
  },
  jilu() {
    getExchangeDrawRecord({}).then(res => {
      this.setData({
        isKind: 'jilu',
        recordList: res.data.recordList
      });
    });
  },
  isShow(e) {
    if (this.data.isChoujiang) {
      this.setData({
        isKind: ''
      });
      if (e.detail.next && e.detail.next) {
        // 抽奖
        getExchangeDraw({}).then(res => {
          var position = res.data.position
          if (position > 4) {
            position += 1;
          } else {
            position = position;
          }
          this.setData({
            code: res.code,
            msg: res.msg,
            name: res.data.name,
            position
          })
          // 判断能否抽奖
          if (this.data.code != 0) {
            this.setData({
              isKind: 'choujiangtag',
            })

          } else {
            // 进行抽奖
            this.setData({
              isChoujiang: false
            }, () => {
              this.luckyDraw();
            });
          }


        });
      }
    }
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
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
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