// pages/address/address.js
const {
  $Toast
} = require('../../dist/base/index');
var tcity = require("../../utils/citys.js");

import api from '../../utils/api.js'
const {
  setprovince
} = api
const app = getApp()
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: '',
    sms: '#FFAEC2',
    provinceName: '',
    provinceId: '',
    value: [0, 0, 0],
    condition: false,
    onlyProvince: false,
  },
  // 触发下拉弹窗
  handleShowAddr: function (e) {
    this.setData({
      condition: true
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      sms: '#FF3366'
    })
    wx.setStorageSync('shengfen', this.data.array[e.detail.value]);
  },
  addressmy: function () {
    if (this.data.provinceId !== '') {
      // 修改省份
      setprovince({
        provinceId: +this.data.provinceId
      }).then(res => {
        if (res.code !== 0) {
          $Toast({
            content: res.msg
          });
        } else {
          this.setData({
            ...res.data
          });
          wx.reLaunch({
            url: '../index/index'
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var provinceId = this.data.provinceId
    tcity.init(this);
    var cityData = this.data.cityData;
    for (let i = 0; i < cityData.length; i++) {
      if (+cityData[i].id == +provinceId) {
        this.setData({
          value: [i, 0, 0],
          provinceName: this.data.provinceName
        })
      }
    }
  },
  jumpToHome: throttle(function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }),
  handleShowAddr: function (e) {
    this.setData({
      condition: true,
      onlyProvince: true
    })
  },
  showArea(values) {
    var cityData = this.data.cityData;
    for (let i = 0; i < cityData.length; i++) {
      if (+i == +values[0]) {
        this.setData({
          provinceId: cityData[i].id,
          provinceName: cityData[i].name
        })
      }
    }
    this.triggerEvent('chooseAddr', {
      provinceId
    })
  },
  handleCloseColor() {
    this.setData({
      sms: '#FF3366'
    })
  },
  // 城市id
  handleClose(e) {
    if (e.detail.isConfirm){
      this.showArea(e.detail.values);
    }else{
      this.setData({
        condition: false
      })
      return false
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  showArea(values) {
    var cityData = this.data.cityData;
    var provinceId = ''
    var provinceName = ''
    for (let i = 0; i < cityData.length; i++) {
      if (+i == +values[0]) {
        provinceId = cityData[i].id
        provinceName = cityData[i].name
      }
    }
    this.setData({
      provinceId,
      provinceName,
      condition: false,
      sms: '#FF3366'
    })
    this.triggerEvent('chooseAddr', {
      provinceId
    })
  },
  onUnload(){

  },

})