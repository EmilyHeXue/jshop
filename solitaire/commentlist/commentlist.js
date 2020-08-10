// solitaire/commentlist/commentlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '评论列表',
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
    this.shopSolitaireComment()
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
    this.shopSolitaireComment()
  },
  /**
   * 获取接龙评论列表
   */
  shopSolitaireComment () {
    getApp().ajax({
      url: 'shopSolitaireComment',
      data: {
        solitaire_id: this.options.id,
        limit: 10,
        page: this.data.page
      }
    }).then(res => {
      this.setData({
        comment: [...this.data.comment,...res.data],
        page: this.data.page + 1
      })
    })
  },
  preview(e){
    let index = e.currentTarget.dataset.index
    let imgindex = e.currentTarget.dataset.imgindex
    wx.previewImage({
      urls: this.data.comment[index].pic_urls,
      current: this.data.comment[index].pic_urls[imgindex]
    })
  }
})