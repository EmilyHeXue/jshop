// pages/group/groupbrochure/groupbrochure.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().getColor()
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '供货商宣传页',
    })
    this.getData()
  },
  getData(){
    getApp().ajax({
      url: 'shopDiy',
      data: {
        key: 'supplierbrochure'
      }
    }).then(res => {
      this.setData({
        data: res.data
      })
    })
  },
  makePhoneCall(){
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('shopInfo').supplier_phone
    })
  },
  post () {
    wx.navigateTo({
      url: '/pages/supplier/supplierform/supplerform',
    })
  }
})