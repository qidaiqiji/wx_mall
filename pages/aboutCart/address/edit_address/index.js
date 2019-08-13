// pages/address/edit_address/index.js
var tcity = require("../../../../utils/citys.js");
import api from '../../../../utils/api.js'

const {
  addressCreate,
  addressUpdate,
  addressDelete
} = api
const app = getApp()
Page({


  /**
   * 页面的初始数据
   */
  data: {
    value: [0, 0, 0],
    condition: false,
    provinceId: '',
    provinceName: '',
    cityId: '',
    cityName: '',
    districtId: '',
    districtName: '',
    isDefault: 0,
    onlyProvince: false,
    realIsDefault: 0,
    isShowDelete: true,
    visible: false,
    actions: [{
        name: '取消',
        color: '#889696'
      },
      {
        name: '确定',
        color: '#FF3366'
      }
    ],
  },
  test({
    detail
  }) {
  },
  open: function () {
    this.setData({
      condition: !this.data.condition,
      isShowAddr: true
    })
  },
  handleClose(e) {
    if (e.detail.isConfirm) {
      var values = e.detail.values
      this.showArea(values)
      this.setData({
        condition: e.detail.condition,
        value: e.detail.values,
        isShowAddr: false
      })
    } else {
      this.setData({
        condition: e.detail.condition,
        isShowAddr: false
      })
    }
  },
  handleIsDefault() {
    this.setData({
      realIsDefault: this.data.realIsDefault ? 0 : 1
    })
  },
  switchChange(e) {
    this.setData({
      realIsDefault: e.detail.value ? 1 : 0
    })

  },
  showArea(values) {
    tcity.init(this);
    var cityData = this.data.cityData;
    var provinceId = ''
    var provinceName = ''
    var cityId = ''
    var cityName = ''
    var districtId = ''
    var districtName = ''
    for (let i = 0; i < cityData.length; i++) {
      if (i == values[0]) {
        provinceId = cityData[i].id
        provinceName = cityData[i].name
      }
    }
    if (!this.data.onlyProvince) {
      for (let i = 0; i < cityData[values[0]].child.length; i++) {
        if (i == values[1]) {
          cityId = cityData[values[0]].child[i].id
          cityName = cityData[values[0]].child[i].name
        }
      }
      if (cityData[values[0]].child[values[1]].child) {
        for (let i = 0; i < cityData[values[0]].child[values[1]].child.length; i++) {
          if (i == values[2]) {
            districtId = cityData[values[0]].child[values[1]].child[i].id
            districtName = cityData[values[0]].child[values[1]].child[i].name
          }
        }
      }
    }
    this.setData({
      provinceId,
      provinceName,
      cityId,
      cityName,
      districtId,
      districtName,
    })
  },
  getArea(values) {
    tcity.init(this);
    var cityData = this.data.cityData;
    var value = this.data.value
    var provinceId = ''
    var provinceName = ''
    var cityId = ''
    var cityName = ''
    var districtId = ''
    var districtName = ''
    for (let i = 0; i < cityData.length; i++) {
      if (cityData[i].id == values[0]) {
        value[0] = i
        if (!this.data.onlyProvince) {
          for (let j = 0; j < cityData[value[0]].child.length; j++) {
            if (cityData[value[0]].child[j].id == values[1]) {
              value[1] = j
            }
          }
          if (cityData[value[0]].child[value[1]].child) {
            for (let k = 0; k < cityData[value[0]].child[value[1]].child.length; k++) {
              if (cityData[value[0]].child[value[1]].child[k].id == values[2]) {
                value[2] = k
              }
            }
          }
        }
      }
    }
    this.setData({
      provinceId,
      provinceName,
      cityId,
      cityName,
      districtId,
      districtName,
      value
    })
  },
  handleInput(e) {
    if (e.currentTarget.dataset.type == 'mobile') {
      let re = /^1\d{10}$/
      if (!re.test(e.detail.value)) app.onToast('请正确填写手机号')
    }
    this.setData({
      [e.currentTarget.dataset.type]: e.detail.value
    })
  },
  handleSave() {
    var consignee = this.data.consignee
    var mobile = this.data.mobile
    var address = this.data.address
    var provinceId = this.data.provinceId
    var cityId = this.data.cityId
    var districtId = this.data.districtId
    var isDefault = this.data.realIsDefault
    if (consignee && mobile && provinceId && address) {
      if (this.data.addressId) {
        addressUpdate({
          addressId: this.data.addressId,
          consignee: consignee,
          mobile: mobile,
          address: address,
          provinceId,
          cityId,
          districtId,
          isDefault
        }).then(res => {
          if (res.code == 0) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      } else {
        addressCreate({
          consignee: consignee,
          mobile: mobile,
          address: address,
          provinceId,
          cityId,
          districtId,
          isDefault
        }).then(res => {
          if (res.code == 0) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            app.onToast(res.msg)
          }
        })
      }
    } else {
      app.onToast('请填写完整信息')
    }
  },
  clearValue(e) {
    this.setData({
      [e.currentTarget.dataset.value]: ''
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onLoad: function (options) {
    if (options.addressitem) {
      var editData = JSON.parse(options.addressitem)
      wx.setNavigationBarTitle({
        title: '修改收货地址'
      })
      // options.addressitem
      var values = []
      values[0] = editData.provinceId
      values[1] = editData.cityId
      values[2] = editData.districtId
      this.getArea(values)

      this.setData({
        addressId: options.addressId,
        address: editData.address,
        provinceName: editData.provinceName,
        cityName: editData.cityName,
        consignee: editData.consignee,
        districtName: editData.districtName,
        isDefault: editData.isDefault ? 1 : 0,
        mobile: editData.mobile,
        realIsDefault: editData.isDefault ? 1 : 0,
        addressId: editData.addressId,
        provinceId: editData.provinceId,
        cityId: editData.cityId,
        districtId: editData.districtId
      })

    } else {
      wx.setNavigationBarTitle({
        title: '添加收货地址'
      })
      this.setData({
        isShowDelete: false
      })
    }
    // 地区如果一开始存在  要赋值

  },
  handleIsShowTip() {
    this.setData({
      visible: this.data.visible ? false : true
    })
  },
  handleDelete({
    detail
  }) {
    // 删除
    if (detail.index == 1) {
      addressDelete({
        addressId: this.data.addressId
      }).then(res => {
        if (res.code == 0) {
          app.onToast(res.msg)
          wx.navigateBack({
            delta: 1
          })
        } else if (res.code == 1) {
          app.onToast(res.msg)
        }
      }).catch(fail => {
        console.log(fail)
      })
      this.setData({
        visible: false
      })

    } else {
      this.setData({
        visible: this.data.visible ? false : true
      })
    }


  },

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
})