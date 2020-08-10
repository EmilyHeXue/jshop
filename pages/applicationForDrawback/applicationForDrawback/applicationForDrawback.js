// pages/applicationForDrawback/applicationForDrawback/applicationForDrawback.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'14',
    order_sn:'',
    list:'',
    status: '',
    page: false
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (option) {
    this.getOrderData(option.order_sn)
    wx.setNavigationBarTitle({
      title: '申请退款'
    })
    this.setData({
      order_sn: option.order_sn
    })
    getApp().postFormIds()
  },
  /**
   * 获取订单数据
   * order_sn: String 订单编号
   * list: Object 商品数据
   */
  getOrderData(order_sn){
    app.ajax({
      url: `shopOrder/${order_sn}`
    }).then(res => {
      this.setData({
        list: res.data.order,
        status: res.data.status == 1 ? 1 : 0
      })
    })
  },

  footerFlag (e) {
    this.setData({
      page:true
    })
  }
})