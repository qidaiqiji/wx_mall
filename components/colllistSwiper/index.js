// components/colllistSwiper/index.js
import api from '../../utils/api.js';
const {
  xcxAdAddClick,
} = api
const app = getApp();
const throttle = app.throttle;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    topCollList: Array,
    ads: Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    topurlList: throttle(function (e) {
      var collid = e.currentTarget.dataset.collid;
      if (e.currentTarget.dataset.goodscount) {
        xcxAdAddClick({
          id: e.currentTarget.dataset.goodscount
        }).then((res) => {
         
        })
      }
      wx.navigateTo({
        url: '/pages/homePage/colldetail/colldetail?collId=' + collid
      })
    }),
    goAdvertising: throttle(function (e) {
      app.adSpaceJump(e.currentTarget.dataset.item)
    }),
  }
})