// components/Integralshopping/index.js
import api from '../../utils/api.js'
const {
  exchangeBuy
} = api
Component({
  properties: {
    balance: Number,
    marketPrice: String,
    addCartList: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        this._getaddCartList(newData)
      }
    },
  },
  data: {
    modalName: null,
    hideIntegra: false,
    goodsList: [],
    goodsId: '',
    numbers: '',
    isAddTag: false,
    modalName:false
  },
  methods: {
    _getaddCartList(newData) {
      if (newData) {
        this.setData({
          addCartList: newData,
          goodsList: newData.spuList||[]
        });
        var goodsList = this.data.goodsList
        goodsList.forEach(item => {
          if(item.goodsNum > item.startNum){
            item.value = item.startNum;
          }else{
            item.value = 0;
          }
         
          item.price=parseInt(item.price)
        });
        this.setData({
          goodsList
        })
      }
    //这个事件精简下

    },
    onConfirm(e) {
      this.setData({
        hideIntegra: !this.data.hideIntegra,
        modalName:!this.data.modalName
      });
     
    },
    // 增加
    addnum(e) {
      var child = this.selectComponent('#premind');
      var number;
      var goodsList = this.data.goodsList;
      var price = e.currentTarget.dataset.price;
      var value = e.currentTarget.dataset.value;
      var goodsId = e.currentTarget.dataset.goodsid;
      var goodsNum = e.currentTarget.dataset.goodsnum;
      var numberPerBox = e.currentTarget.dataset.numberperbox;
      var goodsId = e.currentTarget.dataset.goodsid;
      goodsList.forEach(item => {
        // 判断是哪个
        if (goodsId == item.goodsId) {
          // 判断是否可以相加
          if (numberPerBox) {
            if (+value + +numberPerBox > +goodsNum) {
              item.value = +value;
              // 最大数量
              child.remind('超过当前库存');
            } else {
              number = (+value + +numberPerBox) * price;
             
              // 判断积分是否够用
              if (number > this.data.balance) {
                item.value = item.value;
                child.remind('可用积分不足');
              } else {
                item.value = +value + +numberPerBox;
              }
            };
          } else {
            if (+value + 1 > +goodsNum) {
              item.value = +value;
              // 最大数量
              child.remind('超过当前库存');

            } else {

              number = (+value + 1) * price;
             
              // 判断积分是否够用
              if (number > this.data.balance) {
                item.value = item.value;
                child.remind('可用积分不足');
              } else {
                item.value = +value + 1;
              }
            };
          }

          number = item.value * item.price
        };
       
      });
      this.setData({
        goodsList,
        goodsId,
        number
      });

    },
    // 减少
    reduce(e) {
      var child = this.selectComponent('#premind')
      var number;
      var goodsList = this.data.goodsList;
      var price = e.currentTarget.dataset.price;
      var value = e.currentTarget.dataset.value;
      var goodsId = e.currentTarget.dataset.goodsid;
      var goodsNum = e.currentTarget.dataset.goodsnum;
      var numberPerBox = e.currentTarget.dataset.numberperbox;
      var goodsId = e.currentTarget.dataset.goodsid;
     
      goodsList.forEach(item => {
        // 判断是哪个
        if (goodsId == item.goodsId) {
         
          // 判断是否按箱
          if (numberPerBox) {
            // 判断是否可以相减
            if (+value - +numberPerBox < +item.startNum) {
              item.value = +value;
           
              // 最小数量
              child.remind('亲，已经不能再少了哦');
            } else {
              item.value = +value - +numberPerBox;
             
            }
          } else {
            // 判断是否可以相减
            if (+value - 1 < +item.startNum) {
              item.value = +value;
             
              // 最小数量
              child.remind('亲，已经不能再少了哦');
            } else {
              item.value = +value - 1;
             
            }
          }

          number = item.value * item.price
        };
      });
      this.setData({
        goodsList,
      })
    },
    goshop(e) {
      var goodsList = this.data.goodsList;
      var goodsId = '';
      var goodsNum = 0;
      var child = this.selectComponent('#premind')
      for (let i = 0; i < goodsList.length; i++) {
        goodsId = goodsList[i].goodsId
        goodsNum = goodsList[i].value
      }
      exchangeBuy({
        goodsId: goodsId,
        goodsNum: goodsNum
      }).then(res => {
        // 成功提示
        if (res.code ==0) {
          this.setData({
            isAddTag: true,
          })
        }else{
          child.remind(res.msg);
        }
      });
    },
    istoView() {
      this.ShutDown();
      this.onConfirm();
      wx.navigateTo({
        url: '/pages/self/integral/integralOrderList/integralOrderList',
      })
    },
    ShutDown() {
      this.setData({
        isAddTag: false,
      })
    }
  }
})