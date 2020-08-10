// pages/spellGroup/groupOrderList/groupOrderList.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuindex: 0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '拼团订单',
    })
    this.getData(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 切换列表
   */
  changeMenu(e){
    this.setData({
      menuindex: parseInt(e.currentTarget.dataset.index)
    })
    this.getData(e.currentTarget.dataset.index)
  },

  /**
   * 获取订单数据
   */
  getData(status){
    wx.showLoading({
      title: '',
    })
    getApp().ajax({
      url: 'groupOrderList',
      data: {
        status
      }
    }).then(res => {
      wx.hideLoading()
      this.setData({
        list: res.data
      })
    }).catch(err => {
      wx.hideLoading()
      this.setData({
        list: []
      })
    })
  },

  /**
   * 跳转详情
   */
  go(e){
    console.log(e.currentTarget.dataset, this.data.menuindex)
    if(this.data.menuindex === 0){
      wx.navigateTo({
        url: `/pages/spellGroup/willGroup/willGroup?id=${e.currentTarget.dataset.id}&order_sn=${e.currentTarget.dataset.order_sn}`,
      })
    }
    if (this.data.menuindex === 1) {
      wx.navigateTo({
        url: `/pages/spellGroup/okGroup/okGroup?id=${e.currentTarget.dataset.id}&order_sn=${e.currentTarget.dataset.order_sn}`,
      })
    }
    if (this.data.menuindex === 2) {
      wx.navigateTo({
        url: `/pages/spellGroup/errGroup/errGroup?id=${e.currentTarget.dataset.id}&order_sn=${e.currentTarget.dataset.order_sn}`,
      })
    }
  }
})