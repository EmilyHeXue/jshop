// pages/webview/webview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: `https://api.juanpao.com/chat/wolive-web/public/index.php?s=index/index/home&visiter_id=&visiter_name=&avatar=&business_id=${wx.getExtConfigSync().key}&groupid=0`
  },

  /**
   * 生命周期函数--监听页面加载
   * business_id 商家信息
   * visiter_id 访客id
   * avatar 访客头像绝对路径
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '在线客服',
    })
    getApp().postFormIds()
    let url = `https://api.juanpao.com/chat/wolive-web/public/index.php?s=index/index/home&visiter_id=${wx.getStorageSync('union_id')}&visiter_name=&avatar=&business_id=${wx.getStorageSync('shopkey')}&groupid=0&avatar=${wx.getStorageSync('avatar')}`
    this.setData({
      url:url
    })
    console.log(url)
  }
})