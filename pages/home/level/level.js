// pages/group/grouplevel/grouplevel.js
Page({

  /**
   * 页面的初始数据
   * 
   */
  data: {
    avatar: wx.getStorageSync('user').avatar,
    nickname: wx.getStorageSync('user').nickname,
    level_name: '',
    nextLevel: '',
    in_score:0,
    will_score: 0,
    discount_ratio: 10,
    percentage: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '等级福利',
    })
    this.getData()
  },
  getData() {
    getApp().ajax({
      url: 'unpaidVipAccess'
    }).then(res => {
      console.log(res.data)
      this.setData({
        level_name: res.data.info.name,
        in_score: res.data.info.min_score,
        nextLevel: res.data.next ? res.data.next.name : res.data.info.name,
        will_score: res.data.next ? res.data.next.min_score - res.data.info.min_score: 0,
        percentage: res.data.next ? res.data.info.min_score / res.data.next.min_score * 100 : 100,
        discount_ratio: res.data.info.discount_ratio * 10
      })
    })
  }
})