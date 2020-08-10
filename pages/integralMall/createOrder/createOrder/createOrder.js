// pages/integralMall/createOrder/createOrder/createOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLayer: false,
    data: {},
    addressid:'',
    score: 0,
    goodsScore: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    console.log(options)
    wx.setNavigationBarTitle({
      title: '创建订单',
    })
    this.getData(options.id)
  },
  getData(e){
    getApp().ajax({
      url: `shopScoreGoods/${e}`
    }).then(res => {
      console.log(res)
      this.setData({
        data: res.data,
        score: wx.getStorageSync('user').score,
        goodsScore: res.data.score
      })
    })
  },
  createOrder (e) {
    this.show()
  },

  show() {
    this.setData({
      showLayer: !this.data.showLayer
    })
  },
  
  getAddressid(e){
    this.setData({
      addressid: e.detail.addressid
    })
  }
})