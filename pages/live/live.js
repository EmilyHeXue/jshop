// pages/live/live.js
import { liveappid } from '../../config.js'
import { countdownDay } from '../../utils/util.js'
let counttime = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    appid: '',
    time: 0,
    countdown: 'qqqq',
    videoIndex: null,
    foorterFlag: false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '直播',
    })
    this.getData()
    counttime = setInterval(() => {
      this.getData()
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(counttime)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(counttime)
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
   * 获取列表
   */
  getData () {
    getApp().ajax({
      url: 'shopLive'
    }).then(res => {
      let list = res.data.map(e => {
        let time = new Date().getTime() / 1000
        if(e.start_time < time && time < e.end_time){ // 正在直播
          e.liveStatus = 101
        } else if (time < e.start_time){ // 未开播
          let data = countdownDay(e.start_time)
          e.date = data
          e.liveStatus = 102
        }else if(time > e.end_time){ // 已结束
          e.date = '直播回放'
          e.liveStatus = 103
        }
      })
      this.setData({
        list: res.data,
        appid: liveappid,
        time: new Date().getTime() / 1000
      })
    })
  },
  /**
   * 绑定回放下标
   */
  bindvideoIndex (e) {
    this.setData({
      videoIndex: e.currentTarget.dataset.index
    })
  },
  /**
   * 页面跳转
   * date 2020/4/13
   * @author kang
   */
  go (url) {
    console.log(url)
    wx.navigateTo({
      url: '/' + url,
    })
  },
  golive (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  show(e){
    console.log(e)
    this.setData({
      foorterFlag: e.detail.flag
    })
  }
})