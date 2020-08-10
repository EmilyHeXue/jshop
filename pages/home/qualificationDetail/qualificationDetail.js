// pages/home/qualificationDetail/qualificationDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    html: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    this.getData(options.key)
    wx.setNavigationBarTitle({
      title: options.name,
    })
  },
  getData(e){
    getApp().ajax({
      url: 'shopDiy',
      data: {
        key: e
      }
    }).then(res => {
      this.setData({
        html: res.data
      })
    })
  }
})