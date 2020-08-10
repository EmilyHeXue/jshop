// bargaining/pages/bargaining/Index/Index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    banner: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    console.log(getApp(), 'aaaaaaaa')
    wx.setNavigationBarTitle({
      title: '砍价首页',
    })
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
    this.getData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取商品列表
   */
  getData() {
    let emplIds = [
      wx.getStorageSync('SubscribeTemplateId')['bargain']
    ]
    getApp().ajax({
      url: 'shopBargainGoods',
      data: {
        key: wx.getStorageSync('shopkey'),
        limit: 5,
        page: this.data.page
      }
    }).then(res => {
      this.setData({
        data: [...this.data.data, ...res.data.goods],
        banner: res.data.pic_url,
        page: this.data.page + 1
      })
    })
  },
  /**
   * 跳转商品详情
   */
  toDeatil(e){
    wx.navigateTo({
      url: `/bargaining/pages/goodItem/goodItem/goodItem?id=${e.currentTarget.dataset.id}`,
    })
  }
})