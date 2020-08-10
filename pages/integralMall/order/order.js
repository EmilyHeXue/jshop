// pages/integralMall/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    list: [],
    page:1,
    flag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '积分订单',
    })
    getApp().setTheme()
    this.getData(this.data.type)
  },
  changeTab(e){
    this.setData({
      type: e.currentTarget.dataset.index
    })
    this.getData(this.data.type)
  },
  getData(status){
    this.setData({
      page: 1
    })
    getApp().ajax({
      url: 'shopScoreOrder',
      data: {
        status: status,
        page: this.data.page
      }
    }).then(res => {
      this.setData({
        data: res.data,
        page: this.data.page + 1
      })
    }).catch(err => {
      this.setData({
        data: []
      })
    })
  },
  /**
   * 获取更多数据
   */
  getMoreData(){
    getApp().ajax({
      url: 'shopScoreOrder',
      data: {
        status: this.data.type,
        page: this.data.page
      }
    }).then(res => {
      let data = this.data.data
      data.push(...res.data)
      this.setData({
        data,
        page: this.data.page + 1
      })
    }).catch(res => {
      this.setData({
        flag: false
      })
    })
  },
  onReachBottom(){
    if(this.data.flag){
      this.getMoreData()
    }
  },
  findExpress(e){
    console.log(e)
    let order = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/logisticsInformation/logisticsInformation/logisticsInformation?simple_name=${order.simple_name}&express_number=${order.express_number}&order_sn=${order.order_sn}&express_name=${order.express_name}`,
    })
  }
})