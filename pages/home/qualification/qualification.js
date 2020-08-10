// pages/home/qualification/qualification.js
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
      title: '资质规则',
    })
  },
  go(e){
    console.log(e.currentTarget.dataset.key)
    wx.navigateTo({
      url: `../qualificationDetail/qualificationDetail?key=${e.currentTarget.dataset.key}&name=${e.currentTarget.dataset.name}`,
    })
  }
})