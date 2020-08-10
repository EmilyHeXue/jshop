Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'推客中心',
    data:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().postFormIds()
    getApp().setTheme()
    this.daig().obnMM()
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
        console.log(this)
      }
    }
  }
  
})