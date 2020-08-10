// pages/spellGroup/willGroup/willGroup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_info: {},
    avatar: [],
    poor: 0,
    background: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id, options.order_sn)
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
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '拼团失败',
    })
    this.setData({
      background: wx.getStorageSync('background')
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  /** */
  getData(id, order_sn) {
    getApp().ajax({
      url: `groupList/${id}`,
      data: {
        type: 1,
        order_sn
      }
    }).then(res => {
      console.log(res)
      this.setData({
        goods_info: res.data.goods_info,
        avatar: res.data.list,
        poor: parseInt(res.data.poor)
      })
    })
  },
  /**
   * 
   */
  go () {
    wx.navigateTo({
      url: '/pages/index/index/index',
    })
  }
})