// solitaire/mysolitaireshare/mysolitaireshare.js
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
    wx.setNavigationBarTitle({
      title: '我的接龙分享',
    })
    getApp().setTheme()
    if (this.options.hasOwnProperty('user_id')) {
      wx.setStorageSync('shareInfo', { sharePeople_id: this.options.user_id, leader_id: this.options.leader_id })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      url: `solitaire/activity/activity?id=${this.options.id}&user_id=${wx.getStorageSync('user').id}&leader_id=${wx.getStorageSync('area_id')}`
    }
  },
  onShow(){
    this.getData()
  },
  getData(){
    getApp().ajax({
      url: 'shopSolitaireShare',
      data: {
        solitaire_id: this.options.id,
        share_uid: this.options.userid
      }
    }).then(res => {
      console.log(res)
      this.setData({
        ...res.data,
        background: wx.getStorageSync('background'),
        id: this.options.id
      })
    })
  }
})