// components/shbpba/index.js
import api from '../../../utils/api.js'

const {
  setadd,
  getremovdremind,
  noremovdremind,
} = api
const app = getApp()

var myBehavior = require('../../behaviors.js')
Component({
  /**
   * 组件的属性列表
   */

  behaviors: [myBehavior],
  options: {
    multipleSlots: true
  },
  properties: {
    actGoodsId: {
      type: Number,
      value: 0,
      observer: function (newData, oldData) {
        this._actGoodsId(newData)
      }
    },
    groupId: String,
    bottomSwitch: {
      type: Boolean,
      value: false,
      observer: function (newData, oldData) {
        this._bottomSwitch(newData)
      }
    },
    groupShopping: String,
    isSpell: String,
    bigbrand: String,
    isNew: {
      type: Number,
      value: 0,
      observer: function (newData, oldData) {
        this._isNew(newData)
      }
    },
    shbpbaWrapHeight: {
      type: Number,
      value: 899,
      observer: function (newData, oldData) {
        if (newData) {
          this._shbpbaWrapHeight(newData)
        }

      }
    },
    shbpbaListHeight: {
      type: Number,
      value: 344,
      observer: function (newData, oldData) {
        if (newData) {
          this._shbpbaListHeight(newData)
        }

      }
    },
    maskLayer: {
      type: String,
      value: '',
      observer: function (newData, oldData) {
        if (newData) {
          this._maskLayer(newData)
        }

      }
    },
    vip: {
      type: Boolean,
      value: {},
      observer: function (newData, oldData) {
        if (newData) {
          this._getvip(newData)
        }

      }
    },
    kind: String,
    addCartList: {
      type: Object,
      value: {},
      observer: function (newData, oldData) {
        this._getData(newData)

      }
    },
    goodsId: {
      type: String,
      value: '',
      observer(newData, oldData) {

        this._getGoodsId(newData)
      },
    },
    goodsList: {
      type: Object,
      value: {},
      observer(newData, oldData) {

        if (newData !== null) {
          this._getGoodsList(newData)
        }
      },
    },
    vip: Boolean,
    groupShoppingInfo: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        console.log(newData, oldData)
        if (newData !== null) {
          this._getGroupShoppingInfo(newData)
        }
      },
    }
  },

  data: {
    quan: false,
    modalName: null,
    ms: 'rgba(2,189,152,1)',
    num: '0',
    totalprice: '0',
    addCartList: {},
    goodsIdList: [],
    content: '取消提醒',
    contentBOn: false,
    animation: '',

    groupShoppingInfo: {
      actGoodsId: ''
    }
  },



  /**
   * 组件的初始数据
   */

  /**
   * 组件的方法列表
   */
  ready() {
    this.animation = wx.createAnimation();
    this.animation.opacity(1, 0);
    this.setData({
      animation: this.animation.export()
    });

    this.data.addCartList && this.data.addCartList.spuList.map(item => {
      if (item.goodsId == this.data.goodsId) {
        if (item.goodsNum >= item.startNum) {
          item.value = item.startNum
        } else {
          item.value = 0
        }
      } else {
        item.value = 0
      }
    })

  },

  methods: {
    _actGoodsId(newData) {
      this.setData({
        actGoodsId: newData,
      })
    },
    _bottomSwitch(newData) {
      this.setData({
        bottomSwitch: newData,
      })
    },
    _isNew(newData) {
      this.setData({
        isNew: newData
      });
    },
    _shbpbaWrapHeight(newData) {
      this.setData({
        shbpbaWrapHeight: newData
      });

    },
    _shbpbaListHeight(newData) {
      this.setData({
        shbpbaListHeight: newData
      })
    },
    _maskLayer(newData) {
      this.setData({
        maskLayer: newData
      })
    },
    _getGoodsId(newData) {
      this.setData({
        goodsId: newData
      })
      console.log(newData, 'newData')
    },
    _getData(newData) {

      this.setData({
        addCartList: newData
      }, () => {
        this.count()

      })

    },
    _getGoodsList(newData) {


      var goodsInfo = newData.goodsInfo

      var obj = {}
      obj.goodsThumb = goodsInfo.thumb
      obj.goodsNum = goodsInfo.stock

      obj.maxNum = goodsInfo.maxNum ? goodsInfo.maxNum : goodsInfo.stock
      obj.goodsName = goodsInfo.goodsName
      obj.numberPerBox = goodsInfo.boxNum
      obj.unit = goodsInfo.unit
      obj.start = goodsInfo.startNum
      obj.isZhifa = goodsInfo.isZhifa
      obj.isBuyByBox = goodsInfo.isBuyByBox

      obj.spuList = []
      var item = {}
      item.goodsId = goodsInfo.goodsId
      item.skuSize = goodsInfo.goodsName
      item.goodsSn = goodsInfo.goodsSn
      item.price = goodsInfo.goodsPrice
      item.startNum = goodsInfo.startNum
      item.goodsNum = goodsInfo.stock
      item.maxNum = goodsInfo.maxNum ? goodsInfo.maxNum : goodsInfo.stock
      item.goodsThumb = goodsInfo.thumb
      item.buyByBox = goodsInfo.isBuyByBox
      item.numberPerBox = goodsInfo.boxNum
      item.isActivity = goodsInfo.isActivity
      item.reminder = goodsInfo.reminder

      obj.spuList.push(item)

      this.setData({
        addCartList: obj
      }, () => {
        this.count()
      })
    },
    _getGroupShoppingInfo(newData) {
      console.log(newData)
      this.setData({
        groupShoppingInfo: newData
      })
    },
    showModal: function () {
      var modalName = this.properties.kind
      this.setData({
        modalName,
      })
    },
    // 增加
    addnum(e) {
      console.log(e.currentTarget.dataset, 'dataset')
      var value = e.currentTarget.dataset.value
      var snumberperbox = e.currentTarget.dataset.snumberperbox
      var buybybox = e.currentTarget.dataset.buybybox;
      var sstartnum = e.currentTarget.dataset.sstartnum;
      var sgoodsid = e.currentTarget.dataset.sgoodsid;
      var goodsnum = e.currentTarget.dataset.maxnum
      var goodsmax = e.currentTarget.dataset.goodsnum
      var addCartList = this.data.addCartList
      var goodsList = addCartList.spuList
      var price = e.currentTarget.dataset.price
      goodsList.forEach(item => {
        console.log(item.goodsId, this.data.goodsId)
        if (item.goodsId == this.data.goodsId) {
          if (!value) {
            value = sstartnum;
          }
          //做其他商品为零的修改
          if (+item.goodsId === +sgoodsid) {
            console.log(buybybox)
            if (!!buybybox) {
              console.log(snumberperbox)
              if (+value + +snumberperbox > +goodsnum) {
                item.value = goodsnum
                //  第一个列表
                let msg = '超过当前可购数量';
                this.remind(msg);
              } else {
                item.value = value + snumberperbox
              }
            } else {
              if (+value + 1 > +goodsnum) {
                item.value = goodsnum
                let msg = '超过当前可购数量';
                this.remind(msg);
              } else {
                item.value = value + 1
              }
            };
          }
        } else {
          if (+item.goodsId === +sgoodsid) {
            if (item.value < sstartnum) {
              item.value = sstartnum;
              return false;
            }
            if (!!buybybox) {
              if (+value + +snumberperbox >= +goodsnum) {
                item.value = goodsnum;
                // 第二行列表大于库存
                let msg = '超过当前可购数量';
                console.log('77777')
                this.remind(msg);
              } else {
                item.value = value + snumberperbox
              }
            } else {
              if (+value + 1 >= +goodsnum) {
                let msg = '超过当前可购数量';
                console.log('77877')
                this.remind(msg);
                item.value = goodsnum
              } else {
                item.value = value + 1
              }
            };
          }
        }
      })
      this.setData({
        addCartList
      }, () => {
        this.count()
      })
      console.log(this.data.addCartList, 'addCartList')
    },
    count() {
      var addCartList = this.data.addCartList
      var goodsList = addCartList && addCartList.spuList
      var totalprice = goodsList && goodsList.reduce((total, item) => {
        if (item.value !== 0) {
          return total + item.value * item.price
        } else {
          if (+item.goodsNum < +item.startNum) {
            item.value = 0
          }
          return total + item.value * item.price
        }
      }, 0)
      var num = goodsList && goodsList.reduce((total, item) => {
        if (item.value !== 0) {
          return total + item.value
        } else {
          return total + item.value
        }
      }, 0)
      this.setData({
        num,
        totalprice: totalprice && totalprice.toFixed(2),
        addCartList
      })
    },
    // 减少
    reduce(e) {
      var value = e.currentTarget.dataset.value
      var snumberperbox = e.currentTarget.dataset.snumberperbox
      var buybybox = e.currentTarget.dataset.buybybox;
      var sstartnum = e.currentTarget.dataset.sstartnum;
      var sgoodsid = e.currentTarget.dataset.sgoodsid;
      var addCartList = this.data.addCartList
      var goodsList = addCartList.spuList
      var price = e.currentTarget.dataset.price;

      goodsList.forEach(item => {
        console.log(item.goodsId, this.data.goodsId)
        if (item.goodsId == this.data.goodsId) {
          //为多个商品为零做修改

          if (value == 0) {
            console.log('1', value)
            let msg = '亲，已经不能再少了哦';
            this.remind(msg);
            return false
          }
          if (+item.goodsId == +sgoodsid) {
            if (buybybox) {
              if (value - snumberperbox <= sstartnum) {
                item.value = sstartnum;
                let msg = '亲，已经不能再少了哦';
                this.remind(msg);
              } else {
                item.value = value - snumberperbox
              }
            } else {
              console.log(value == sstartnum, '数量', value, sstartnum)
              if (value == sstartnum) {
                item.value = value
                let msg = '亲，已经不能再少了哦';
                this.remind(msg);
              } else {
                item.value = --value
              }
            }

          } else {
            console.log('3', value)
            // 列表第二项开始
            goodsList.forEach(item => {

              if (+item.goodsId === +sgoodsid) {
                console.log('-2', buybybox)
                if (buybybox) {
                  console.log('-3', value - snumberperbox, sstartnum)
                  if (value - snumberperbox < sstartnum) {
                    item.value = 0;
                    let msg = '亲，已经不能再少了哦';
                    this.remind(msg);
                  } else {
                    item.value = value - snumberperbox
                  }
                } else {

                  if (value == 0) {
                    item.value = 0
                    let msg = '亲，已经不能再少了哦';
                    this.remind(msg);
                  } else {
                    item.value = --value
                  };
                }
              }
            })
          }
        }
      })
      this.count()
    },
    changenum(e) {
      var value = +e.detail.value
      var snumberperbox = e.currentTarget.dataset.snumberperbox
      var sstartnum = e.currentTarget.dataset.sstartnum;
      var sgoodsid = e.currentTarget.dataset.sgoodsid;
      var addCartList = this.data.addCartList
      var goodsList = addCartList.spuList
      var price = e.currentTarget.dataset.price
      var goodsnum = e.currentTarget.dataset.maxnum
      goodsList.forEach(item => {
        if (item.goodsId == this.data.goodsId) {
          if (+item.goodsId === +sgoodsid) {
            if (+value < +sstartnum) {
              item.value = sstartnum
            } else if (+value > +goodsnum) {

              item.value = goodsnum
            } else {
              item.value = value
            }
          }
        } else {
          if (+item.goodsId === +sgoodsid) {
            if (+value > 0 && +value < +sstartnum) {
              item.value = sstartnum
            } else if (+value > +goodsnum) {
              item.value = goodsnum
            } else if (+value == 0) {
              item.value = 0
            } else {
              item.value = value
            }
          }
        }
      })
      this.count()
    },
    goshop(e) {

      if (this.data.isNew && this.data.addCartList.spuList.length == 0) {

        this.triggerEvent('hideCart', {
          isRequestCouDanList: true,
          msg: '该商品即将上新请耐心等待'
        });
      } else {
        var goodsId = 0;
        var goodsNum = 0;
        var spuList = this.data.addCartList.spuList && this.data.addCartList.spuList
        for (let i = 0; i < spuList.length; i++) {
          goodsId = spuList[i].goodsId
          goodsNum = spuList[i].value
          this.data.goodsIdList.push({
            goodsId,
            goodsNum
          })
        }
        if (this.data.isSpell == "spell") {
          var actGoodsId = this.data.actGoodsId ? this.data.actGoodsId : this.data.groupShoppingInfo.actGoodsId
          console.log(this.data, '++++++1++++++');
          wx.navigateTo({
            url: '/pages/aboutCart/confirmOrder/confirmOrder?groupShoppingId=' + actGoodsId + '&gsGroupId=' + this.data.groupId + '&groupNum=' + spuList[0].value + '&extCode=group_shopping',
          })
        } else {
          console.log(this.data, '++++++++2++++')
          setadd({
            isVip: e.currentTarget.dataset.vip ? 1 : 0,
            goodsList: this.data.goodsIdList
          }).then(res => {
            if (res.code == 0) {
              app.onTotalCount(res.data.totalCount, 3)
              this.triggerEvent('getTotle', {
                totalCount: res.data.totalCount
              });
            }
            var addCartList = this.data.addCartList
            var goodsLists = addCartList.spuList
            goodsLists.map(item => {
              item.value = 0
            })
            this.setData({
              ...res.data,
              addCartList,
              goodsIdList: [],
              value: 0,
            })
            this.count()
            this.triggerEvent('hideCart', {
              isRequestCouDanList: true,
              msg: res.msg || res.msg
            });
          }).catch(fail => {

            this.triggerEvent('hideCart', {
              msg: res.msg || res.msg
            });
          });
        }
      }
    },
    onConfirm(e) {
      var addCartList = this.data.addCartList
      var goodsList = addCartList && addCartList.spuList
      goodsList && goodsList.map(item => {
        item.value = 0
      })
      this.count()
      this.setData({
        goodsIdList: [],
        modalName: null
      })
      this.triggerEvent('hideCart')
    },
    miaoshaup(e) {

    },
    // 到货提醒
    unsetreminder(e) {
      var sgoodsid = e.currentTarget.dataset.goodsid;
      var reminder = e.currentTarget.dataset.reminder;
      var goodsList = this.data.addCartList.spuList;
      getremovdremind({
        goodsId: sgoodsid,
        formId: e.detail.formId
      }).then(res => {
        goodsList.map(item => {
          if (+item.goodsId == +sgoodsid) {
            item.reminder = 1
          }
        })
        this.setData({
          content: res.msg,
          contentBOn: true,
          addCartList: this.data.addCartList
        })
        clearTimeout(timmer);
        var timmer = setTimeout(() => {
          this.setData({
            contentBOn: false
          })

        }, 3000);

        if (this.properties.bigbrand == 'bigbrand') {
          this.triggerEvent('isBigBrand', {
            reminder: 1,
            goodsId: this.properties.goodsId
          });
        }
      }).catch(res => {
        this.setData({
          content: res.msg
        })
      });

    },
    // 取消提醒
    setreminder(e) {
      var sgoodsid = e.currentTarget.dataset.goodsid;
      var reminder = e.currentTarget.dataset.reminder;
      var goodsList = this.data.addCartList.spuList;
      noremovdremind({
        goodsId: sgoodsid
      }).then(res => {
        goodsList.map(item => {
          if (+item.goodsId == +sgoodsid) {
            item.reminder = 2
          }
        })
        this.setData({
          content: res.msg,
          contentBOn: true,
          addCartList: this.data.addCartList
        })
        clearTimeout(timmer);
        var timmer = setTimeout(() => {
          this.setData({
            contentBOn: false
          })
        }, 3000);

        if (this.properties.bigbrand == 'bigbrand') {
          this.triggerEvent('isBigBrand', {
            reminder: 2,
            goodsId: sgoodsid
          });
        }
      }).catch(res => {
        this.setData({
          content: res.msg
        })
      });
    },
    // 加入提醒
    remind(msg) {
      this.setData({
        content: msg,
        contentBOn: true,
      })
      clearTimeout(timmer);
      var timmer = setTimeout(() => {
        if (msg == '亲，已经不能再少了哦' || msg == '超过当前可购数量') {
          this.setData({
            contentBOn: false,
          })
        } else {
          this.setData({
            contentBOn: false,
            modalName: null
          })
        }
      }, 1500);
    },
    move() {
      return false;
    },
    formSubmit(e) {

    },
  }
})