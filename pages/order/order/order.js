// pages/order/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:8,
    orderList:[],
    pages:1,
    current_pages:'',
    page: false,
    arr:{
      '8':'0',
      '0':'1',
      '1':'2',
      '3':'3',
      '6':'4'
    },
    headIndex:0,
    noLogin: false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    getApp().postFormIds()
    this.setData({
      id: this.options.id || 8,
      headIndex: this.data.arr[this.options.id]
    })
    
    wx.setNavigationBarTitle({
      title: '订单列表'
    })
  },
  onShow(){
    this.getOrderList(this.data.id)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getid(data){
    let id = data.detail.id;
    this.setData({
      id: id,
      orderList:[],
      pages:1
    })
    this.getOrderList(id);
  },
  /**
   * 获取订单列表
  **/
  getOrderList(id){
    console.log(id);
    wx.showLoading({
      title: '',
    })
    wx.request({
      url:wx.getStorageSync('url') + 'shopOrder',
      method:'get',
      header:{
        'Access-Token':wx.getStorageSync('jwt')
      },
      data:{
        status:this.data.id
      },
      success: res => {
        console.log(res);
        wx.hideLoading()
        if (res.data.status == 200){
          this.setData({
            orderList:res.data.data
          })
        }else if(res.data.status == 204){
          this.setData({
            orderList: []
          })
        }else if(res.data.status == 1001){
          this.setData({
            noLogin: true
          })
        }
      }
    })
  },
  footerFlag (e) {
    this.setData({
      page: true
    })
  }
})