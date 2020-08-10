// supplier/list/list.js
import {requrl} from '../../config.js' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    host: ''
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '门店列表',
    })
    this.setData({
      host: requrl.split('index.php/')[0] + 'uploads/mdhb.png'
    })
  },
  onLoad () {
    wx.chooseLocation({
      complete: (res) => {
        this.setData({
          latitude: res.latitude || 0,
          longitude: res.longitude || 0
        })
        this.getList()
      },
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      list: []
    })
    this.getList()
  },
  /**
   * 获取门店列表
   * date 2020/4/3
   * @author kang
   */
  getList () {
    getApp().ajax({
      url: 'shopSuppliers',
      data: {
        page: this.data.page,
        limit: 10,
        latitude: this.data.latitude,
        longitude: this.data.longitude
      }
    }).then(res => {
      this.setData({
        list: [...this.data.list, ...res.data],
        page: this.data.page + 1
      })
    })
  },
  /**
   * 页面跳转
   * date 2020/4/3
   * @author kang
   */
  go (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /**
   * 路由跳转
   * date 2020/4/9
   * @author kang
   */
  to(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  show(e){
    console.log(e)
    this.setData({
      foorterFlag: e.detail.flag
    })
  }
})