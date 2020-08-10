// pages/luckVoucher/luckVoucher.js
import { requrl} from '../../config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receive_info: {},
    receive_List: [],
    layerFlag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '运气红包',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#fb2938'
    })
    getApp().login().then(res => {
      console.log('登陆成功')
      this.getluckVoucher(options.order_sn)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(requrl + '../uploads/psqhb.png')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shopInfo').name,
      path: `/pages/index/index/index?id=${wx.getStorageSync('user').id}&leader_id=${wx.getStorageSync('area_id')}`,
      imageUrl: `${requrl}../uploads/psqhb.png`
    }
  },

  /**
   * 领取运气红包
   */
  getluckVoucher (order_sn) {
    getApp().ajax({
      url: 'luckyReceivePacket',
      method: 'post',
      data: {
        order_sn
      }
    }).then(res => {
      this.setData({
        receive_info: res.data.receive_info,
        receive_List: res.data.receive_list
      })
      if (this.options.hasOwnProperty('user_id')){
        wx.setStorageSync('shareInfo', { sharePeople_id: this.options.user_id, leader_id: this.options.leader_id })
      }
    }).catch(err => {
      this.setData({
        layerFlag: !this.data.layerFlag
      })
    })
  },
  go(e) {
    wx.redirectTo({
      url: '/pages/index/index/index',
    })
  },
  show () {
    this.setData({
      layerFlag: !this.data.layerFlag
    })
  }
})