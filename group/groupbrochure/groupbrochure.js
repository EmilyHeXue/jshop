// pages/group/groupbrochure/groupbrochure.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    getApp().getColor()
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: `申请${wx.getStorageSync('leader_name')}`,
    })
    this.getRichText()
  },
  post(){
    wx.redirectTo({
      url: '/group/creategroup/creategroup',
    })
  },
  getRichText(){
    getApp().ajax({
      url: 'shopDiy',
      data:{
        key: 'groupbrochure'
      }
    }).then(res => {
      this.setData({
        data: res.data
      })
    })
  },
  call(){
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('shopInfo').leader_phone
    })
  }
})