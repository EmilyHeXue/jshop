// promoter/promoterUser/promoterUser.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      backgroundColor: '#373D4B',
      frontColor: '#ffffff',
    })
    wx.setNavigationBarTitle({
      title: '旗下团员',
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getData () {
    getApp().ajax({
      url: 'shopTuanMerbers',
      data: {
      }
    }).then(res => {
      console.log(res)
      this.setData({
        list: [...this.data.list, ...res.data]
      })
    })
  }
})