// pages/found/found.js
import base64 from '../../utils/base64.js'
import api from '../../utils/api.js';
const {
  encode
} = base64
const {
  foundCategory,
  foundIndex,
  foundRecord,
  foundUnread,
  foundAll,
  foundCollect,
  foundCancleCollect,
} = api
const app = getApp();
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updateContent: '暂无更新，看看别的内容吧',
    pullDownRefresh: false,
    foundUpNew: false, //上拉刷新后显示的文字
    optional: true,
    pageSize: 10,
    page: 1,
    foundIndex: '',
    foundList: [],
    dropDown: true,
    maskLayer: true, //遮罩层
    currentTab: '',
    fullText: '全文',
    packUp: '1', //1 收起 否侧 展开
    isMaxShow: false,
    maxShow: false,
    foundBottom: '1', //下拉加载
    isPopCart: false,
    foundParameterShow: false,
    modal: '',
    foundgoods: [],
    img: '',
    goodsId: '',
    isScroll: false,
    index: "",
    windowHeight: '',
    toTheTop: false,
    system: '',
    isLoading: false,
    reacquire: false,
    isTitleName:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowHeight = app.globalData.appHeight - 98 - 268;
    this.setData({
      windowHeight,
      system: app.globalData.system,
    })

  },
  ismove() {
    return false
  },
  xuanzhuang(e) {
    if (e.detail.fullScreen) {
      console.log('进入');
      this.setData({
        optional: false
      })
    } else {
      console.log('全屏关闭');
      this.setData({
        optional: true,
      })

    }
  },
  whatFoundIndex(tabInx, page, dropDown) {
    if (!this.data.dropDown) {
      return false
    }
    this.setData({
      isLoading: page > 1 ? true : false,
      dropDown: false
    }, () => {
      if (tabInx == '-2') {
        foundAll({
          page,
          pageSize: this.data.pageSize
        }).then(res => {
          if (dropDown) {
            this.downfound(res.data.totalCount);
            this.setData({
              foundList: [],
            }, () => {
              this.dataRefresh(res, page)
            })
          } else {
            this.dataRefresh(res, page)
          }
        })
        return false;
      }
      foundIndex({
        foundId: tabInx,
        page,
        pageSize: this.data.pageSize
      }).then(res => {
        // 是否调用停止下拉刷新
        if (dropDown) {
          this.downfound(res.data.totalCount);
          this.setData({
            foundList: [],
          }, () => {
            this.dataRefresh(res, page)
          })
        } else {
          this.dataRefresh(res, page)
        }
      });
    })

  },
  dataRefresh(res, page) {
    var foundList = [].concat(...this.data.foundList, ...res.data.foundList);
    let foundListAll = foundList.map((item, index) => {
      var date = item.publishTime.substring(0, 10).replace(/\//g, "-"); //截取日期 
      item.isPlay = false;
      item.isDown = false;
      item.publishTime = date;
      // 图片设置
      if (item.imgs && item.imgs.length == 1) {
        var rW = item.firstImgWidth, //获取图片真实宽度
          rH = item.firstImgHigh
        if (+rH > 374 && +rH > +rW) {

          item.firstImgHigh = Math.round(rH / Math.round(rH / 374))
          item.firstImgWidth = Math.round(rW / Math.round(rH / 374))
        } else if (+rH > 374 && +rH == +rW) {
          item.firstImgHigh = Math.round(rH / Math.round(rH / 374))
          item.firstImgWidth = Math.round(rW / Math.round(rH / 374))
        } else if (+rW > 500 && +rW >= +rH) {
          item.firstImgHigh = Math.round(rH / Math.ceil(rW / 500))
          item.firstImgWidth = Math.round(rW / Math.ceil(rW / 500))
        }
      }
      return item
    })
    this.setData({
      page,
      totalCount: res.data.totalCount ? res.data.totalCount : '0',
      isLoading: res.data.foundList.length == this.data.pageSize ? true : false,
      isreachTheBottom: res.data.foundList.length !== this.data.pageSize ? true : false,
      foundList: foundListAll,
      dropDown: res.data.foundList.length == this.data.pageSize ? true : false,
    });
  },

  changanfuzhi() {
    wx.setClipboardData({
      data: 'data',
      success(res) {
        wx.getClipboardData({
          success(res) {
          }
        })
      }
    })
  },
  // 收藏
  collection(e) {
    var isCollect = e.currentTarget.dataset.iscollect;
    var articleId = e.currentTarget.dataset.articleid;
    // 判断是不是取消 1收藏 0未收藏
    if (isCollect == 0) {
      foundCollect({
        articleId
      }).then((res) => {
        this.isCollection(res.msg, articleId, 1)
      })
    } else if (isCollect == 1) {
      foundCancleCollect({
        articleId
      }).then((res) => {
        this.isCollection(res.msg, articleId, 0)

      })
    }
  },
  isCollection(msg, articleId, isCollect) {
    app.onToast(msg);
    var foundList = this.data.foundList;
    foundList.forEach(element => {
      if (element.articleId == articleId) {
        element.isCollect = isCollect
      }
    });
    this.setData({
      foundList,
    })
  },

  // 转发
  zhuanfa: throttle(function (e) {
    wx.navigateTo({
      url: '/pages/shareRecommended/shareRecommended?relayImgThumb=' + e.currentTarget.dataset.relayimgthumb + '&relayImg=' + e.currentTarget.dataset.relayimg,
    })
  }),
  // 下拉刷新后的操作
  downfound(totalCount) {

    clearTimeout(issetTimeout);
    //停止下拉刷新
    wx.stopPullDownRefresh({
      success: () => {
      }
    })
    // 停止后判断红点是否显示和下拉提示
    if (this.data.pullDownRefresh) {
      if (totalCount == this.data.totalCount) {
        this.setData({
          totalCount: totalCount,
          foundUpNew: true
        })
      } else {
        this.setData({
          foundUpNew: true,
          updateContent: '为你推荐一组新内容'
        })
      };
    }
    var issetTimeout = setTimeout(() => {
      this.setData({
        foundUpNew: false,
        pullDownRefresh: false
      })
    }, 2000)
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
    if (app.globalData.goNewPages) {
      this.isAllList()
    }
    var foundIndex = '';
    if (!this.data.reacquire) {
      foundRecord({}).then(res => {
        this.setData({
          reacquire: true
        })
      }).catch(fail => {
        this.setData({
          reacquire: false
        })
      });
      foundUnread({}).then(res => {
        this.setData({
          reacquire: true
        })
        app.onTotalCount(res.data.unreadCount, 2);
      }).catch(fail => {
        this.setData({
          reacquire: false
        })
      });
      // 请求全部
      this.isAllList()
    }
    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
  },
  // 请求全部
  isAllList() {
    foundCategory().then(res => {
      res.data.foundCategories.unshift({
        foundId: '-2',
        foundName: '全部'
      })
      var foundIndex = res.data.foundCategories[0].foundId || res.data.foundCategories[0].foundId
      // res.data.foundCategories.forEach((item) => {
      //   console.log(item);
      //   if (item.foundName == '新品') {
      //     foundIndex = item.foundId
      //   }
      // })
      this.setData({
        ...res.data,
        foundIndex,
        currentTab: foundIndex,
        foundList: [],
        reacquire: true
      }, () => {
        app.globalData.goNewPages = false
        let page = 1
        this.whatFoundIndex(foundIndex, page);
      });

    }).catch(fail => {
      app.globalData.goNewPages = false
      this.setData({
        reacquire: false
      })
    });
  },
  currentTab(e) {
   
    var isTitleName= e.currentTarget.dataset.istitle;
    console.log(isTitleName,'e.currentTarget.dataset',e.currentTarget.dataset.foundid)
    var currentTab = e.currentTarget.dataset.foundid;
    var foundId = e.currentTarget.dataset.foundid;
    this.setData({
      isTitleName,
    })
    if (currentTab == this.data.currentTab) {
      return false;
    } else {
      this.setData({
        currentTab,
        foundIndex: foundId,
        dropDown: true,
        isreachTheBottom: false,
        foundList: [],
      }, () => {
        console.log(this.data.isTitleName,'e.currentTarget.dataset')
        let page = 1
        this.whatFoundIndex(foundId, page);
      })
    }


  },
  isDown(e) {

    var index = e.currentTarget.dataset.index;
    this.data.foundList[index].isDown = !this.data.foundList[index].isDown;
    this.setData({
      foundList: this.data.foundList,
    });
  },
  isproduce: throttle(function () {
    wx.navigateTo({
      url: '/pages/goods/product/product?goodsId=' + e.currentTarget.dataset.goodsid,
      success: () => {
        this.setData({
          isLock: false
        })
      }
    })
  }),
  ontoUpImgs() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 200,
    })
  },
  isMaxShow(e) {

    var img = e.currentTarget.dataset.img || '';
    var imgs = e.currentTarget.dataset.imgs || [];
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  canShu(e) {
    var foundgoods = e.currentTarget.dataset.foundgoods
    var goodsId = e.currentTarget.dataset.goodsId
    this.setData({
      foundgoods,
      foundParameterShow: true,
      modal: 'modal'
    });
    this.selectComponent("#foundParameter").showModal();
  },
  onFoundParameter() {
    this.setData({
      foundParameterShow: false,
      modal: ''
    })
  },
  // 加入购物车
  onevokeAddCart(e) {
    var goodsList = {
      goodsInfo: ''
    }
    var goodsId = e.detail.goodsId
    goodsList.goodsInfo = e.detail.goodsList;
    this.setData({
      isPopCart: true,
      goodsList,
      goodsId
    })
    var e = {
      isPopCart: true
    };
    var that = this
    app.onevokeAddCart(that, e);
  },
  onhideCart(options) {
    this.setData({
      isPopCart: false
    })
    var e = {
      isPopCart: false
    };
    this.setData({
      totalCount: app.globalData.totalCount
    })
    var that = this
    app.onhideCart(that, e);
    // 弹窗
    if (options.detail) {
      this.tap(options.detail.msg)
    }
  },
  istitle: throttle(function (e) {
    var brandId = e.currentTarget.dataset.brandid;
    if (brandId) {
      wx.navigateTo({
        url: '/pages/goods/brandDetail/brandDetail?brandId=' + brandId,
      })
    } else {
      return false;
    }
  }),
  jumpToDetail: throttle(function (e) {
    wx.navigateTo({
      url: '/pages/foundTxt/foundTxt?articleId=' + e.currentTarget.dataset.articleid,
    })
  }),
  guideLink: throttle(function (e) {
    var url = e.currentTarget.dataset.guidelink;

    wx.navigateTo({
      url: url,
    })

  }),
  tap(e) {
    var child = this.selectComponent('#premind');
    child.remind(e);
    console.log(child.remind(e))
  },
  // 点击播放
  onStartPlay(e) {
    var index = e.currentTarget.dataset.index
    this.data.foundList.forEach(n => {
      n.isPlay = false;
    })
    this.data.foundList[index].isPlay = true;
    this.setData({
      foundList: this.data.foundList,
      index,
      isScroll: true
    });
  },
  onPageScroll(e) {
    // 判断回到顶部是否显示
    if (this.data.optional) {

      if (e.scrollTop > app.globalData.phoneScreenHeight) {
        this.setData({
          toTheTop: true
        })
      } else {
        this.setData({
          toTheTop: false
        })
      }
      if (this.data.isScroll) {
        setTimeout(() => {

          //创建节点选择器
          var video = '.video-' + this.data.index;
          const query = wx.createSelectorQuery()
          //选择节点
          query.select(video).boundingClientRect()
          query.exec(res => {
            if (res[0].top && res[0].top < 44) {
              this.data.foundList[this.data.index].isPlay = false;
              this.setData({
                foundList: this.data.foundList,
                isScroll: false
              })
            };
            if (res[0].top && res[0].top > this.data.windowHeight) {
              this.data.foundList[this.data.index].isPlay = false;
              this.setData({
                foundList: this.data.foundList,
                isScroll: false
              })
            }
          })

        }, 80);
      }
    } else {
      return false
    }
  },
  changeList() {

  },
  videoEnd(e) {

    if (this.data.system == 'iOS') {
      var videpId = e.currentTarget.id
      var videoContext = wx.createVideoContext(videpId, this);
      videoContext.exitFullScreen();
      return false
    } else {
      var foundList = this.data.foundList
      foundList.forEach((item, index) => {
        item.isPlay = false
      })
      this.setData({
        foundList,
      });
    }
  },
  move() {
    return false;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.canShu()
    var foundParameterHide = this.selectComponent("#foundParameter");
    var addCartComponentsHide = this.selectComponent("#addCart");
    if (addCartComponentsHide != null) {
      addCartComponentsHide.onConfirm()
    };
    if (this.data.foundParameterShow) {
      foundParameterHide.onConfirm()
    }
    app.onTotalCount(0, 2);
    // wx.setStorageSync('isFound', true)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    // wx.setStorageSync('isFound', true)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      pullDownRefresh: true,
      dropDown: true,
    })
    let dropDown = 'xiala'
    let page = 1
    this.whatFoundIndex(this.data.foundIndex, page, dropDown);
    // }
    // })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    let page = this.data.page + 1
    this.whatFoundIndex(this.data.foundIndex, page)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})