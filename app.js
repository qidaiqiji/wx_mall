import api from './utils/api.js';
const {
  getuser,
  autoLogin,
  xcxAdAddClick,
} = api
const {
  $Toast
} = require('/dist/base/index');
App({
  onLaunch: function (options) {
    //检查是否存在新版本
    wx.getUpdateManager().onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("是否有新版本：" + res.hasUpdate);
      if (res.hasUpdate) { //如果有新版本
        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateReady(function () { //当新版本下载完成，会进行回调
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，单击确定重启应用',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                wx.getUpdateManager().applyUpdate();
              }
            }
          })
        })
        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateFailed(function () { //当新版本下载失败，会进行回调
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但下载失败，请检查网络设置',
            showCancel: false,
          })
        })
      }
    });
    // 屏幕高度
    wx.getSystemInfo({
      success: (res) => {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        console.log(calc, 'calc', res.windowHeight, res.screenHeight, res.screenHeight * (750 / res.screenWidth))
        this.globalData.phoneScreenHeight = calc;
        this.globalData.appHeight = calc;
        this.globalData.screenHeight = res.screenHeight * (750 / res.screenWidth);
        this.globalData.system = res.system.replace(/[^a-zA-Z]/g, '');
      }
    });
  },
  handleJumpToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 200,
    })
  },
  debounce(func, wait, immediate) {
    if (wait == null || wait == undefined) {
      wait = 1000
    }
    let timeout;
    return function () {
      let context = this;
      let args = arguments;
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        let callNow = !timeout;
        timeout = setTimeout(() => {
          timeout = null;
        }, wait)
        if (callNow) func.apply(context, args)
      } else {
        timeout = setTimeout(() => {
          func.apply(context, args)
        }, wait);
      }
    }
  },
  throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
      gapTime = 1000
    }
    let _lastTime = null
    // 返回新的函数
    return function () {
      let _nowTime = +new Date()
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
        fn.apply(this, arguments) //将this和传递给原函数
        _lastTime = _nowTime
      }
    }
  },
  // 切分价格
  segmentationPrice(element) {
    var objectPrice = {};
    objectPrice.numInt = element.split('.')[0];
    objectPrice.decimal = element.split('.')[1];
    if(!objectPrice.decimal){
      objectPrice.decimal = '00'
    }
    return objectPrice
  },
  scrollRolling(that, scrollTop) {
    let phoneScreenHeight = this.globalData.phoneScreenHeight / 2;
    that.setData({
      toTheTop: scrollTop > phoneScreenHeight ? true : false
    })
  },
  onTotalCount(totalCount, location) {
    var totalNum = ""
    if (location == 3) {
      this.globalData.totalCount = String(totalCount);
      if (String(totalCount) >= 100) {
        totalNum = '...'
      } else {
        totalNum = String(totalCount)
      };
      if (totalNum != 0) {
        wx.setTabBarBadge({
          index: location,
          text: totalNum, //可改 
        });
      } else {
        wx.removeTabBarBadge({
          index: location,
        });
      }

    } else if (location == 2) {
      if (totalCount > 0) {
        wx.showTabBarRedDot({
          index: 2,
        })
      } else {
        wx.hideTabBarRedDot({
          index: 2,
        })
      }

    }

  },
  //将数组每多个分成一组
  rewriteArrs(that, arr, names,numb) {
    let newImgs = arr.reduce((prev, item, index) => {
      prev[index] = arr.slice(index, index + numb)
      if (prev[index].length < numb) {
        prev.pop(prev[index])
      }
      return prev
    }, [])
    that.setData({
      [names]: newImgs.filter(item => item)
    })
  },
  appProduct(goodsId) {
    wx.navigateTo({
      url: '/pages/goods/product/product?goodsId=' + goodsId,
    })
  },
  onShow(options) {
    wx.onMemoryWarning(function () {
      console.log('onMemoryWarningReceive')
    })

    if (options.path == 'pages/self/shareSignIn/shareSignIn' || options.path == 'pages/index/index' || options.path == 'pages/usable/usable' || options.path == 'pages/login/login') {
      return false
    } else {
      this.getUserINfoFun()
    }

  },
  globalData: {

    goNewPages: false,
    system: '',
    foundNumber: '',
    shengfen: null,
    userInfo: {
      version: ''
    },
    imgHead: 'https://img.xiaomei360.com/wechat_xiaochengxu/',
    totalCount: "0",
    totalCountTwo: '0',
    phoneScreenHeight: 1000,
    appHeight: '',
    reload: false,
    promise: null,
    screenHeight: '',
    menus: [],
    isActTime: false,
    isInActivity:false,
    screenHeight: '',
  },
  onevokeAddCart(that, e) {
    that.setData({
      ...e.detail
    })
    if (e.isPopCart || that.data.isPopCart) {
      console.log('jiaziaiaai', that.selectComponent("#addCart"))

      that.selectComponent("#addCart").showModal();

    };
  },
  onhideCart(that, e) {
    that.setData({
      isPopCart: false
    }, () => {
      if (e.detail && e.detail.msg) {
        this.onToast(e.detail.msg)
      }
    })
  },
  onToast(data) {
    $Toast({
      content: data
    });
  },
  getUserINfoFun() {
    getuser().then(res => {
console.log(res.data)
      this.globalData.userInfo = res.data;
      let userInfo = res.data
      wx.setStorageSync('Authorization', res.data.access_token)
      wx.setStorageSync('is_checked', res.data.is_checked)
      wx.setStorageSync('provinceId', res.data.provinceId)
      wx.setStorageSync('isActTime', res.data.isActTime)
      wx.setStorageSync('isInActivity', res.data.isInActivity)
      wx.setStorageSync('menus', res.data.actMenu)

      if (wx.getStorageSync('NotNetWork')) {
        return false
      }
      if (userInfo.provinceId > 0) {
        if (userInfo.is_checked == 0) {
          wx.redirectTo({
            url: '/pages/usableno/usableno',
          })
        } else if (userInfo.is_checked == 1) {
          wx.redirectTo({
            url: '/pages/usableno/usableno',
          })
        } else if (userInfo.is_checked == 3) {
          wx.redirectTo({
            url: '../login/login?bad=1'
          })
        } else if (userInfo.is_checked == 4) {
          wx.redirectTo({
            url: '/pages/usable/usable',
          })
        }
      } else if (userInfo.provinceId == 0) {
        wx.redirectTo({
          url: '/pages/provinceSelect/provinceSelect'
        })
      }
    }).catch(res => {
      wx.login({
        success: (val) => {
          autoLogin({
            code: val.code
          }).then(res => {
            console.log(res.code, '报错时触发')
            if (res.code == 0) {
              wx.setStorageSync('isActTime', res.data.isActTime)
              wx.setStorageSync('isInActivity', res.data.isInActivity)
              wx.setStorageSync('menus', res.data.actMenu)
              wx.setStorageSync('Authorization', res.data.access_token)
              wx.setStorageSync('is_checked', res.data.is_checked)
              wx.setStorageSync('provinceId', res.data.provinceId)
              console.log(this.globalData)
            } else if (res.code == 1) {
              wx.redirectTo({
                url: '/pages/login/login'
              })
            }
          })
        }
      })

    })
  },
  //用户审核 状态
  userType() {
    if (!wx.getStorageSync('Authorization')) {
      wx.login({
        success: (val) => {
          autoLogin({
            code: val.code
          }).then(res => {
            if (res.code == 0) {
              wx.setStorageSync('isInActivity', res.data.isInActivity)
              wx.setStorageSync('Authorization', res.data.access_token)
              wx.setStorageSync('is_checked', res.data.is_checked)
              wx.setStorageSync('provinceId', res.data.provinceId)
              this.getUserINfoFun()
            } else if (res.code == 1) {
              wx.redirectTo({
                url: '/pages/login/login'
              })
            }
          })
        }
      })
      return false
    } else {
      this.getUserINfoFun()
    }
  },
  jumpToIsChecked() {
    console.log(wx.getStorageSync('is_checked'), "  wx.getStorageSync('is_checked')")
    console.log(wx.getStorageSync('noLogin'), "wx.getStorageSync('noLogin')")
    console.log(wx.getStorageSync('NotNetWork'), "wx.getStorageSync('NotNetWork')")
    if (wx.getStorageSync('NotNetWork')) {
      return false
    }
    if (wx.getStorageSync('noLogin')) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return false
    }
    if (wx.getStorageSync('is_checked') == 0) {
      wx.redirectTo({
        url: '/pages/usableno/usableno',
        success: () => {
          var pages = getCurrentPages() //获取加载的页
          let allRoute = pages && pages.map(item => item.route)
          let importantArr = ['pages/usableno/usableno']
        }
      })
    } else if (wx.getStorageSync('is_checked') == 1) {
      wx.redirectTo({
        url: '/pages/usableno/usableno',
      })
    } else if (wx.getStorageSync('is_checked') == 3) {
      wx.redirectTo({
        url: '../login/login?bad=1'
      })
    } else if (wx.getStorageSync('is_checked') == 4) {
      wx.redirectTo({
        url: '/pages/usable/usable',
      })
    }
  },
  // 广告位跳转
  adSpaceJump(item) {
    console.log(item, '判断广告位有无id');
    // 判断广告位有无id
    if (item.id) {
      xcxAdAddClick({
        id: item.id
      }).catch(err => {
        console.log(err)
      })
    }
    wx.navigateTo({
      url: item.url
    })
  },
  onShareAppMessage: function (res) {

    if (res.from === 'button') {
      // 来自页面内转发按钮
    } else {
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
      };
    };
  },
  _useWXNavBack(allRoute, path) {
    console.log(allRoute, path)
    wx.navigateBack({
      delta: allRoute.length - allRoute.indexOf(path) - 1
    })
  },
  _useWXNavTo(intoPath) {
    wx.navigateTo({
      url: '/' + intoPath
    })
  },
  handleNavMenu(initIsPageId = '', that, index) {
    console.log(initIsPageId,'app',index)
    let menus = wx.getStorageSync('menus')
    var pages = getCurrentPages(); // 获取页面栈
    var prevPage = pages[pages.length - 2] && pages[pages.length - 2];
    var allRoute = pages.map(item => item.route)

    let intoPath = menus[index].pageId
    let fullPath = intoPath && intoPath.split('?')
    let path = fullPath[0]
    let params = fullPath[1] ? fullPath[1] : ''
    if (initIsPageId == menus[index].pageId) {
      return false
    }
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0,
    })
    console.log(params)
    if (params.indexOf('title') >= 0) {
      if (allRoute.includes(path)) {
        if (allRoute.length - allRoute.indexOf(path) == 1) {
          that.setData({
            title: params.split('=')[1],
          }, () => {
            that.onShow()
          })
        } else {
          prevPage.setData({
            title: params.split('=')[1],
          })
          this._useWXNavBack(allRoute, path)
        }
      } else {
        this._useWXNavTo(intoPath)
      }
    } else if (params.indexOf('type') >= 0) {
      console.log(params,'+++有type')
      wx.pageScrollTo({
        scrollTop: that.data.temaiScrollTop,
        duration: 0
      })
      if (menus[index].pageId.indexOf(initIsPageId) >= 0) {
       
        that.setData({
          type: 'temai',
          isPageId: 'pages/activity/activity?type=temai'
        })
        return false
      }
      if (allRoute.includes(path)) {
        console.log(params,'++11++')
        prevPage.setData({
          type: 'temai'
        })
        this._useWXNavBack(allRoute, path)
      } else {
        console.log(params,'++112++')
        this._useWXNavTo(intoPath)
      }
    } else {
      console.log(allRoute)
      if (initIsPageId.indexOf(menus[index].pageId) >= 0) {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
        that.setData({
          type: '',
          isPageId: menus[index].pageId
        })
        return false
      }
      if (allRoute.includes(path)) {
        prevPage && prevPage.setData({
          type: ''
        })
        this._useWXNavBack(allRoute, path)
      } else {
        this._useWXNavTo(intoPath)
      }
      return false
    }
  }
})