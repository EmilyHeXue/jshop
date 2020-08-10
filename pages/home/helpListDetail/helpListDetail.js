// pages/home/help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '帮助中心',
    })
    this.getList()
  },
  getList() {
    getApp().ajax({
      url: `shopHelp/${this.options.id}`,
    }).then(res => {
      this.setData({
        data: res.data
      })
    })
  }
})