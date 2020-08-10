// pages/integralMall/goodsItem/goodsItem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    background: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    this.getData(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    this.setData({
      background: wx.getStorageSync('background') || 'red'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取商品数据
   */
  getData(e){
    getApp().ajax({
      url: `shopScoreGoods/${e}`
    }).then(res => {
      console.log(res)
      this.setData({
        data: res.data
      })
      wx.setNavigationBarTitle({
        title: res.data.name,
      })
    })
  },
  /**
   * 去下单
   */
  go(e){
    wx.navigateTo({
      url: `../createOrder/createOrder/createOrder?id=${this.options.id}`,
    })
  }
})