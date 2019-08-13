// pages/classify/classify.js
import api from '../../utils/api.js'
const {
  getclassifylist,
  getbrand,
  paramsUrl,
  categoryAllview,
} = api
const app = getApp()
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandViewHeights: [],
    classifylistTitleScroll: true,
    brandTitleScroll: true,
    headSearchBottom: '',
    viewHeights: '',
    classifylist_title: '',
    classifyLetter: '',
    toTheTop: false,
    ishide: false,
    nodetop: '',
    heights: '',
    toView: '',
    classifylist: '', // 分类列表
    inIndex: 0, //选择下标
    hotBrandList: '', // 品牌
    newBrandList: '', // 品牌
    classifyDetails: '', //// 分类列表详情
    Detailslist: [], // 品牌
    reacquire: false,
    allgroupList: '', //全部分类
    allToView: '', //全部分类切换定位
    isAllgroupList: true //是否获取全部分类
  },
  tap(e) {
    var index = e.currentTarget.dataset.index;
    if (index != 'aa') {
      var classifyLetter = index;
    } else {
      var classifyLetter = '#'
    }
    this.setData({
      toView: 'my-' + index,
      classifyLetter: classifyLetter,
      brandTitleScroll: false,
    });
    var child = this.selectComponent('#premind');
    child.Gardenremind(this.data.classifyLetter);
    // this.classifyLetters();
  },
  classifyLetters() {
    clearTimeout(letters);
    var letters = setTimeout(() => {
      this.setData({
        classifyLetter: '',
      })
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      heights: app.globalData.appHeight - 88
    });

  },
  brandLocation(e) {
    var brandViewHeights = [];
    var viewAll = {};
    var that = this;
    // 品牌
    getbrand({}).then(res => {

      this.setData({
        allToView:'a-0',
        classifylist_title: 'a-0',
        Detailslist: res.data.brandGroup,
        hotBrandList: res.data.hotBrandList,
        newBrandList: res.data.newBrandList,
        reacquire: true
      }, () => {
        const query = wx.createSelectorQuery();
        var listIndex = '#my-';
        Object.getOwnPropertyNames(this.data.Detailslist).forEach((key, index) => {
          query.select(listIndex + (key == '#' ? 'aa' : key)).boundingClientRect();
          query.exec(it => {
            viewAll = {
              viewTop: it[index].top,
              viewBottom: it[index].bottom,
              viewIndex: it[index].id,
            }
            brandViewHeights.push(viewAll);
          })
        });
        this.setData({
          brandViewHeights,
        })
      })
      //创建节点选择器
      const query = wx.createSelectorQuery()
      //选择节点
      query.select('.zhifatop').boundingClientRect()
      // query.select('.letter').boundingClientRect()
      query.exec(function (res) {
        that.setData({
          nodetop: res[0].top - 88 // #the-id节点的上边界坐标
        })

      })
    }).catch(fail => {
      this.setData({
        reacquire: false
      })
    });

  },
  classification(url) {
    paramsUrl(url).then(res => {
      this.setData({
        classifyDetails: res.data.groupList
      })
    })
  },

  // 品牌详情
  brandDetails: throttle(function (e) {
    var goodsId = e.currentTarget.dataset.brandid
    // 跳转详情页
    wx.navigateTo({
      url: '/pages/goods/brandDetail/brandDetail?brandId=' + goodsId,
    })
  }),

  // 分类详情
  classifyDetails: throttle(function (event) {
    var catId = event.currentTarget.dataset.catid
    wx.navigateTo({
      url: '/pages/goods/goodsLists/goodsLists?catId=' + catId,
      success: function (res) {},
      fail: function (error) {
        console.log(error)
      }
    })
  }),
  scroll(e) {
    // 右侧字母显示
    var scrollTop = e.detail.scrollTop + Number(this.data.headSearchBottom);
    var brandViewHeights = this.data.brandViewHeights;
    this.data.brandViewHeights.forEach((item, index) => {
      if (scrollTop >= brandViewHeights[index].viewTop && scrollTop <= brandViewHeights[index].viewBottom) {
        if (this.data.brandTitleScroll) {
          this.setData({
            classifyLetter: brandViewHeights[index].viewIndex.split('-')[1],
            brandTitleScroll: true
          })
        };
        if (this.data.toView == brandViewHeights[index].viewIndex) {
          this.setData({
            brandTitleScroll: true
          })
        }
      }
    });
    if (e.detail.scrollTop >= this.data.nodetop) {
      if (this.data.ishide == false) {
        this.setData({
          ishide: true,
          cycleLetter: Object.keys(this.data.Detailslist)
        });
        const query = wx.createSelectorQuery()
        //选择节点
        // query.select('.zhifatop').boundingClientRect()
        var that = this;
        query.select('.letter').boundingClientRect()
        query.exec(function (res) {
          console.log(res[0].top + 88, '0')
          that.setData({
            startTop: res[0].top - 88 // #the-id节点的上边界坐标
          })

        });
        console.log(this.data.cycleLetter)
      } else {
        return 1
      };
    } else {
      if (this.data.ishide == true) {
        this.setData({
          ishide: false
        });
      } else {
        return 1
      }
    }

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
    //创建节点选择器
    const query = wx.createSelectorQuery()
    //选择节点
    query.select('#wrap_one').boundingClientRect()
    query.exec((res) => {
      this.setData({
        headSearchBottom: res[0].bottom
      })

    })
    if (!this.data.reacquire) {
      // 左边分类列表
      getclassifylist().then(res => {
        this.setData({
          classifylist: res.data.categoryList,
          reacquire: true
        });
        res.data.categoryList.forEach(element => {
          if (element.title == '品牌库') {
            this.brandLocation();
          }
        });
      }).catch(fail => {
        this.setData({
          reacquire: false
        })
      });
    }

    if (wx.getStorageSync('is_checked') !== 2 || !wx.getStorageSync('provinceId')) {
      app.userType()
      return false
    }
    this.onLoad();
  },
  // 获取全部分类
  tapCategoryAllview(titlView) {
    var allToViewEvery = 'a-' + titlView;
    console.log('this.data.allToView=', this.data.allToView, 'allToViewEvery=', allToViewEvery)
    if (this.data.allToView != allToViewEvery) {
      console.log('1this.data.isAllgroupList', this.data.isAllgroupList)
      if (this.data.isAllgroupList) {
        var viewHeights = [];
        var viewAll = {};
        categoryAllview().then(res => {
          this.setData({
            allgroupList: res.data.groupList,
            reacquire: true,
            isAllgroupList: false,
          }, () => {
            this.setData({
              allToView: 'a-' + titlView,
              classifylist_title: 'a-' + titlView
            });

            if (this.data.allgroupList.length > 0) {
              var that = this
              if (this.data.allgroupList.length > 0) {
                this.data.allgroupList.forEach((item, index) => {
                  var index = index + 1
                  var video = '#a-' + index;
                  const query = wx.createSelectorQuery()
                  //选择节点
                  query.select(video).boundingClientRect()
                  query.exec((res) => {
                    viewAll = {
                      viewTop: res[0].top,
                      viewBottom: res[0].bottom,
                      viewIndex: res[0].id,
                    }
                    viewHeights.push(viewAll)
                    this.setData({
                      viewHeights: viewHeights
                    })
                  })
                });

              }
            }
          });
        }).catch(fail => {
          this.setData({
            reacquire: false
          })
        });
      } else {
        this.setData({
          allToView: 'a-' + titlView,
          classifylist_title: 'a-' + titlView,
          isAllgroupList:true,
        });
      }
    }
    console.log('2this.data.isAllgroupList', this.data.isAllgroupList)
  },
  // 点击切换
  tapMove(e) {
    console.log(e,'123455')
    var url = e.currentTarget.dataset.url;
    var title = e.currentTarget.dataset.title;
    var index = e.currentTarget.dataset.index
    if (title == '品牌库') {
      this.brandLocation(url)
    } else {
      this.setData({
        classifylistTitleScroll: false,
        classifyLetter: '',
        ishide: false,
      }, () => {
        this.tapCategoryAllview(index);
      })
    };
  },
  allScroll(e) {
    var scrollTop = e.detail.scrollTop + Number(this.data.headSearchBottom);
    var viewHeights = this.data.viewHeights;
    this.data.allgroupList.forEach((item, index) => {
      if (scrollTop >= viewHeights[index].viewTop && scrollTop <= viewHeights[index].viewBottom) {
        if (this.data.classifylistTitleScroll) {
          this.setData({
            classifylist_title: viewHeights[index].viewIndex,
            classifylistTitleScroll: true
          })
        };
        if (this.data.classifylist_title == viewHeights[index].viewIndex) {
          this.setData({
            classifylistTitleScroll: true
          })
        }
      }
    });

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  ontoUpImgs() {
    app.handleJumpToTop();

  },
  onPageScroll(e) {
    var that = this
    app.scrollRolling(that, e.scrollTop)
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})