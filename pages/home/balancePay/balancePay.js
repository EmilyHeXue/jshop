// pages/home/balancePay/balancePay.js
let time = 0
let int = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_sn: '',
    qrcode: '',
    money: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '余额支付',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
  },
  onHide(){
    clearInterval(int)
  },
  onUnload(){
    clearInterval(int)
  },
  getData() {
    getApp().ajax({
      url: 'shopUserCode'
    }).then(res => {
      this.setData({
        order_sn: res.data.order_sn,
        qrcode: res.data.url,
        money: res.data.money
      })
      setTimeout(() => {
        this.getData()
      },3600000)
      this.goTime()
    })
  },
  goTime () {
    int = setInterval(() => {
      getApp().ajax({
        url: 'shopUserPayment',
        data: {
          order_sn: this.data.order_sn
        },
        method: 'post'
      }).then(res => {
        wx.showToast({
          title: '付款成功',
          icon: 'none'
        })
        this.getData()
        clearInterval(int)
      })
    }, 1000)
  }
})