// pages/self/shareSignIn/shareSignIn.js
const {
  $Toast
} = require('../../../dist/base/index');

import api from '../../../utils/api.js'
const {
  getreg,
  getshort,
  userInviteAd,
} = api
const app = getApp();
const throttle = app.throttle;
Page({
  data: {
    x: '',
    iskind: '',
    urll: '',
    usernumber: '',
    usercode: '',
    code: '',
    num: 0,
    ms: '#FFAEC2',
    mss: '#FFAEC2',
    hide: 1,
    requestLock: false,
    kind: '',
    recommand_id: '',
    windowHeight: '',
    recommandId: '',
  },
  onLoad: function (options) {
    console.log(options.userId, 'options')
    const scene = decodeURIComponent(options.scene);
    console.log(scene, 'scene');
    if (scene == 'undefined') {
      this.setData({
        recommandId: options.userId
      })
    } else {
      var splitArr = scene.split('=');
    
      console.log(splitArr)
      this.setData({
        recommandId: splitArr[1]
      })
    }
    console.log(this.data.recommandId, '+5555')
  },
  onShow() {
    userInviteAd().then(res => {
      this.setData({
        ...res.data
      })
    })
    var windowHeight = app.globalData.appHeight - 60;
    this.setData({
      windowHeight,
    })
    const imgHead = app.globalData.imgHead
    const version = app.globalData.userInfo.version
    if (this.data.bad) {
      $Toast({
        content: '您的账号异常请联系'
      });
    }
    this.setData({
      img__zhuce_bg: imgHead + 'img__zhuce_bg_2.png?version=' + version,
    })
  },
  // 提示信息
  handlenumber(e) {
    $Toast({
      content: e
    });
  },
  // 获取电话号码
  bindnumder: function (e) {
    this.setData({
      usernumber: e.detail.value
    })
    if (this.data.usercode !== '' && this.data.usernumber !== '') {
      this.setData({
        mss: '#FF3366'
      })
    } else {
      this.setData({
        mss: '#FFAEC2'
      })
    }
  },
  // 获取验证码
  bindcode: function (e) {
    this.setData({
      usercode: e.detail.value
    })
    if (this.data.usercode !== '' && this.data.usernumber !== '') {
      this.setData({
        // 红色
        mss: '#FF3366'
      })
    } else {
      this.setData({
        mss: '#FFAEC2'
      })
    }
  },
  // 点登陆
  loginup: throttle(function (event) {
    if (this.data.bad) {
      $Toast({
        content: '您的账号异常无法使用'
      });
      return false
    }
    // 手机号为空提醒
    var myreg = /^[1][0-9]{10}$/;
    var myRegTwo = /^[0-9]{6}$/;
    if (this.data.usernumber == '' || !myreg.test(this.data.usernumber)) {
      this.handlenumber('请输入正确的手机号码');
      return false;
    } else if (this.data.usercode == '' || !myRegTwo.test(this.data.usercode)) {
      this.handlenumber('请输入正确的验证码');
      return false;
    }

    //网络请求登录
    if (this.data.usernumber !== '' && this.data.usercode !== '') {
      getreg({
        mobile: this.data.usernumber,
        checkNo: this.data.usercode,
        code: this.data.code,
        recommand_id: this.data.recommandId,
      }).then(res => {
        if (res.code == 1 || res.code == 0) {
          // 登陆成功
          app.globalData.userInfo = res.data;
          wx.setStorageSync('Authorization', res.data.access_token)

          if (+res.data.provinceId > 0) {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          } else {
            wx.reLaunch({
              url: '/pages/provinceSelect/provinceSelect'
            })
          }
        } else if (res.code == 13) {
          $Toast({
            content: res.msg,
            duration: 0,
          });
          setTimeout(() => {
            $Toast.hide();
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }, 4000);
        } else {
          // 登陆失败
          $Toast({
            content: res.msg
          });
        }
        this.setData({
          ...res.data,

        })
      }, function (error) {
        console.log(error);
        $Toast({
          content: '注册失败'
        });
      })
    }
  }, 4000),

  // 滑块事件
  chang(event) {
    // 判断滑块位置
    var myreg = /^[1][0-9]{10}$/;
    if (event.detail.x >= 200) {
      if (myreg.test(this.data.usernumber)) {
        if (this.data.requestLock) {
          return false;
        } else {
          this.setData({
            requestLock: true
          })
          if (!!this.data.requestLock) {
            wx.login({
              success: (res) => {
                this.setData({
                  code: res.code
                })
              }
            })
            // 发送短信

            getshort({
              mobile: this.data.usernumber,
              type: '1'
            }).then(res => {
              this.setData({
                ...res.data,
                requestLock: false
              })
            }).catch(res => {
              this.setData({
                requestLock: true
              })
            })
          }
          //  滑块移动后显示验证码
          setTimeout(() => {
            if (this.data.hide == 1) {
              this.setData({
                hide: 2,
              });
            }

          }, 300);
          setTimeout(() => {
            if (this.data.hide == 2) {
              this.setData({
                hide: 3,
              });
            }

          }, 2000);
          // 倒计时
          this.logintimes();
        }
      } else {
        this.handlenumber('请输入正确的手机号码');
        this.setData({
          x: 0
        });
      }
    } else {
      this.setData({
        x: 0
      });
    }
  },
  code_fn() {
    wx.login({
      success: (res) => {
        this.setData({
          code: res.code
        })
      }
    })
    // 发送短信
    getshort({
      mobile: this.data.usernumber,
      type: '1'
    }).then(res => {
      this.setData({
        ...res.data
      })
    });
    this.logintimes();
  },
  logintimes() {
    clearTimeout(timedown);
    var timedown = setTimeout(() => {
      this.setData({
        num: 60,
        ms: '#FFAEC2'
      });
      var that = this;

      function count(times) {
        var timer = '';
        timer = setInterval(function () {
          var minute = 0;
          var second = 0;
          if (times > 0) {
            second = Math.floor(times) - (minute * 60);
            that.setData({
              ms: '#FFAEC2'
            })
          } else if (times <= 0) {
            clearInterval(timer);
            that.setData({
              ms: '#FF3366'
            })
          }
          times--;
          that.setData({
            num: second
          })
        }, 1000);
      }
      count(59);
    }, 30)
  },
  agreement() {
    wx.navigateTo({
      url: '/pages/aboutCart/agreement/agreement',
    })
  },
  shopIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  handleJumpToRule() {

    this.setData({
      iskind: true
    });
  },
  isShow() {
    this.setData({
      iskind: false
    })
  }
})