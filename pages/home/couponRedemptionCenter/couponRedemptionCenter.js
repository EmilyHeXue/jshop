// pages/home/couponRedemptionCenter/couponRedemptionCenter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons:[],
    page:false,
    list: {
      aaa: ()=> {
        return 'aaaaaaaaaa'
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().postFormIds()
    this.getCoupons()
    app.setTheme()
    wx.setNavigationBarTitle({
      title: '领券中心',
    })
  },

  /**
   * 获取红包
   */
  getCoupons () {
    wx.request({
      url: `${wx.getStorageSync('url')}ShopRedEnvelope`,
      data: {
        key: wx.getStorageSync('shopkey')
      },
      header: {
        'Access-Token': wx.getStorageSync('jwt')
      },
      success: res => {
        console.log(res);
        if(res.data.status == 200){
          this.setData({
            coupons: res.data.data,
            page: 2
          })
        }
      }
    })
  },

  /**
   * 获取更多红包
   */
  getMoreData (list) {
    return list
  },

  /**
   * 领取红包
   */
  getRedEnvelope (e) {
    wx.showLoading({
      title: 'Loading',
    })
    wx.request({
      url: wx.getStorageSync('url') + 'ShopRedEnvelope',
      method: "post",
      data: {
        type_id: e.currentTarget.dataset.id
      },
      header: {
        'Access-Token': wx.getStorageSync('jwt'),
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(res)
        wx.hideLoading()
        if (res.data.status == 200) {
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 底部菜单是否显示
   */
  footerFlag () {
    this.setData({
      page: true
    })
  }
})