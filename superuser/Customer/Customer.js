// superuser/Customer/Customer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    search: '',
    data: [],
    status: 0,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取数据
   */
  getData(e) {
    let data = {
      type: '2',
      status: this.data.status,
      page: this.data.page
    }
    if(e){
      if (e.hasOwnProperty('detail')) {
        data.searchName = e.detail.value
        this.setData({
          data: []
        })
      }
    }
    getApp().ajax({
      url: 'distributionUser',
      data
    }).then(res => {
      let data = [...this.data.data, ...res.data]
      this.setData({
        data,
        page: this.data.page + 1
      })
    })
  },
  changeList (e) {
    console.log(e)
    this.setData({
      index: e.currentTarget.dataset.status,
      status: e.currentTarget.dataset.status == 1 ? 0: 1,
      data: [],
      page: 1
    })
    this.getData()
  }
})