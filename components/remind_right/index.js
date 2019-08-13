// components/remind_right/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isPageId: {
      type: String,
      value: '',
      observer(newData, oldData) {
       
        this._isPageId(newData)
      }
    },
    menus: {
      type: Array,
      value: [],
      observer(newData, oldData) {
      
        this._menus(newData)
      }
    },
    autoJump: {
      type: Boolean,
      value: true,
    },
    title: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isId: '',
    imgWith: true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goMenus(e) {
      var pageid = e.currentTarget.dataset.pageid;
      var index = e.currentTarget.dataset.index;
     
      // if (this.data.autoJump) {
      //   // 表白季的特卖会场专有判断
      //   var activityBigTwo = '/pages/activityBig/activityBig?type=temai';
      //   if (activityBigTwo != pageid) {
      //     app.handleJumpToTop();
      //   }
      // }
      this.triggerEvent('upMenus', {
        pageId: pageid,
        index:index
      });
    },
    _isPageId(newData) {
      this.setData({
        isId: newData
      });
    
    },
    _menus(newData) {
      this.setData({
        menus: newData
      });
    
      clearTimeout(letters);
      var letters = setTimeout(() => {
        this.setData({
          imgWith: false
        })
      }, 100);
    },
    imgShow() {
     
      this.triggerEvent('allPreferential', {});
    },
    move() {
      return false;
    },
  }
})