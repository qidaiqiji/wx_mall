// components/times/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['i-class'],
  properties: {
    mytimes: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        if (newData != oldData && newData !== '') {
          this._getdate(newData)
        }
      }
    },
    kind: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    system: '',
    day: '00',
    timsD: '00',
    timeH: '00',
    times: '00',
    hTotal: '00',
    actPageData: '0',
    actPageTxt: '分',
    daojiashi: ''
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {},
    hide() {
      clearInterval(this.data.daojiashi)
    },
    resize() {},
  },

  attached() {
    this.setData({
      system: app.globalData.system, //获取手机是不是ios
    });
    wx.loadFontFace({
      family: 'DINCondensed-Bold',
      source: 'url("https://img.xiaomei360.com/wechat_xiaochengxu/font/DIN-Condensed-Bold-2.ttf")',
    })

  },
  detached() {},


  pageShow() {
    clearInterval(this.data.daojiashi)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 得到时间
    _getdate(newData) {
      console.log('得到时间')
      clearInterval(this.data.daojiashi)
      // 倒计时
      this.setData({
        daojiashi: setInterval(() => {
          // console.log('进行中')
          this.counDown(newData)
        }, 1000)
      })
    },


    counDown(newDatadate) {
  
      var starttime = newDatadate.replace(new RegExp("-", "gm"), "/");
      var qxTime = (new Date(starttime)).getTime(); //得到毫秒
      //当前时间
      var currenTime = new Date().getTime();
      //两个时间差值
      var time = qxTime - currenTime;
      if (time > 0) {
        //console.log(time);
        time = parseInt(time / 1000)
        //毫秒转化天数
        var d = Math.floor(time / (60 * 60 * 24));
        var h = Math.floor(time / (60 * 60)) - (d * 24);
        var hTotal = Math.floor(time / (60 * 60))
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
            this.setData({
              actPageData: d,
              actPageTxt: "天"
            })
          } else if (h !== '00') {
            this.setData({
              actPageData: h,
              actPageTxt: '时'
            })
          } else if (s !== '00') {
            this.setData({
              actPageData: s,
              actPageTxt: '分'
            })
          }
          this.setData({
            day: d,
            timsD: h,
            timeH: s,
            times: ss,
            hTotal: hTotal,
          
          })
    

      } else if (time < 0) {
        clearInterval(this.data.daojiashi);
        this.setData({
          day: 0,
          timsD: 0,
          timeH: 0,
          times: 0,
          hTotal: 0,
        })
      }
    }


  }
})