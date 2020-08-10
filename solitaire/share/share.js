// solitaire/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leader: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '接龙分享',
    })
    if (this.options.hasOwnProperty('user_id')) {
      wx.setStorageSync('shareInfo', { sharePeople_id: this.options.user_id, leader_id: this.options.leader_id })
    }
    this.setData({
      background: wx.getStorageSync('background')
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
    this.getActivityDetails()
    this.getLeaderInfo()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `${this.data.goodsName}`,
      path: `/solitaire/share/share?id=${this.options.id}&user_id=${wx.getStorageSync('user').id}&leader_id=${wx.getStorageSync('area_id')}`,
      imageUrl: this.data.banner[0]
    }
  },
  /**
   * 获取接龙详情
   */
  getActivityDetails(){
    getApp().ajax({
      url: `shopSolitaire`,
      data: {
        solitaire_id: this.options.id,
        share_uid: this.options.userid
      }
    }).then(res => {
      console.log(res)
      this.setData({
        ...res.data
      })
    })
  },
  getLeaderInfo(){
    getApp().ajax({
      url: `shopTuanUserInfo/${this.options.leader_id}`,
      noLogin: true
    }).then(res => {
      this.setData({
        leader: res.data
      })
    })
  },
  go(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  }
})