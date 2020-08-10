// pages/login/login.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   * show 用于显示登陆栏
  **/
  properties: {
    show:{
      type:Boolean,
      value:true,
    }
  },

  /**
   * 组件的初始数据
   * imgSrc 登陆中间logo
  **/
  data: {
    imgSrc:'/images/login/logo.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取用户信息
     *   先判断session是否过期,
     *   未过期:
     *     拿session去获取jwt
     *   过期:
     *     重新获取code再去获取session后再获取jwt
    **/
    getUserInfo(data) { //获取用户信息
      wx.checkSession({ //判断用户session有没有过期
        success: res => {
          console.log('session', res)
          this.login(data.detail); //获取jwt
        },
        fail: err => {
          wx.login({ //先获取用户code
            success: res => {
              wx.request({ // 发送 res.code 到后台换取 openId, sessionKey, unionId
                url: wx.getStorageSync('url') + 'shopXcxjscode2session',
                method: 'get',
                data: {
                  code: res.code,
                  key: wx.getStorageSync('shopkey')
                },
                success: res => {
                  if (res.data.status == 200) {
                    wx.setStorageSync('session_key', res.data.data.session_key);
                    wx.setStorageSync('openid', res.data.data.openid);
                    this.login(data.detail); //获取jwt
                  } else {
                    wx.showToast({
                      title: res.data.message,
                      icon: 'none'
                    })
                  }
                }
              })
            }
          })
        }
      })

    },
    /**
     * headimg  用户头像
     * jwt  登陆信息
     * nickName 用户名称
    **/
    login(data) { //获取jwt
      let _this = this;
      let res = { //即将发送的参数
        openid: wx.getStorageSync('openid'),
        encryptedData: data.encryptedData,
        sessionKey: wx.getStorageSync('session_key'),
        iv: data.iv,
        signature: data.signature,
        nickName: data.userInfo.nickName,
        gender: data.userInfo.gender,
        language: data.userInfo.language,
        city: data.userInfo.city,
        province: data.userInfo.province,
        avatarUrl: data.userInfo.avatarUrl,
        key: wx.getStorageSync('shopkey'),
        type: 'miniprogram'
      }
      wx.request({
        url: wx.getStorageSync("url") + 'shopXcxLogin',
        method: 'get',
        data: res,
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: res => {
          if (res.data.status == 200) {
            wx.setStorageSync('jwt', res.data.data);
            wx.navigateBack({})
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      })
    }
  }
})
