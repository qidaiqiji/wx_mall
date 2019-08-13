// pages/webView/webView.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:'',
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (!!options.text) {
      wx.setNavigationBarTitle({
        title: options.text
      })
      // switch (options.text) {
      //   case '新手帮助':
      //     id = '185'
      //     break;
      //   case '关于活动':
      //     id = '1303'
      //     break;
      //   case '小美积分':
      //     id = '187'
      //     break;
      //   case '正品保障':
      //     id = '176'
      //     break;
      //   case '售后服务':
      //     id = '183'
      //     break;
      //   case '用户协议':
      //     id = '186'
      //     break;
      //   case '支付方式':
      //     id = '190'
      //     break;
      //   case '邮费政策':
      //     id = '189'
      //     break;
      //   case '配送说明':
      //     id = '188'
      //     break;
      //   case '招商合作':
      //     id = '191'
      //     break;
      //   case '入驻流程':
      //     id = '192'
      //     break;
      //   case '合作品牌':
      //     id = '1304'
      //     break;
      //   case '公司简介':
      //     id = '195'
      //     break;
      //   case '联系我们':
      //     id = '194'
      //     break;
      //   case '服务邮箱':
      //     id = '196'
      //     break;
      //   case '关于平台':
      //     id = '179'
      //     break;
      //   case '关于商品':
      //     id = '180'
      //     break;
      //   case '关于采购':
      //     id = '181'
      //     break;
      //   case '关于配送':
      //     id = '182'
      //     break;
      //   case '支付限额':
      //     id = '1362'
      //     break;
      //   case '公众号':
      //     id = '1426'
      //     break;
      //   default:
      //     break;
      // }
     
      this.setData({ 
        text:options.text,
        id:options.id,
        url: `https://m.xiaomei360.com/default/article/info/aid/${options.id}.html?isXcx=true`
      })

    } else if (!!options.headlineNews) {
      console.log('2')
      this.setData({
        headlineNews: options.headlineNews,
        url: `${options.headlineNews}?isXcx==true`
      })
      return false;
    } else if (!!options.ad) {
      console.log('3')
      let url = unescape(options.ad)
      this.setData({
        ad: options.ad,
        url: `${url}&isXcx==true`
      })
    }

    console.log(this.data)
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
    wx.setNavigationBarTitle({
      title: this.data.text
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      text: '',
      headlineNews: '',
      id:'',
      ad: ''
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      text: '',
      headlineNews: '',
      ad: ''
    })
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
    let text = this.data.text

    let headlineNews = this.data.headlineNews
    let ad = this.data.ad

    return {

      // title: 'xx小程序',
      path: text ? `/pages/webView/webView?text=${this.data.text}` : headlineNews ? `/pages/webView/webView?headlineNews=${this.data.headlineNews}` : ad ? `/pages/webView/webView?ad=${this.data.ad}` : '',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})