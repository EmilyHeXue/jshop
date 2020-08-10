
let countdown
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress: 100,
    myAvatar: '',
    myPrice: 0,
    layerFlag: false,
    isbargaining: false,
    isend: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    this.getData()
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
    console.log(this.options.id)
    this.setData({
      myAvatar: wx.getStorageSync('user').avatar
    })
    if (this.options.hasOwnProperty('user_id')) {
      wx.setStorageSync('shareInfo', { sharePeople_id: this.options.user_id, leader_id: this.options.leader_id })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(countdown)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(countdown)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `${wx.getStorageSync('user').nickname}邀请你帮忙砍价`,
      path: `/bargaining/pages/helpDetail/helpDetail?id=${this.options.id}&user_id=${wx.getStorageSync('user').id}& leader_id=${wx.getStorageSync('area_id')}`
    }
  },

  /**
   * 获取数据
   */
  getData() {
    getApp().ajax({
      url: `shopBargain/${this.options.id}`
    }).then(res => {
      this.setData({
        ...res.data,
        end_time: Number(res.data.end_time),
        cost_price: Number(res.data.cost_price),
        min_pirce: Number(res.data.min_pirce),
        price: Number(res.data.price),
        progress: ((Number(res.data.cost_price) - Number(res.data.price)) / Number(res.data.cost_price - res.data.min_pirce)) * 100,
        isend: Number(res.data.end_time) < new Date().getTime() / 1000
      })
      this.simpDateFormat(res.data.end_time)
      countdown = setInterval(() => {
        this.simpDateFormat(res.data.end_time)
      }, 1000)
    })
  },
  /**
   * 立即砍价
   */
  goBargaining() {
    getApp().ajax({
      url: `shopBargain/${this.options.id}`,
      method: 'post'
    }).then(res => {
      this.setData({
        layerFlag: true,
        myPrice: res.data
      })
      clearInterval(countdown)
      this.getData()
    }).catch(err => {
      wx.hideLoading()
      this.setData({
        layerFlag: true,
        myPrice: err.data,
        isbargaining: true
      })
      clearInterval(countdown)
      this.getData()
    })
  },
  /**
   * 隐藏弹窗
   */
  showLayer() {
    this.setData({
      layerFlag: !this.data.layerFlag
    })
  },
  /**
   * 跳转到商品
   */
  gogood () {
    wx.navigateTo({
      url: `/bargaining/pages/goodItem/goodItem/goodItem?id=${this.data.goods_id}`,
    })
  },
  simpDateFormat(end_time){
    let timeInterval = parseInt((end_time * 1000 - new Date().getTime()) / 1000)
    let hour = parseInt(timeInterval / 3600).toString().padStart(2, 0)
    let minute = parseInt(timeInterval % 3600 / 60).toString().padStart(2, 0)
    let second = parseInt(timeInterval % 60).toString().padStart(2, 0)
    this.setData({
      hour,
      minute,
      second
    })
  }
})