// pages/logisticsInformation/logisticsInformation/logisticsInformation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_sn:14,
    List:'',
    orderNum:'',
    name:'',
    page:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    getApp().postFormIds()
    wx.setNavigationBarTitle({
      title: '物流信息'
    })
    
    this.setData({
      order_sn: this.options.order_sn
    })
    if (this.options.express_number){
      this.getIntegralExpress(this.options.express_number, this.options.simple_name)
    }else{
      this.getShopOrderExpress(this.data.order_sn)
    }
    
  },
  getShopOrderExpress(order_sn){
    wx.request({
      url: `${wx.getStorageSync('url')}shopOrderExpress/${order_sn}`,
      method:'get',
      header:{
        'Access-Token':wx.getStorageSync('jwt')
      },
      success: res => {
        if(res.data.status == 200){
          this.setData({
            List:res.data.data.Traces,
            orderNum:res.data.data.LogisticCode,
            name: res.data.data.expTextName
          })
          console.log(this.data.List)
        }
      }
    })
  },
  getIntegralExpress(express_number, simple_name){
    getApp().ajax({
      url: 'express',
      data: {
        express_number,
        simple_name
      }
    }).then(res => {
      console.log(res)
      this.setData({
        List: res.data.Traces,
        order_sn: this.options.order_sn,
        name: this.options.express_name,
        orderNum: express_number
      })
    })
  },
  footerFlag (e) {
    this.setData({
      page: true
    })
  }
})