// pages/foundTxt/foundTxt.js
import base64 from '../../utils/base64.js'
const {
  decode
} = base64
import api from '../../utils/api.js'
const {
  foundContent,
  foundAdviceList,
  foundCollect,
  foundCancleCollect,
} = api
var WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp();
const throttle = app.throttle;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    optional: true,
    isNoFoundTxt: true,
    toTheTop: false,
    isScroll: false,
    isVideoTop: '',
    reacquire: true,
    isLoading: false,
    title: '',
    readcount: '',
    publshtime: '',
    content: '',
    foundUpNew: false, //上拉刷新后显示的文字
    updateContent: '暂无更新，看看别的内容吧',
    page: 1,
    pageSize: 10,
    isObject: {},
    mode: {},
    foundList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      articleid: options.articleId,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  jumpToDetail: throttle(function (e) {
    wx.navigateTo({
      url: '/pages/foundTxt/foundTxt?articleId=' + e.currentTarget.dataset.articleid,
    })


  }),
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.reacquire) {
      this.istitle();
      this.isFoundAdviceList(this.data.articleid, this.data.page, this.data.pageSize)
    }


  },
  ontoUpImgs() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 200,
    })
  },
  // 去采购
  canShu(e) {
    var foundgoods = e.currentTarget.dataset.foundgoods
    var goodsId = e.currentTarget.dataset.goodsId
    this.setData({
      foundgoods,
      foundParameterShow: true,
      modal: 'modal'
    }, () => {
      this.selectComponent("#foundParameter").showModal();
    });

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
  onFoundParameter() {
    this.setData({
      foundParameterShow: false,
      modal: ''
    })
  },
  onhideCart(options) {
    this.setData({
      isPopCart: false
    })
    var e = {
      isPopCart: false
    };
    this.setData({
      isTotalCount: app.globalData.totalCount
    })
    var that = this
    app.onhideCart(that, e);
    // 弹窗
    if (options.detail) {
      this.tap(options.detail.msg)
    }
  },
  tap(e) {
    var child = this.selectComponent('#premind');
    child.remind(e);
    console.log(child.remind(e))
  },
  isFoundAdviceList(articleId, page, pageSize) {
    foundAdviceList({
      articleId: articleId,
      page: page,
      pageSize: pageSize
    }).then((res) => {
      var foundList = [].concat(...this.data.foundList, ...res.data.foundList);
      foundList.forEach(element => {
        // 图片设置
        if (element.imgs && element.imgs.length == 1) {
          var rW = element.firstImgWidth, //获取图片真实宽度
            rH = element.firstImgHigh
          if (+rH > 374 && +rH > +rW) {

            element.firstImgHigh = Math.round(rH / Math.round(rH / 374))
            element.firstImgWidth = Math.round(rW / Math.round(rH / 374))
          } else if (+rH > 374 && +rH == +rW) {
            element.firstImgHigh = Math.round(rH / Math.round(rH / 374))
            element.firstImgWidth = Math.round(rW / Math.round(rH / 374))
          } else if (+rW > 500 && +rW >= +rH) {
            element.firstImgHigh = Math.round(rH / Math.ceil(rW / 500))
            element.firstImgWidth = Math.round(rW / Math.ceil(rW / 500))
          }
        }
      });
      this.setData({
        page: page + 1,
        ...res.data,
        foundList,
        isLoading: this.data.page == 2 ? false : res.data.foundList.length > 9 ? true : false,
        reacquire: false
      })
    })
  },
  // 转发
  zhuanfa(e) {
    wx.navigateTo({
      url: '/pages/shareRecommended/shareRecommended?relayImgThumb=' + e.currentTarget.dataset.relayimgthumb + '&relayImg=' + e.currentTarget.dataset.relayimg,
    })
  },
  // 收藏
  collection(e) {
    var isCollect = e.currentTarget.dataset.iscollect;
    var articleId = e.currentTarget.dataset.articleid;
    var istop = e.currentTarget.dataset.istop
    // 判断是不是取消 1收藏 0未收藏
    if (isCollect == 0) {
      foundCollect({
        articleId
      }).then((res) => {
        this.isCollection(res.msg, articleId, 1, istop)
      })
    } else if (isCollect == 1) {
      foundCancleCollect({
        articleId
      }).then((res) => {
        this.isCollection(res.msg, articleId, 0, istop)

      })
    }
  },
  isCollection(msg, articleId, isCollect, istop) {
    app.onToast(msg);
    var foundList = this.data.foundList;
    if (istop == 'istop') {
      var mode = this.data.mode
      mode.isCollect = isCollect
      this.setData({
        mode,
      })
    } else {
      foundList.forEach(element => {
        if (element.articleId == articleId) {
          element.isCollect = isCollect
        }
      });
      this.setData({
        foundList,
      })
    }

  },
  // 点击进详情
  istitle() {
    foundContent({
      articleId: this.data.articleid
    }).then(res => {
      res.data.isPlay = false;
      // 图片设置
      if (res.data.imgs && res.data.imgs.length == 1) {
        var rW = res.data.firstImgWidth, //获取图片真实宽度
          rH = res.data.firstImgHigh
        if (+rH > 374 && +rH > +rW) {

          res.data.firstImgHigh = Math.round(rH / Math.round(rH / 374))
          res.data.firstImgWidth = Math.round(rW / Math.round(rH / 374))
        } else if (+rH > 374 && +rH == +rW) {
          res.data.firstImgHigh = Math.round(rH / Math.round(rH / 374))
          res.data.firstImgWidth = Math.round(rW / Math.round(rH / 374))
        } else if (+rW > 500 && +rW >= +rH) {
          res.data.firstImgHigh = Math.round(rH / Math.ceil(rW / 500))
          res.data.firstImgWidth = Math.round(rW / Math.ceil(rW / 500))
        }
      }
      this.setData({
        mode: res.data
      }, () => {
        var article = this.data.mode.content
        WxParse.wxParse('article', 'html', article, this, 5);
      })
    })
  },
  longTap(e) {
    var isTitle = e.currentTarget.dataset.title
    wx.setClipboardData({
      data: isTitle,
      success: function (res) {
      }
    });
  },
  // 图片放大保存
  isMaxShow(e) {
    var img = e.currentTarget.dataset.img || '';
    var imgs = e.currentTarget.dataset.imgs || [];
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  // 点击播放
  topOnStartPlay() {
    var mode = this.data.mode
    mode.isPlay = true
    this.setData({
      mode,
    })
    const query = wx.createSelectorQuery();
    query.select('#topVideo').boundingClientRect();
    query.exec((res) => {
      var isVideoTop = {};
      isVideoTop.top = res[0] && res[0].top;
      isVideoTop.bottom = res[0] && res[0].bottom;
      this.setData({
        isVideoTop, // #the-id节点的上边界坐标 
      })
    });
  },
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
    })
  },
  move() {
    return false;
  },
  // 进入全屏
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
  // 播放结束
  videoEnd(e) {
    var isVideoTop = e.currentTarget.isVideoTop ? e.currentTarget.isVideoTop : ''
    if (this.data.system == 'iOS') {
      var videpId = e.currentTarget.id
      var videoContext = wx.createVideoContext(videpId, this);
      videoContext.exitFullScreen();
      return false
    } else {

      if (isVideoTop == 'isVideoTop') {
        var mode = this.data.mode;
        this.setData({
          mode: mode.isPlay = false
        })
      } else {
        var foundList = this.data.foundList
        foundList.forEach((item, index) => {
          item.isPlay = false
        })
        this.setData({
          foundList,
        });
      }

    }

    var foundList = this.data.foundList
    foundList.forEach((item, index) => {
      item.isPlay = false
    })
    this.setData({
      foundList,
    });
  },
  // 小喇叭跳转
  guideLink: throttle(function (e) {
    var url = e.currentTarget.dataset.guidelink;
    wx.navigateTo({
      url: url,
    })

  }),
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
  longTap(e) {
    console.log('+++++++++++++++++');
    var isTitle = e.currentTarget.dataset.title
    wx.setClipboardData({
      data: isTitle,
      success: function (res) {
      }
    });
  },
  mytouchend() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 详情最多请求20个，每页10个
    if (this.data.page < 3) {
      this.setData({
        reacquire: true
      }, () => {
        this.isFoundAdviceList(this.data.articleid, this.data.page, this.data.pageSize);
      })

    }

  },
  onPageScroll(e) {
    var that = this;
    app.scrollRolling(that, e.scrollTop);
    if (e.scrollTop > this.data.isVideoTop.bottom) {
      var mode = this.data.mode;
      mode.isPlay = false
      this.setData({
        mode,
      })
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})