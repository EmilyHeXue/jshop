// pages/login2/login2.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    app.setTheme()
    wx.setNavigationBarTitle({
      title: '登录',
    })
    this.getShopBg()
  },

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
        getApp().login().catch(res => {
          wx.showToast({
            title: '测试',
          })
          this.login(data.detail)
        }).then(res => {
          wx.showToast({
            title: '登录成功',
            icon: 'none'
          })
          wx.navigateBack()
        })
      },
      fail: err => {
        getApp().login().catch(res => {
          wx.showToast({
            title: '测试',
          })
          this.login(data.detail)
        }).then(res => {
          wx.showToast({
            title: '登录成功',
            icon: 'none'
          })
          wx.navigateBack()
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
          getApp().bindGroup()
          wx.navigateBack({})
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },
  getShopBg() {
    getApp().ajax({
      url: 'ShopAppInfo',
      data: {
        key: wx.getStorageSync('shopkey')
      }
    }).then(res => {
      this.setData({
        imgSrc: res.data.pic_url_login || '/images/login/logo.png'
      })
    })
  },
  //获取主题配色
  getThen() {
    wx.request({
      url: `${wx.getStorageSync('url')}shopThemes`,
      data: {
        key: wx.getStorageSync('shopkey')
      },
      success: res => {
        if (res.data.status == 200) {
          wx.setNavigationBarColor({
            frontColor: res.data.data.theme_text == "white" ? "#ffffff" : "#000000",
            backgroundColor: res.data.data.theme
          })
          this.setData({
            text_selection: res.data.data.text_selection,
            bottom_text: res.data.data.bottom_text
          })
          wx.setStorageSync('background', res.data.data.theme)
          wx.setStorageSync('text_selection', res.data.data.text_selection)
          this.triggerEvent('background', { color: res.data.data.theme })
        }
      }
    })
  },
  back () {
    wx.redirectTo({
      url: '/pages/index/index/index',
    })
  }
})