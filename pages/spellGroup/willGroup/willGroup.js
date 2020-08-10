// pages/spellGroup/willGroup/willGroup.js
import { countdown } from '../../../utils/util.js'
let willGroup
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_info: {},
    avatar:[],
    poor:0,
    background: '',
    expire_time: '',
    group_id: '',
    order_sn:''
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(willGroup)
  },
  onUnload: function () {
    clearInterval(willGroup)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData(this.options.id, this.options.order_sn)
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '等待成团',
    })
    this.setData({
      background: wx.getStorageSync('background'),
      order_sn: this.options.order_sn,
      group_id: this.options.id
    })
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
    return {
      title: `您的好友${wx.getStorageSync('user').nickname}邀请您参与拼团`,
      path: `/pages/spellGroup/goGroup/goGroup?group_id=${this.data.group_id}&order_sn=${this.data.order_sn}&leader_id=${wx.getStorageSync('area').uid}&user_id=${wx.getStorageSync('user').id}&leader_id=${wx.getStorageSync('area_id')}`,
    }
  },

  /** */
  getData(id, order_sn){
    getApp().ajax({
      url: `groupList/${id}`,
      data: {
        type: 1,
        order_sn
      }
    }).then(res => {
      console.log(res)
      this.setData({
        goods_info: res.data.goods_info,
        avatar: res.data.list,
        poor: parseInt(res.data.poor),
        expire_time: countdown(res.data.list[0].expire_time)
      })
      if(res.data.poor != 0){
        if (res.data.list[0].expire_time * 1000 < new Date().getTime()) {
          clearInterval(willGroup)
          wx.redirectTo({
            url: `/pages/spellGroup/errGroup/errGroup?id=${this.data.group_id}&order_sn=${this.data.order_sn}`,
          })
          return false
        }
        willGroup = setInterval(() => {
          if (res.data.list[0].expire_time * 1000 < new Date().getTime()) {
            clearInterval(willGroup)
            wx.redirectTo({
              url: `/pages/spellGroup/errGroup/errGroup?id=${this.data.group_id}&order_sn=${this.data.order_sn}`,
            })
            return false
          }
          this.setData({
            expire_time: countdown(res.data.list[0].expire_time)
          })

          console.log(countdown(res.data.list[0].expire_time))
        }, 1000)
      }else{
        wx.redirectTo({
          url: `/pages/spellGroup/okGroup/okGroup?id=${this.data.group_id}&order_sn=${this.data.order_sn}`,
        })
      }
      
    })
  }
})