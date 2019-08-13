// pages/goodsLists/goodsLists.js
import api from '../../utils/api.js'
const {
  index,
  goodsList,
  indexAds,
  getuser,
  foundUnread,
  autoLogin
} = api
const app = getApp()
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noLookHide: false,
    actPageTimesTwo: 'actPageTimesTwo',
    indextop: true,
    interval: '',
    addTopTagWrap: true, //顶部添加小程序
    indexWeek: true,
    toTheTop: false,
    goodsList: [],
    pageSize: 20,
    page: 1,
    requestLock: false,
    reachTheBottom: false,
    noLook: true,
    noLookTwo: false,
    isPopCart: false,
    current: 'homepage',
    isLoading: false,
    reacquire: false
  },
  addTopTag() {
    this.setData({
      addTopTagWrap: false
    })
  },
  onevokeAddCart(e) {
    var that = this;
    app.onevokeAddCart(that, e);
  },
  onhideCart(e) {
    var that = this
    app.onhideCart(that, e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 防止用户第一次没取到值报错
    wx.getStorage({
      key: 'appWeek',
      fail: (res) => {
        console.log(res.data, 'sssss');
        wx.setStorage({
          key: "appWeek",
          data: '2018-3-22'
        })
      }
    })
    // 获取当前时间判断今天第一次进入
    var compare = new Date();
    var isCompare = compare.getFullYear() + '-' + (compare.getMonth() + 1) + '-' + compare.getDate();
    isCompare = String(isCompare);
    wx.getStorage({
      key: 'appWeek',
      success: (res) => {
        if (res.data == isCompare) {
          this.setData({
            indexWeek: false,
            addTopTagWrap: false
          })
        } else {
          wx.setStorage({
            key: "appWeek",
            data: isCompare
          })
          this.setData({
            indexWeek: true,
            addTopTagWrap: true
          })
        }
      }
    })

    this.setData({
      ...options
    })
  },
  noLookHide() {
    this.setData({
      noLookHide: false
    })
  },
  renzhengGo() {
    app.getUserINfoFun()
  },
  allXinPin: throttle(function (e) {
    if (this.data.noLook) {
      app.userType()
    } else {
      wx.navigateTo({
        url: '/pages/homePage/xinpin/xinpin',
      })
    }
  }),
  newBrandList: throttle(function (e) {
    if (this.data.noLook) {
      app.userType()
    } else {
      var brandId = e.currentTarget.dataset.brandid;
      if (brandId) {
        wx.navigateTo({
          url: '/pages/goods/brandDetail/brandDetail?brandId=' + brandId,
        })
      }
    }
  }),
  goDiscounts: throttle(function (e) {
    if (this.data.noLook) {
      app.userType()
    } else {
      var pageId = e.currentTarget.dataset.pageid;
      if (pageId) {
        wx.navigateTo({
          url: '/pages/homePage/preferential/preferential?pageId=' + pageId,
        })
      }
    }
  }),
  vip: throttle(function () {
    if (this.data.noLook) {
      app.userType()
    } else {
      wx.navigateTo({
        url: '/pages/homePage/vipIndex/vipIndex',
      })
    }
  }),
  jumpToMiaoSha: throttle(function () {
    if (this.data.noLook) {
      app.userType()

    } else {
      wx.navigateTo({
        url: '/pages/homePage/miaosha/miaosha',
      })
    }
  }),
  jumpToHeadlineNews: throttle(function () {
    if (this.data.noLook) {
      app.userType()

    } else {
      wx.navigateTo({
        url: '/pages/homePage/headlineNews/headlineNews',
      })
    }
  }),
  // 广告位之前
  handleJump: throttle(function (e) {
    if (this.data.noLook) {
      app.userType()
    } else {
      app.adSpaceJump(e.currentTarget.dataset)
    }
  }),
  getGoodsList(page) {
    if (!this.data.requestLock) {
      this.data.requestLock = true
      let pageSize = +this.data.pageSize
      let allData = this.data.goodsList
      this.setData({
        isLoading: page > 1 ? true : false
      }, () => {

      })
      goodsList({
        pageSize,
        page
      }).then(res => {
        var listLength = res.data.goodsList.length
        allData = allData.concat([], ...res.data.goodsList)
        if (res.data.goodsList.length < pageSize) {
          this.setData({
            goodsList: allData,
            page,
            requestLock: true,
            reachTheBottom: true,
            isLoading: false,
          })
        } else {
          this.setData({
            goodsList: allData,
            page,
            requestLock: false,
            isLoading: true,
          })
        }
      }).catch(res => {
        this.setData({
          requestLock: false,
          isLoading: false,
          reacquire: false
        })
      })
    }
  },
  goAdvertising: throttle(function (e) {
    console.log(e.currentTarget.dataset)
    if (this.data.noLook) {
      app.userType()
    } else {
      if (e.currentTarget.dataset.item.url.indexOf('pages') != -1) {
        app.adSpaceJump(e.currentTarget.dataset.item)
      } else {
        wx.navigateTo({
          url: `/pages/webView/webView?ad=${e.currentTarget.dataset.item.url}`,
        })
      }

    }
  }),
  cancelIndexFixedAd() {
    this.setData({
      isIntoIndex: false
    })

  },
  move() {
    return false;
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

    // if (!this.data.reacquire){
    wx.login({
      success: (val) => {
        autoLogin({
          code: val.code
        }).then(res => {
          
console.log(res,'++++++++++++')
          if (res.code == 0) {
            wx.setStorageSync('Authorization', res.data.access_token)
            wx.setStorageSync('is_checked', res.data.is_checked)
            wx.setStorageSync('provinceId', res.data.provinceId)
            wx.setStorageSync('isActTime', res.data.isActTime)
            wx.setStorageSync('menus', res.data.actMenu)
            wx.setStorageSync('isInActivity', res.data.isInActivity)
            wx.setStorageSync('noLogin', false)
            if (res.data.is_checked == 2) {
              this.setData({
                noLook: false,
                noLookTwo:false
              })
              foundUnread({}).then(res => {
                app.onTotalCount(res.data.unreadCount, 2);
              }).catch(fail => {});
              console.log(this.data.indexWeek, 'indexWeekindexWeek')
            } else {
              // 未认证需判断时间
              if (this.data.indexWeek) {
                this.setData({
                  noLookHide: true
                })
              } else {
                this.setData({
                  noLookHide: false
                })
              }
              this.setData({
                noLook: true,
                noLookTwo: true,
              })
            }

            if (!res.data.nickName) {
              res.data.nickName = app.globalData.userInfo.nickName
            }
            app.globalData.userInfo = res.data;
            const imgHead = app.globalData.imgHead
            const version = app.globalData.userInfo.version
            this.setData({
              isActTime: wx.getStorageSync('isActTime'),
              img_homepage_miaosha_bg: imgHead + 'index/img_homepage_miaosha_bg.png?version=' + version,
              img_top_tag: imgHead + 'img_top_tag@2x.png?version=' + version,
              img_tag_miaosha: imgHead + 'img_tag_miaosha.png?version=' + version,
              reacquire: true
            })

            index({
              isToken: true
            }).then(res => {
              this.setData({
                ...res.data,
                actPageTimesTwo: 'actPageTimesTwo'
              }, () => {
                if (this.data.lastOrderInfo) {
                  this.indexTopOnUp(this.data.lastOrderInfo)
                }

              })
              if (res.data.totalCount) {
                app.onTotalCount(res.data.totalCount, 3)
              };
            }).catch(fail => {})
          } else {
            wx.setStorageSync('Authorization', '')
            wx.setStorageSync('is_checked', '')
            wx.setStorageSync('provinceId', '')
            wx.setStorageSync('noLogin', true)
            this.setData({
              noLook: true,
              reacquire: false
            }, () => {
              index().then(res => {
                this.setData({
                  ...res.data,

                }, () => {
                  if (this.data.lastOrderInfo) {
                    this.indexTopOnUp(this.data.lastOrderInfo)
                  }
                })
                if (res.data.totalCount) {
                  app.onTotalCount(res.data.totalCount, 3)
                };
              }).catch(fail => {})
            })
          }

          if (wx.getStorageSync('isActTime')) {
            this.setTabbar()
          }
        }).catch(res => {
          this.setData({
            reacquire: false
          })
        })
      }
    })
    // }

    if (!this.data.reacquire) {
      indexAds().then(res => {
        this.setData({
          ...res.data,
          isIntoIndex: res.data.ads.length > 0 ? true : false,
          reacquire: true
        })
      }).catch(fail => {
        this.setData({
          reacquire: false
        })
      })
      let page = +this.data.page
      this.getGoodsList(page);
    }
    console.log(this.data.noLookTwo,'noLookTwonoLookTwo')
  },
  indexTopOnUp(arr) {
    var indexNumber = arr.length;
    this.setData({
      interval: setInterval(() => {
        if (this.data.indextop) {
          setTimeout(() => {
            this.setData({
              indextop: false
            });
          }, 1500);
          var index = (Math.round(Math.random() * (indexNumber - 1) + 1) - 1);
          this.setData({
            arr: arr[index] || ''
          });
        } else {
          setTimeout(() => {
            this.setData({
              indextop: true,
            });
          }, 1500)
        }
      }, 2000)
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.interval);
    var addCartComponentsHide = this.selectComponent("#addCart");
    if (addCartComponentsHide != null) {
      addCartComponentsHide.onConfirm()
    }

    clearInterval(this.data.interval);
    if (this.data.flashSaleNew) {
      this.data.flashSaleNew.date = ''
    } else {
      this.data.flashSaleNew = ''
    }
    this.setData({
      flashSaleNew: this.data.flashSaleNew,
      noLookHide: false //离开取消去认证的蒙层
    })


  },
  setTabbar() {
    wx.setTabBarStyle({
      color: '#6e6d6b',
      selectedColor: '#C520FB',
    })
    wx.setTabBarItem({
      index: 0,
      text: '首页',
      iconPath: '/images/home.png',
      selectedIconPath: '/images/home_click.png'
    });
    wx.setTabBarItem({
      index: 1,
      text: '分类',
      iconPath: '/images/classify.png',
      selectedIconPath: '/images/classify_click.png'
    });
    wx.setTabBarItem({
      index: 2,
      text: '发现',
      iconPath: '/images/found.png',
      selectedIconPath: '/images/found_click.png'
    });
    wx.setTabBarItem({
      index: 3,
      text: '购物车',
      iconPath: '/images/cart.png',
      selectedIconPath: '/images/cart_click.png'
    });
    wx.setTabBarItem({
      index: 4,
      text: '我的',
      iconPath: '/images/my.png',
      selectedIconPath: '/images/my_click.png'
    });
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.daojiashi)
    this.data.flashSaleNew.date = ''
    this.setData({
      flashSaleNew: this.data.flashSaleNew
    })
    clearInterval(this.data.interval);

    var miaoshaIndex = "#miaoshaIndex"
    var miaoshaIndexTime = this.selectComponent(miaoshaIndex);
    clearInterval(miaoshaIndexTime.data.daojiashi);
    this.data.actPage.forEach((item, index) => {
      var actPageTimes = "#actPageTimes" + index
      var showTwo = this.selectComponent(actPageTimes);
      clearInterval(showTwo.data.daojiashi);

    })
  },
  ontoUpImgs() {
    app.handleJumpToTop();
  },
  onPageScroll(e) {
    if(this.data.addTopTagWrap){
      if (e.scrollTop > 10) {
        setTimeout(() => {
          this.setData({
            addTopTagWrap: false,
          })
        }, 1000)
      }
    }
 
    var that = this
    app.scrollRolling(that, e.scrollTop)
  },
  linshiclass() {
    wx.navigateTo({
      url: '/pages/superBrand/superBrand?superBrandId=1',
    })
  },
  biaobaiji() {
    wx.navigateTo({
      url: '/pages/activeDirectory/ledPassword/ledPassword'
    })
  },
  linshiclass2() {
    wx.navigateTo({
      url: '/pages/activeDirectory/activityTemplate/activityTemplate?pageId=92',
    })
  },
  jumpToUrl: throttle(function (e) {
    if (this.data.noLook) {
      app.userType()
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  }),
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    let page = +this.data.page + 1
    this.getGoodsList(page)

  },

  linshi() {
    wx.navigateTo({
      url: '/pages/self/shareSignIn/shareSignIn'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '采最正的品，卖最火的货',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})