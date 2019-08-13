// components/filtrateDrawer/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow:Boolean,
    clearItemCheck:Boolean,
    category:{
      type:Array,
      value:[]
    },
     countries:{
       type:Array,
       value:[]
     },
     tags:{
       type:Array,
       value:[]
     }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tagsIndex:'',
    countriesIndex:'',
    categoryIndex:'',
    isClick:false
  },
  /**
   * 组件的方法列表
   */  
  pageLifetimes: {
    show() {
      // 页面被展示
      if (this.properties.clearItemCheck) {
        this.setData({
          tagsIndex: '',
          countriesIndex: '',
          categoryIndex: ''
        })
      }
    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化
    }
  },
  methods: {
    move(){
      return false
    },
    cancelDrawer(){
      this.setData({
        tagsIndex: '',
        countriesIndex: '',
        categoryIndex: ''
      })
      this.triggerEvent('filterClick', {
        type:'cancel',
      })
    },
    confirmDrawer(){
        this.triggerEvent('filterClick', {
          type: 'confirm',
          tagsIndex: this.data.tagsIndex,
          countriesIndex: this.data.countriesIndex,
          categoryIndex: this.data.categoryIndex,
          isClick: this.data.isClick
        })


    },
    onClickMask(){
      this.setData({
        tagsIndex: '',
        countriesIndex: '',
        categoryIndex: ''
      })
      this.triggerEvent('filterClick', {
        type: 'confirm',
        isClick: false
      })
    },
    onFilterChecked(e){
      this.setData({
        isClick:true
      })
      if (e.currentTarget.dataset.type === 'countries'){
        if (this.data.countriesIndex == e.currentTarget.dataset.index){
          this.setData({
            countriesIndex:''
          })
        }else{
          this.setData({
            countriesIndex: e.currentTarget.dataset.index
          })
        }
      } else if (e.currentTarget.dataset.type === 'category'){
        if (this.data.categoryIndex == e.currentTarget.dataset.index) {
          this.setData({
            categoryIndex: ''
          })
        } else {
          this.setData({
            categoryIndex: e.currentTarget.dataset.index
          })
        }
      } else if (e.currentTarget.dataset.type === 'tags'){
        if (this.data.tagsIndex == e.currentTarget.dataset.index) {
          this.setData({
            tagsIndex: ''
          })
        } else {
          this.setData({
            tagsIndex: e.currentTarget.dataset.index
          })
        }
      }
    }
  }
})
