// supplier/index/index.js
Page({

  /**
   * 页面的初始数据
   * leaderInfo 门店信息
   * goodslist 门店商品列表
   * page 分页数(获取第多少多少页数据)
   * category 门店商品二级分类列表
   */
  data: {
    leaderInfo: {},
    goodslist: [],
    page: 1,
    category: [],
    id: 0
  },
  onLoad() {
    console.log(this.options)
    if (this.options.hasOwnProperty('leader_id')) {
      wx.setStorageSync('shareInfo', { sharePeople_id: this.options.userid, leader_id: this.options.leader_id })
      
    }
    if(this.options.hasOwnProperty('scene')){
      this.setData({
        id: this.options.scene
      })
    }
    if(this.options.hasOwnProperty('id')){
      this.setData({
        id: this.options.id
      })
    }

    this.getLeaderInfo()
    this.getLeaderGoodsList()
    this.getLeaderCategory()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initData()
    Promise.all([this.getLeaderInfo(), this.getLeaderGoodsList(), this.getLeaderCategory()]).then(res => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   * date 2020/4/15
   */
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shopInfo').name,
      path: `/supplier/index/index?id=${this.data.id}&leader_id=${wx.getStorageSync('area_id')}&userid=${wx.getStorageSync('user').id}`
    }
  },
  /**
   * 初始化页面数据
   * date 2020/4/3
   * @author kang
   */
  initData () {
    this.setData({
      page: 1,
      goodslist: [],
      leaderInfo: {},
      category: []
    })
  },
  /**
   * 获取门店信息
   * date 2020/4/3
   * @author kang
   */
  getLeaderInfo () {
    getApp().ajax({
      url: `shopSuppliers/${this.data.id}`,
      noLogin: true
    }).then(res => {
      this.setData({
        leaderInfo: {
          ...res.data,
          leader: {
            ...res.data.leader,
            authentication: res.data.leader.authentication.split(',')
          }
        }
      })
    })
  },
  /**
   * 获取门店商品列表
   * date 2020/4/3
   * @author kang
   */
  getLeaderGoodsList () {
    getApp().ajax({
      url: `shopSuppliersGoods/${this.data.id}`,
      data: {
        page: this.data.page,
        limit: 10
      },
      noLogin: true
    }).then(res => {
      this.setData({
        page: this.data.page + 1,
        goodslist: [...this.data.goodslist, ...res.data]
      })
    })
  },
  /**
   * 获取门店分类列表
   * date 2020/4/3
   * @author kang
   */
  getLeaderCategory () {
    getApp().ajax({
      url: `shopSuppliersCategory/${this.data.id}`
    }).then(res => {
      console.log(res.data)
      this.setData({
        category: res.data.flat()
      })
    })
  },
  /**
   * 路由跳转
   * date 2020/4/3
   * @author kang
   */
  to (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /**
   * 导航
   */
  navigation () {
    wx.openLocation({
      latitude: Number(this.data.leaderInfo.leader.latitude),
      longitude: Number(this.data.leaderInfo.leader.longitude),
    })
  }
})