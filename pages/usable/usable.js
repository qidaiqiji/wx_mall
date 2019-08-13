// pages/self/usable/usable.js
const {
  $Toast
} = require('../../dist/base/index');
import base64 from '../../utils/base64.js';
const {
  encode
} = base64;
import api from '../../utils/api.js';
const {
  getApplyInfo,
  setApplyInfo,
  applyStatus
} = api
const app = getApp()
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iscolor: 'rgba(255,174,194,1)',
    usershop: '',
    username: '',
    txtOne: '',
    txtTwo: '',
    businesslicenseImg: './img/img_businesslicense.png',
    shoppictureImg: './img/img_shoppicture.png',
    img_one: '',
    img_two: '',
    isactionSheet: false,
    iswho: '',
    actiions: [{
        name: '拍照',
      },
      {
        name: '从相册上传'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 拉取认证信息
    wx.hideShareMenu()
    getApplyInfo({}).then(res => {
      if (res.data.bizLicensePic) {
        var bizLicensePic = res.data.bizLicensePic;
        var txtOne = '重新上传';
      } else {
        var bizLicensePic = this.data.businesslicenseImg;
        var txtOne = '上传营业执照';
      }
      if (res.data.shopFrontPic) {
        var shopFrontPic = res.data.shopFrontPic;
        var txtTwo = '重新上传';
      } else {
        var shopFrontPic = this.data.shoppictureImg;
        var txtTwo = '上传店铺照片';
      }
      this.setData({
        usershop: res.data.companyName,
        username: res.data.nickname,
        img_two: shopFrontPic,
        img_one: bizLicensePic,
        txtOne,
        txtTwo,

      });
      this.iscolors()
    });
    // 提交认证信息
  },
  jumpToHome: throttle(function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }),
  // 判断变色
  iscolors() {
    if (this.data.usershop !== '' && this.data.username !== '' && this.data.img_one != this.data.businesslicenseImg && this.data.img_two != this.data.businesslicenseImg) {
      this.setData({
        iscolor: 'rgba(255,51,102,1)',
      })
    } else {
      this.setData({
        iscolor: 'rgba(255,174,194,1)',
      })
    }
  },
  // 获取铺名
  usershop: function (e) {
    this.setData({
      usershop: e.detail.value
    })
    this.iscolors();

  },

  // 获取姓名
  username: function (e) {
    this.setData({
      username: e.detail.value
    })
    this.iscolors();

  },
  getSex(e) {
    this.setData({
      isactionSheet: true,
      iswho: e.currentTarget.dataset.is
    });
  },
  actionSheetCancel() {
    this.setData({
      isactionSheet: false
    });
  },
  actionSheetClickItem(e) {
    var index = e.detail.index
    this.setData({
      isactionSheet: false
    })
    if (index == 1) {
      this.imgUpOne()
    }
    if (index == 0) {
      this.imgUptwo()
    }

  },
  // 本地相册
  imgUpOne() {
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        // 判断第几个图，01第一个，02第二个
        this.newImgTxt(tempFilePaths);
      }
    })
  },
  // 相机
  imgUptwo() {
    wx.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        this.newImgTxt(tempFilePaths);
      }
    });
  },
  // 显示图片和重新上传
  newImgTxt(tempFilePaths) {
    if (this.data.iswho == '01') {
      this.setData({
        img_one: tempFilePaths,
        txtOne: '重新上传'
      })
      this.iscolors();
      this.uploadLicense(tempFilePaths);
    } else {
      this.setData({
        img_two: tempFilePaths,
        txtTwo: '重新上传'
      })
      this.iscolors();
      this.uploadShopFront(tempFilePaths);
    };
  },
  // 上传店铺图片
  uploadShopFront(tempFilePaths) {
    //  文件上传
    wx.uploadFile({
      url: 'https://api.xiaomei360.com/v2/user/upload-shop-front',
      filePath: tempFilePaths,
      header: {
        "content-type": 'multipart/form-data',
        "Authorization": `Basic ${encode(wx.getStorageSync('Authorization')+':')}`,
      },
      name: 'file',
      formData: {
        user: 'test'
      },
      success: (res) => {

      }
    })
  },
  // 上传营业图片
  uploadLicense(tempFilePaths) {
    //  文件上传
    wx.uploadFile({
      url: 'https://api.xiaomei360.com/v2/user/upload-license',
      filePath: tempFilePaths,
      header: {
        "content-type": 'multipart/form-data',
        "Authorization": `Basic ${encode(wx.getStorageSync('Authorization')+':')}`,
      },
      name: 'file',
      formData: {
        user: 'test'
      },
      success: (res) => {}
    })
  },

  submitOn: throttle(function () {
    if (this.data.usershop != '' && this.data.username != '' && this.data.img_one != this.data.businesslicenseImg && this.data.img_two != this.data.shoppictureImg) {
      // 提交
      setApplyInfo({
        companyName: this.data.usershop,
        nickname: this.data.username
      }).then(res => {
        if (res.code == 0) {
          var pages = getCurrentPages() //获取加载的页
          var prevPage = pages[pages.length - 2];
          if (prevPage && prevPage.route == 'pages/usableno/usableno') {
            wx.navigateBack({
              delta: 1
            })
            return false
          } else {
            wx.navigateTo({
              url: '/pages/usableno/usableno',
            })
          }
        } else {
          $Toast({
            content: '您填写的信息有误，请核对后提交。'
          });
        }
      })
    } else if (this.data.usershop == '') {
      $Toast({
        content: '请输入实体店名称'
      });
    } else if (this.data.username == '') {
      $Toast({
        content: '请输入联系人姓名'
      });
    } else if (this.data.img_one == this.data.businesslicenseImg) {
      $Toast({
        content: '请上传营业执照'
      });
    } else if (this.data.img_two == this.data.shoppictureImg) {
      $Toast({
        content: '请上传店铺照片'
      });
    }
  }),
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var pages = getCurrentPages()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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

})