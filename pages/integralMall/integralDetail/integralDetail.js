// pages/integralMall/integralDetail/integralDetail.js
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
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '积分明细',
    })
  },
  getData(e){
    console.log(e,'shopScoreGoods')
  }
})