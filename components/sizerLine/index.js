// components/sizerLine/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowFilter: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    condition: 'zonghe',
    types: 'desc',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCondition(e) {
      let index = e.currentTarget.dataset.index
      let types = this.data.types
      if (this.data.condition === 'zonghe' && index == 'zonghe') {
        return false
      }
      switch (index) {
        case 'zonghe':
          this.setData({
            condition: 'zonghe',
            types: ''
          })
          break;
        case 'filtrate':
          this.setData({
            condition: 'filtrate',
            types: ''
          })
          break;
        case 'sale':
        case 'price':
        case 'discount':
          this.setData({
            condition: index,
            types: types == 'desc' && index == this.data.condition ? 'asc' : 'desc',
            [index]: types == 'desc' && index == this.data.condition ? '/images/icon_high.png' : '/images/icon_low.png',
          })
      }
      this.triggerEvent('pushSizer', {
        condition: this.data.condition,
        types: this.data.types
      })
    },
  }
})