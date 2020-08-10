// bargaining/pages/buyDetail/buyDetail.js\
let countdown
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress: 100,
    myAvatar: '',
    myPrice: 0,
    layerFlag: false,
    isbargaining: false,
    weight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    this.getData()
    wx.setNavigationBarTitle({
      title: '砍价详情',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.options.id)
    this.setData({
      myAvatar: wx.getStorageSync('user').avatar
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(countdown)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(countdown)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `${wx.getStorageSync('user').nickname}邀请你帮忙砍价`,
      path: `/bargaining/pages/helpDetail/helpDetail?id=${this.options.id}&user_id=${wx.getStorageSync('user').id}& leader_id=${wx.getStorageSync('area_id')}`
    }
  },

  /**
   * 获取数据
   */
  getData() {
    getApp().ajax({
      url: `shopBargain/${this.options.id}`
    }).then(res => {
      this.setData({
        ...res.data,
        end_time: Number(res.data.end_time),
        cost_price: Number(res.data.cost_price),
        min_pirce: Number(res.data.min_pirce),
        price: Number(res.data.price),
        progress: ((Number(res.data.cost_price) - Number(res.data.price)) / Number(res.data.cost_price))* 100,
        isend: Number(res.data.end_time) < new Date().getTime() / 1000
      })
      this.forMatTime(res.data.end_time)
      countdown = setInterval(() => {
        this.forMatTime(res.data.end_time)
      }, 1000)
    })
  },
  isemplIds(){
    console.log(wx.getStorageSync('SubscribeTemplateId')['bargain'])
    if (wx.getStorageSync('SubscribeTemplateId')['bargain']) { //判断是否有订阅消息id
      wx.requestSubscribeMessage({
        tmplIds: [wx.getStorageSync('SubscribeTemplateId')['bargain']],
        success: res => {
          this.goBargaining()
        },
        fail: err => {
          console.log(err)
          this.goBargaining()
        }
      })
    } else {
      this.goBargaining()
    }
  },
  /**
   * 立即砍价
   */
  goBargaining () {
    getApp().ajax({
      url: `shopBargain/${this.options.id}`,
      method: 'post'
    }).then(res => {
      this.setData({
        layerFlag: true,
        myPrice: res.data
      })
      clearInterval(countdown)
      this.getData()
    }).catch(err => {
      wx.hideLoading()
      this.setData({
        layerFlag: true,
        myPrice: err.data,
        isbargaining: true
      })
      clearInterval(countdown)
      this.getData()
    })
  },
  /**
   * 隐藏弹窗
   */
  showLayer () {
    this.setData({
      layerFlag: !this.data.layerFlag
    })
  },
  /**
   * 下单
   */
  toBuy(){
    let data = [{
      supplier_id: 0,
      supplier_name: wx.getStorageSync('shopInfo').name,
      list:[{
        goods_id: this.data.goods_id,
        price: this.data.price,
        number: 1,
        total_price: this.data.price,
        property1_name: this.data.property1_name,
        property2_name: this.data.property2_name,
        pic_url: this.data.pic_url,
        stock_id: this.data.stock_id,
        goods_name: this.data.goods_name,
        type: 1,
        weight: this.data.weight
      }]
    }]
    wx.setStorageSync('tuanNum', 0)
    wx.setStorageSync('shopcartData', data)
    wx.redirectTo({
      url: `/pages/createOrder/createOrder/createOrder?bargin_id=${this.options.id}`,
    })
  },
  /**
   * 跳转到商品
   */
  gogood() {
    wx.navigateTo({
      url: `/bargaining/pages/goodItem/goodItem/goodItem/id=${this.data.data.goods_id}`,
    })
  },
  forMatTime(end_time) {
    let timeInterval = parseInt((end_time * 1000 - new Date().getTime()) / 1000)
    let hour = parseInt(timeInterval / 3600).toString().padStart(2, 0)
    let minute = parseInt(timeInterval % 3600 / 60).toString().padStart(2, 0)
    let second = parseInt(timeInterval % 60).toString().padStart(2, 0)
    this.setData({
      hour,
      minute,
      second
    })
    if (second < 0) {
      clearInterval(countdown)
    }
  }
})