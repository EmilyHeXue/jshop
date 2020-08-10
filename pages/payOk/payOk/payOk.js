// pages/payOk/payOk/payOk.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_sn:'',
    nums:'',
    price:'',
    background: wx.getStorageSync('background'),
    fontcolor: wx.getStorageSync('nabigationFontColor'),
    name:'',
    shopname: '',
    layerFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: '支付完毕',
    })
    getApp().postFormIds()
    this.setData({
      order_sn: options.order_sn
    })
    this.getShopInfo()
    app.ajax({
      url: `shopOrderInfo/${options.order_sn}`
    }).then(res => {
      this.setData({
        nums: res.data.numbers,
        price: res.data.payment_money,
        name: res.data.name,
        order_sn: options.order_sn,
        ...res.data
      })
    })
    if (options.isadmin != 'true') {
      this.canCreateVoucher(options.order_sn)
    }
  },
  canCreateVoucher(order_sn){
    app.ajax({
      url: 'luckyShare',
      method: 'post',
      noLogin: true,
      data: {
        order_sn
      }
    }).then(res => {
      this.setData({
        layerFlag: true
      })
    })
  },
  /**
   * 获取店铺信息
   */
  getShopInfo () {
    wx.request({
      url: `${wx.getStorageSync('url')}ShopAppInfo`,
      data:{
        key: wx.getStorageSync('shopkey')
      },
      success: res => {
        console.log(res)
        if(res.data.status == 200){
          this.setData({
            shopname: res.data.data.name
          })
        }
      }
    })
  },

  /**
   * 弹层展示
   */
  show(){
    this.setData({
      layerFlag: !this.data.layerFlag
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(this.data.order_sn)
    if (this.data.layerFlag){
      return {
        title: `亲爱的,${this.data.name}给您发了一个运气红包`,
        imageUrl: '/images/luckbanner.png',
        path: `/pages/luckVoucher/luckVoucher?order_sn=${this.data.order_sn}&user_id=${wx.getStorageSync('user').id}&leader_id=${wx.getStorageSync('area_id')}`
      }
    }else{
      return {
        title: `亲爱的,${this.data.name}刚刚在${this.data.shopname}下单啦!`,
        path: `/pages/payOk/payOk/payOk?order_sn=${this.options.order_sn}&id=${wx.getStorageSync('user').id}&leader_id=${wx.getStorageSync('area_id')}`
      }
    }
  },
  go(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  }
})