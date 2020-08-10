// assemble/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslist: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '新人专享'
    })
    this.getList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      goodslist: [],
      page: 1
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList()
  },

  /**
   * 获取商品
   */
  getList() {
    getApp().ajax({
      url: 'shopGoods',
      data: {
        is_recruits: 1,
        key: wx.getStorageSync('shopkey'),
        current_page: this.data.page
      }
    }).then(res => {
      wx.stopPullDownRefresh()
      this.setData({
        goodslist: [...this.data.goodslist, ...res.data],
        page: this.data.page + 1
      })
    }).catch(err => {
      wx.stopPullDownRefresh()
      console.log('goodList, 拼团:', err)
    })
  },
  to(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  }
})