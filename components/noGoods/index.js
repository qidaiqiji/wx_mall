// components/noGoods/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    calc:'',
  },
  ready() {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      img_no: imgHead + 'img_no.png.png?version=' + version
    })
    wx.getSystemInfo({
      success: (res) => {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        console.log(calc, )
        this.setData({
          calc,
        })
       
      }
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})