// components/product_b/swiper/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoFace: String,
    video: String,
    lastOrderInfo: {
      type: Array,
      value: [],
      observer: function (newData, oldData) {
        this.getlastOrderInfo(newData)
      }
    },
    gallery: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        this._gallery(newData)
      }
    },
    imghe: String
  },
  /**
   * 组件的初始数据
   */

  attached() {},
  detached() {
    clearInterval(this.data.interval)
    // 在组件实例被从页面节点树移除时执行
  },
  data: {
    system: '',
    isVideo: true,
    interval: '',
    swipertop: true,
    index: 1,
    current: 0,
    swiper_num: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _gallery(newData) {
    },
    swiperChange: function (e) {
         this.setData({
          current: e.detail.current
        })
    },

    getlastOrderInfo(newData) {
      var indexNumber = newData.length;
      this.setData({
        interval: setInterval(() => {
          if (this.data.swipertop) {
            setTimeout(() => {
              this.setData({
                swipertop: false
              });
            }, 1500);
            var index = (Math.round(Math.random() * (indexNumber - 1) + 1) - 1);
            this.setData({
              swiper_num: newData[index] || ''
            });
          } else {
            setTimeout(() => {
              this.setData({
                swipertop: true,
              });
            }, 1500)
          }
        }, 2000)
      })

    },
    isMaxShow(e) {
      var img = e.currentTarget.dataset.img || '';
      var imgs = e.currentTarget.dataset.listsrc || [];
      wx.previewImage({
        current: img, // 当前显示图片的http链接
        urls: imgs // 需要预览的图片http链接列表
      })
    },
    isTapVideo() {
      this.setData({
        isVideo: false,
        system: app.globalData.system,
      })
    },
    isNoVideo() {
      this.setData({
        isVideo: true,
      })
    },
    isVideoEnd(e) {
      if (this.data.system == 'iOS') {
        var videpId = e.currentTarget.id
        var videoContext = wx.createVideoContext(videpId, this);
        videoContext.exitFullScreen();
      };
      this.setData({
        isVideo: true,
      })
    },

  }
})