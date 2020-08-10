// pages/group/groupcommissionwater/groupcommissionwater/groupcommissionwater.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    api: ['shopBalancesAll','shopBalances'],
    apiIndex: 0,
    data:[],
    page:1,
    limit: 10,
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单流水',
    })
    getApp().postFormIds()
    getApp().setTheme()
    this.getData()
  },
  getData(){
    wx.request({
      url: `${wx.getStorageSync('url')}${this.data.api[this.data.apiIndex]}`,
      header:{
        "Access-Token": wx.getStorageSync('jwt')
      },
      data:{
        page:this.data.page,
        limit: this.data.limit
      },
      success: res => {
        let data = this.data.data
        if(res.data.status === 200){
          data.push(...res.data.data)
          this.setData({
            data: data,
            count:res.data.count,
            page: this.data.page + 1
          })
          console.log(data)
        }else if(res.data.status === 204){
          this.setData({
            data: data
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },
  changeList(e){
    this.setData({
      page:1,
      count: 0,
      apiIndex: e.detail.index,
      data: []
    })
    this.getData()
  },
  onReachBottom(){
    if(this.data.page <= this.data.count){
      this.getData()
    }
  }
})