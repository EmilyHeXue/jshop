// pages/goodsItem/commentsDetail/commentsDetail.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '商品评价',
    })
    this.getData(options.id)
  },
  /**
   * 
   */
  getData(val){
    wx.request({
      url: `${wx.getStorageSync('url')}shopGoodsComments/${val}`,
      data: {
        key: wx.getStorageSync('shopkey')
      },
      success: res => {
        if (res.data.status == 200) {
          this.setData({
            data: res.data.data
          })
        } else if (res.data.status == 204) {
          this.setData({
            data: []
          })
        } else {
          console.log(res.data)
        }
      }
    })
  },
  /**
   * 是否显示底部导航栏
  */
  show(e) {
    this.setData({
      page: true
    })
  }
})