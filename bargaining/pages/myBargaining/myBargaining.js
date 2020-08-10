// bargaining/pages/myBargaining/myBargaining.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的砍价',
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
    getApp().setTheme()
    this.getData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取我的砍价列表
   */
  getData(){
    getApp().ajax({
      url: 'shopBargain'
    }).then(res => {
      console.log(res)
      this.setData({
        data: res.data
      })
    })
  },
  goDetail(e){
    wx.navigateTo({
      url: `/bargaining/pages/buyDetail/buyDetail?id=${e.currentTarget.dataset.id}`,
    })
  },
  toBuy(e) {
    console.log(e.currentTarget.dataset.data)
    let data = [{
      supplier_id: 0,
      supplier_name: wx.getStorageSync('shopInfo').name,
      list: [{
        goods_id: e.currentTarget.dataset.data.goods_id,
        price: e.currentTarget.dataset.data.price,
        number: 1,
        total_price: e.currentTarget.dataset.data.price,
        property1_name: e.currentTarget.dataset.property1_name,
        property2_name: e.currentTarget.dataset.property2_name,
        pic_url: e.currentTarget.dataset.data.pic_url,
        stock_id: e.currentTarget.dataset.data.stock_id,
        bargin_id: e.currentTarget.dataset.data.id,
        weight: e.currentTarget.dataset.data.weight
      }] 
    }]
  }
})