// bargaining/pages/goodItem/goodItem/goodItem.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    leave: false,
    html:'',
    layerflag: false,
    isBuy: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '订单详情',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getGoodDetail()
    this.getGoodsInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      leave: true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取商品详细信息
   */
  getGoodDetail () {
    wx.showToast({
      title: '商品信息获取中',
      image: '/images/loading.gif',
      mask: true
    })
    getApp().ajax({
      url: `shopGoods/${this.options.id}`,
      data: {
        key: wx.getStorageSync('shopkey'),
        leader_id: wx.getStorageSync('area_id') || 0
      }
    }).then(res => {
      this.setData({
        data: res.data
      })
      wx.hideLoading()
    })
  },
  
  /**
   * 获取商品详情
   * @Callback 商品详情
   * @param {string} html - 商品富文本
   */
  getGoodsInfo() {
    getApp().ajax({
      url: `shopGoodsinfo/${this.options.id}`,
      data: {
        key: wx.getStorageSync('shopkey')
      }
    }).then(res => {
      this.setData({
        html: res.data.detail_info
      })
    })
  },
  /**
   * 显示弹层
   */
  showLayer(e) {
    console.log(e.detail)
    if (e.detail.hasOwnProperty('isBuy')) {
      this.setData({
        isBuy: e.detail.isBuy,
        layerflag: e.detail.flag
      })
    } else {
      this.setData({
        layerflag: e.detail.flag
      })
    }
    console.log(this.data.isBuy, e.detail.isBuy)
  }
})