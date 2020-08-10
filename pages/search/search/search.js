Page({
  data: {
    data: [],
    status: 1,
    text: '',
    page: 2,
    animation: {},
    page: false,
    background: ''
  },
  onLoad() {
    getApp().postFormIds()
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '搜索',
    })
    this.setData({
      background: wx.getStorageSync('background')
    })
  },

  /**
   * 事件触底函数
   */
  onReachBottom() {
    this.getMoreData()
  },

  /**
   * 输入搜索内容
   */
  writing(e) {
    this.setData({
      text: e.detail.value
    })
  },

  /**
   * 删除搜索内容
   */
  deltext () {
    console.log('aaaaaaaa')
    this.setData({
      text: ''
    })
  },
  setAnimation () {
    let animation = wx.createAnimation({
      delay:3
    })
    animation.opacity(1).step()
    this.setData({
      animation: animation.export()
    })
  },

  /**
   * 获取数据
   */
  getData(e) {
    if(this.data.text.trim().length == 0 ) {
      wx.showToast({
        title: '请输入想要查询的商品名',
        icon: 'none'
      })
      return false
    }
    wx.showLoading({
      title: '获取数据中',
    })
    let index = e.detail.index || this.data.status
    this.setData({
      status: index
    })
    console.log(index)
    wx.request({
      url: `${wx.getStorageSync('url')}shopGoods`,
      data: {
        searchName: this.data.text,
        key: wx.getStorageSync('shopkey'),
        page:1
      },
      success: res => {
        wx.hideLoading()
        if (res.data.status == 200) {
          this.setAnimation()
          this.setData({
            data: res.data.data
          })
        } else if (res.data.status == 204) {
          wx.showToast({
            title: '没有您所查的商品',
            icon: 'none'
          })
          this.setData({
            data: []
          })
        }
      }
    })
  },

  /**
   * 获取更多数据
   * page: Number 页数
   * 
   */
  getMoreData(page) {
    wx.showLoading({
      title: '获取数据中',
    })
    wx.request({
      url: `${wx.getStorageSync('url')}shopGoods`,
      data: {
        searchName: this.data.text,
        key: 'iGhRmF',
        page: page
      },
      success: res => {
        wx.hideLoading()
        let data = this.data.data
        this.setData({
          page: ++page
        })
        if (res.data.status == 200) {
          data.push(...res.data.data)
          this.setData({
            data: data
          })
        } else if (res.data.status == 204) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          this.setData({
            data: data
          })
        }
      }
    })
  },
  
  /**
   * 是否显示底部导航栏
  */
  show(e) {
    console.log(e)
    this.setData({
      page: true
    })
  }
})