// pages/coupons/coupons/coupons.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    List:'',
    page: false
  },
  /**
   * 生命周期函数--监听页面显示
  **/
  onShow: function () {
    getApp().postFormIds()
    this.getData()
    wx.setNavigationBarTitle({
      title: '我的优惠券'
    })
  },
  getData(){
    wx.request({
      url:`${wx.getStorageSync('url')}ShopVoucher`,
      header:{
        'Access-Token':wx.getStorageSync('jwt')
      },
      method:'get',
      success: res => {
        this.setData({
          List:res.data.data
        })
      }
    })
  },
  toshopping(data){
    let index = data.currentTarget.dataset.index;
    if(this.data.List[index].is_used != 0){
      wx.showToast({
        title:'该优惠券已使用',
        icon:'none'
      })
    }else if(this.data.List[index].is_used == 0){
      wx.navigateTo({
        url: '/pages/index/index/index'
      })
    }
  },
  toCouponsCenter () {
    wx.navigateTo({
      url: '/pages/home/couponRedemptionCenter/couponRedemptionCenter',
    })
  },
  footerFlag () {
    this.setData({
      page:true
    })
  }
})