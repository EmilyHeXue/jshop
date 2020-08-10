// pages/integralMall/index/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    background: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '积分商城',
    })
  },
  onShow(){
    this.getGoodsData()
    this.setData({
      background: wx.getStorageSync('background') || 'red'
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getGoodsData(){
    getApp().ajax({
      url: 'shopScoreGoods'
    }).then(res => {
      this.setData({
        goods: res.data
      })
    })
  },
  go(){
    wx.navigateTo({
      url: '../../order/order',
    })
  }
})