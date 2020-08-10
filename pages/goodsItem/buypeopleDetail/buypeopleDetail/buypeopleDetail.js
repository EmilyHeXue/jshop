// pages/goodsItem/buypeopleDetail/buypeopleDetail/buypeopleDetail.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    number: 0,
    people: 0,
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '购买人数',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getApp().setTheme()
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData()
  },

  /**
   * 获取数据
   */
  getData() {
    getApp().ajax({
      url: `shopGoodsBuyInfo/${this.options.id}`,
      data: {
        page: this.data.page
      }
    }).then(res => {
      this.setData({
        data: [...this.data.data, ...res.data],
        number: Number(res.number),
        people: Number(res.people),
        page: this.data.page + 1
      })
    })
  }
})