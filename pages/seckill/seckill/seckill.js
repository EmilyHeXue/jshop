// pages/seckill/seckill/seckill.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    menu:[],
    background: ''
  },
  change (e) {
    console.log(e.detail.id)
    this.getData(this.data.menu[e.detail.id].id)
  },
  onShow(){
    getApp().setTheme()
    this.getMenu()
    wx.setNavigationBarTitle({
      title: '秒杀活动',
    })
    this.setData({
      background: wx.getStorageSync('background')
    })
  },
  getMenu(){
    app.ajax({
      url:'shopFlashSale'
    }).then(res => {
      this.setData({
        menu: res.data
      })
      this.getData(res.data[0].id)
    })
  },
  getData(id) {
    app.ajax({
      url: `shopFlashSale/${id}`
    }).then(res => {
      this.setData({
        data: res.data.goods
      })
    })
  }
})