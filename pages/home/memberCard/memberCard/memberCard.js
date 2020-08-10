// pages/home/memberCard/memberCard/memberCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '开通会员后尊享以下权益',
    data:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isVip()
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '会员卡',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  isVip(){
    getApp().ajax({
      url: 'vipIsVip'
    }).then(res => {
      console.log(res.data)
      if(res.data.is_vip == 1){
        this.setData({
          text: res.data.end_time
        })
      }
    })
  },
  getCard(e){
    console.log(e.detail.data)
    this.setData({
      data: e.detail.data
    })
  },
  downOrder() {
    getApp().ajax({
      url: `vipAccess`,
      method: 'post',
      data: {
        vip_id: this.data.data.id
      }
    }).then(res => {
      this.toPay(res.data)
    })
  },
  toPay(id){
    getApp().ajax({
      url: `vipAccess/${id}`,
      method: 'post',
      data: {
        pay_type: 2
      }
    }).then(res => {
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        success: res => {
          this.isVip()
        }
      })
    })
  }
})