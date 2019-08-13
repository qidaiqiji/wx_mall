// pages/self/myInformation/myInformation.js
import api  from '../../../utils/api.js'
const { userInfo, changeUserInfo } = api
const app = getApp()
const throttle = app.throttle
const date = new Date()
const years = []
const months = []
const days = []

//获取年
for (let i = 1900; i <= date.getFullYear(); i++) {
  years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    toTheTop: false,
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    days: days,
    day: 2,
    value: [90, 0, 0],
    isShowBirthday:false,
    isactionSheet:false,
    contactWay:'',
    actiions:[
      {
        name: '男',
      },
      {
        name: '女'
      },
    ],
    sexName:'',
    birthday:'',
    requestLock:false,
  },
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
  },
  getBirthday(){
    this.setData({
      isShowBirthday:true
    })
  },
  getSex(){
    this.setData({
      isactionSheet: true
    });
  },
  actionSheetCancel(){
    this.setData({
      isactionSheet: false
    });
  },
  actionSheetClickItem(e){
    this.data.actiions.forEach((item,index)=>{
      if(index == e.detail.index){
        this.setData({
          sexName: item.name,
          isactionSheet: false
        })
      }
    })
  },
  move(){
    return false;
  },
  pickerViewCancel(){
    this.setData({
      isShowBirthday:false
    })
  },
  pickerViewConfirm(){


    this.setData({
      isShowBirthday:false,
      birthday: this.data.year + '-' + this.data.month + '-' + this.data.day
    })
  },
  getValue(e){
    if (e.detail.value){
      this.setData({
        contactWay: e.detail.value,

      })
    }else{
      this.setData({
        contactWay: ''

      })
    }
  },
  deleteValue(e){
    var kind = e.currentTarget.dataset.kind
    if (kind == 'sex'){
      this.setData({
        sexName: ''
      })
    } else if (kind == 'birthday'){
      this.setData({
        birthday: ''
      })
    }else if (kind == 'contactWay'){
      this.setData({
        contactWay:''
      })
    }
  },
  handleSaveMsg: throttle(function (e) {
    if (!this.data.requestLock){
      this.data.requestLock = true
    }else{
      return false
    }
    var userId = this.data.userId
    var contact = this.data.contactWay

    var sexName = this.data.sexName
    var sex =0
    if (sexName == '男'){
      sex=1
    } else if (sexName == '女'){
      sex=2
    }
    var birthday = this.data.birthday
      changeUserInfo({ userId, birthday, sex, contact}).then(res=>{
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000,
          success:()=>{
            setTimeout( ()=> {
              //要延时执行的代码
              this.setData({
                requestLock:false
              })
              wx.navigateBack({
                url: '/pages/my/my'
              })
            }, 1000) //延迟时间 
          }

          
        })

      })
  }),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var contactWay =''
    var sexName= ''
    userInfo().then(res=>{
      if(res.data.sex == 0){
        sexName=''
      } else if (res.data.sex == 1){
        sexName='男'
      }else{
        sexName = '女'
      }
      contactWay = res.data.contact
      this.setData({
        ...res.data,
        sexName,
        contactWay,
      })
    })
  },
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
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