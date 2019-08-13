import base64 from './base64.js'
import config from '../config.js'
import Fly from "./index.js"
const {
  encode
} = base64
const fly = new Fly();
fly.config.baseURL = config.url
fly.config.timeout = 15000;


// 请求拦截器
fly.interceptors.request.use(function(request) {
  wx.getNetworkType({
    success: function(res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType
      // console.log(networkType)
      if (networkType == 'none') {
        // console.log('无网络了')
        wx.setStorageSync('NotNetWork', true)
        return false
      } else {
        if (wx.getStorageSync('NotNetWork')) {
          wx.setStorageSync('NotNetWork', false)
        } else {
          return false
        }
      }
    }
  })
  // console.log(request, '请求数据名称')
  if (request.url == 'v2/user/get-sms-check-no' || request.url == 'v2/user/register' || request.url == 'v2/user/login-with-code' || request.url == 'v2/index/ads') {
    return request
  } else {

    if(request.url =='v2/index/index'){
      // console.log(request,'首页信息')
      if(request.body == 'isToken=true'){
        // console.log('进入了')
        if(wx.getStorageSync('Authorization')){
          request.headers = { //设置请求头
            "content-type": "application/json",
            "Authorization": `Basic ${encode(wx.getStorageSync('Authorization') + ':')}`,
          }
          return request
        }else{
          return request
        }

      }else{
        // console.log('没有成功')
        return request
      }
    }
    if (request.params == 'haveModel') {
      wx.showLoading({
        title: "加载中",
        mask: true,
      });

    } else if (request.params == 'haveLoading') {
      wx.showNavigationBarLoading();
    }
    if (wx.getStorageSync('Authorization')) { //检查本地缓存是否有token存在没有则重新获取
      request.headers = { //设置请求头
        "content-type": "application/json",
        "Authorization": `Basic ${encode(wx.getStorageSync('Authorization') + ':')}`,
      }
      // console.log(request, '这里测试运行')
      if (wx.getStorageSync('is_checked') != 2) {
        // console.log(request, '请求数据名称1')
        fly.lock()
        wx.login({
          success: (val) => {
            // console.log('登录请求成功,走了token', val)
            // console.log(request, '请求数据名称2')
            return wx.request({
              url: config.url+'v2/user/login-with-code',
              data: {
                code: val.code
              },
              method: 'POST',
              success: (data) => {
                let res = data.data
                // console.log('这里在成功时运行')
                wx.setStorageSync('Authorization', res.data.access_token)
                wx.setStorageSync('is_checked', res.data.is_checked)
                wx.setStorageSync('provinceId', res.data.provinceId)
                wx.setStorageSync('isActTime', res.data.isActTime)
                wx.setStorageSync('menus', res.data.actMenu)
                wx.setStorageSync('noLogin', true)
                // console.log('这里zuili面得运行')
                fly.unlock();
                return request;
                // console.log('这里结束')
              }
            })
          }
        })
        //等待token返回之后在解锁，
      } else {
        return request;
      }
    } else {
      if (request.url == 'v2/goods/list'){
        // console.log('请求了商品列表',request)
          return request
      }
      fly.lock()
      wx.login({
        success: (val) => {
          // console.log('登录请求成功,走了没有token', val)
          return wx.request({
            url: config.url+'v2/user/login-with-code',
            data: {
              code: val.code
            },
            method: 'POST',
            success: (data) => {
              let res = data.data
              // console.log(res)
              wx.setStorageSync('noLogin', true)
              if (res.code == 0) {
                request.headers = { //设置请求头
                  "content-type": "application/json",
                  "Authorization": `Basic ${encode(res.data.access_token + ':')}`,
                }
                wx.setStorageSync('Authorization', res.data.access_token)
                wx.setStorageSync('is_checked', res.data.is_checked)
                wx.setStorageSync('provinceId', res.data.provinceId)
                wx.setStorageSync('isActTime', res.data.isActTime)
                wx.setStorageSync('menus', res.data.actMenu)
                wx.setStorageSync('noLogin', false)
              }
              //等待token返回之后在解锁，
              fly.unlock();
              return request;

            }


          })
        }
      })
    }
  }
})
// 响应拦截器
fly.interceptors.response.use(
  response => {
    // console.log(response)
    // console.log('返回的路径', response.request.url, response.data)
    if (response.status && ("" + response.status).startsWith('2')) {
      // console.log('response.data', response.data)
      if (response.request.params == 'haveLoading') {
        wx.hideNavigationBarLoading();
      }
      wx.hideLoading()
      return response.data
    }
  },
  err => { // 响应错误
    // console.log("错误", err)

    if (err.status == 0) {
      if (wx.getStorageSync('NotNetWork')) {
        // wx.showLoading({
        //   title: "请连接网络···",
        // });
        wx.showToast({
          icon: 'none',
          title: "无网络，请检查网络设置",
          duration: 5000
        })
      }
    } else {
      wx.hideLoading()
    }
    if (err.status == 1) {
      // console.log('请求超时')
    }
    if (err.status == 401 && err.request.url !== 'v2/user/info') {
      // wx.setStorageSync('Authorization','')
      // const autoLogin = params => fly.post('v2/user/login-with-code', params);
      //   wx.login({
      //     success: (val) => {
      //       console.log('登录请求成功', val)
      //       autoLogin({
      //         code: val.code
      //       }).then(res => {
      //         console.log(res, res.code)
      //         if (res.code == 0) {
      //           wx.setStorageSync('Authorization', res.data.access_token)
      //           console.log('参数6', res.data, res.data.is_checked)
      //           if (res.data.is_checked == 0) {
      //             wx.navigateTo({
      //               url: '/pages/usableno/usableno',
      //             })
      //           } else if (res.data.is_checked == 1) {
      //             wx.navigateTo({
      //               url: '/pages/usableno/usableno',
      //             })
      //           } else if (res.data.is_checked == 3) {
      //             wx.navigateTo({
      //               url: '/pages/login/login?bad=1'
      //             })
      //           } else if (res.data.is_checked == 4) {
      //             wx.navigateTo({
      //               url: '/pages/usable/usable',
      //             })
      //           } else if (res.data.is_checked == 2){
      //             getCurrentPages()[getCurrentPages().length - 1].onLoad()
      //           }
      //         } else {
      //           return false
      //         }
      //       }).catch(res => {
      //         return false;
      //       })
      //     }
      //   })


    } else if (err.status !== 401 && err.request.url !== 'v2/user/info') {
      wx.showModal({
        title: '错误',
        content: err.response && err.response.data && err.response.data.message,
      })
    }
  }
)
export default fly