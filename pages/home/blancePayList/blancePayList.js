// pages/home/blancePayList/blancePayList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [1,2,3,4,5],
    shopname: ''
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
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '付款记录',
    })
    this.setData({
      shopname: wx.getStorageSync('shopInfo').name
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
  },
  copy (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.ordersn,
    })
  },
  getData() {
    getApp().ajax({
      url: 'shopUserPayment'
    }).then(res => {
      console.log(res)
      this.setData({
        list: res.data
      })
    })
  }
})