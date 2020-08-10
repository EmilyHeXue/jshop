// pages/group/groupsales/groupsales.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'销售额',
    list: [],
    time: '',
    total_number: 0,
    total_price: 0.00,
    index: 1,
    type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().postFormIds()
    getApp().setTheme()
    this.getData(this.data.index, this.data.type)
    wx.setNavigationBarTitle({
      title: '销售额',
    })
  },
  change(e){
    console.log(e.detail)
    this.getData(e.detail.id, e.detail.type)
    this.setData({
      index: e.detail.id,
      type: e.detail.type
    })
  },
  getData(e,sou){
    getApp().ajax({
      url: 'distributionStatistics',
      data: {
        type: this.data.type
      }
    }).then(res => {
      console.log(res)
      this.setData({
        //time: e === 1 ? res.data.start_time.split(' ')[0] : `${res.data.start_time.split(' ')[0]} - ${res.data.end_time.split(' ')[0]}`,
        total_number: res.data.num,
        total_price: res.data.total
      })
    })
  },
  getMore(e, sou){
    getApp().ajax({
      url: sou == 0 ? 'shopLeaderOrderStatistics' : 'shopLeaderOrderStatisticsUser',
      data: {
        page: 1,
        limit: 20,
        time: e
      }
    }).then(res => {
      console.log(res)
      let list = (this.data.list).push(...res.data.list)
      let page = this.data.page++
      this.setData({
        list,
        page
      })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMore(this.data.index, this.data.type)
  }
})