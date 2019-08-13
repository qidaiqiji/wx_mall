// pages/usableno/usableno.js
import api from '../../utils/api.js';
const app = getApp()
const {
  applyStatus
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    istue: '',
    imgHead: '',
    version: '',
    qrcode: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    const imgHead = app.globalData.imgHead;
    const version = app.globalData.userInfo && app.globalData.userInfo.version;
    this.setData({
      imgHead,
      version
    })
    this.setData({
      qrcode: imgHead + "img_qrcode.jpg?version=" + version,
      img_auditing: imgHead + "my/img_auditing.png?version=" + version,
      img_auditdefeat: imgHead + "my/img_auditdefeat.png?version=" + version,
    })
    this.getApplyStatus();
  },
  getApplyStatus() {
    // 审核反馈
    applyStatus({
      companyName: this.data.usershop,
      nickname: this.data.username
    }).then(res => {
      // // 0 未审核 1 拒接 2  通过 3 注销  4待认证
      if (res.data.checkedStatus == 1) {
        this.setData({
          istue: 'reject',
          ...res.data
        })
      } else if (res.data.checkedStatus == 4 || res.data.checkedStatus == 0) {
        this.setData({
          istue: 'toBeCertified',
          ...res.data
        })
      } else if (res.data.checkedStatus == 2) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
  },
  // 重新提交
  newsubmit() {

    var pages = getCurrentPages() //获取加载的页
    var prevPage = pages[pages.length - 2];
    if (prevPage && prevPage.route == 'pages/usable/usable') {
      wx.navigateBack({
        delta: 1
      })
      return false
    } else {
      wx.navigateTo({
        url: '/pages/usable/usable',
      })
    }


  },
  // 回到首页
  returnmy() {
    wx.switchTab({
      url: '/pages/index/index?notLook=true',
    })
  },
  previewImage: function (e) {
    var imgs = [];
    imgs.push(e.currentTarget.dataset.imgs);
    var img = e.currentTarget.dataset.img || '';
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: imgs, // 需要预览的图片http链接列表
    });
    wx.getImageInfo({ // 获取图片信息（此处可不要）
      src: img,
      success: function (res) {
      }
    })
  },
  isMaxShow(e) {
    var imgs = [];
    imgs.push(e.currentTarget.dataset.imgs);
    var img = e.currentTarget.dataset.img || '';
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: imgs, // 需要预览的图片http链接列表
      success() {
        wx.getImageInfo({ // 获取图片信息（此处可不要）
          src: img,
          success: function (res) {
          }
        })
      }
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

  }
})