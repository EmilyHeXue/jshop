Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: `${wx.getStorageSync('leader_name')}中心`,
    data:{}
  },
  onShareAppMessage () {
    return {
      title: wx.getStorageSync('shopInfo').name,
      path: `/pages/index/index/index?id=${wx.getStorageSync('user').id}&leader_id=${wx.getStorageSync('area_id')}`,
      imageUrl: wx.getStorageSync('shopInfo').default_pic_url
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().postFormIds()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#434959',
    })
    this.daig().obnMM()
    wx.setNavigationBarTitle({
      title: '我的收益',
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
  },
  daig () {
    return {
      that: 'aaaaa',
      obnMM: () => {
        
      }
    }
  }
  
})