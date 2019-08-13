// pages/self/helpCenter/helpCenter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop: false,
    guide:[{title:'新手帮助',id:'185'},{title:'采购流程',id:'1628'},{title:'关于生活',id:'1303'},{title:'小美积分',id:'187'}],
    security:[{title:'正品保障',id:'176'},{title:'常见问题',id:'1627'},{title:'七天退换',id:'1625'},{title:'用户协议',id:'186'}],
    distribution:[{title:'支付方式',id:'190'},{title:'邮费政策',id:'189'},{title:'配送说明',id:'188'},{title:'支付限额',id:'1362'}],
    brands:[{title:'招商合作',id:'191'},{title:'入驻流程',id:'192'},{title:'合作品牌',id:'1304'}],
    about:[{title:'公司简介',id:'195'},{title:'联系我们',id:'194'},{title:'服务邮箱',id:'196'}],
  },
  handleJumpWebView(e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/webView/webView?text=' + e.currentTarget.dataset.text+'&id=' + e.currentTarget.dataset.id,
    })
  },
  handleJumpIssue(e) {
    wx.navigateTo({
      url: '/pages/self/issueFeedback/issueFeedback',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo && app.globalData.userInfo.version
    this.setData({
      imgHead,
      version
    })

    this.setData({
      icon_aboutus: imgHead + 'icon_aboutus@2x.png?version=' + version,
      icon_brand: imgHead + 'icon_brand@2x.png?version=' + version,
      icon_commodity: imgHead + 'icon_commodity@2x.png?version=' + version,
      icon_companion: imgHead + 'icon_companion@2x.png?version=' + version,
      icon_delivery: imgHead + 'icon_delivery@2x.png?version=' + version,
      icon_feedback: imgHead + 'icon_feedback@2x.png?version=' + version,
      icon_pay: imgHead + 'icon_pay@2x.png?version=' + version,
      icon_purchase: imgHead + 'icon_purchase@2x.png?version=' + version,
      icon_safeguard: imgHead + 'icon_safeguard@2x.png?version=' + version,
      icon_xiaomei: imgHead + 'icon_xiaomei@2x.png?version=' + version,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  ontoUpImgs() {
    app.handleJumpToTop();

  },
  onPageScroll(e) {
    console.log(e.scrollTop, 'e.scrollTop ')
    var that = this
    app.scrollRolling(that, e.scrollTop)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})