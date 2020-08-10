//获取应用实例
const app = getApp()
Page({
  // 页面的初始数据
  data: {
    bannerHeight: 140,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    indicatorColor: 'rgba(255,255,255,.3)',
    indicatorActiveColor: 'rgba(255,255,255,.9)',
    dataList: [],
    groupFlag: false,
    is_bool:true,
    close_pic_url: '',
    height: 0,
    top:0,
    page: 0,
    background: '',
    leave: false,
    is_new_people: false,
    isLogin: false,
    leader_id: 0,
    is_group_buying: false,
    my_mini_info: false,
    loading: false,
    default_pic_url: '',
    reload: false,
    cartUpdata: 0
  },
  btnGetInfo(e) {
    wx.showLoading({ title: '加载中...' })
      app.ajax({
        url: 'shopDecorations',
        data: {
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        wx.hideLoading();
        console.log(res.data.info)
        this.setData({
          dataList: res.data.info,
          reload: true,
          indexBg: res.data.bg_color
        })
        wx.setStorageSync('indexData', res.data.info)
        wx.setStorageSync('indexBg', res.data.bg_color)
        this.isNewPeople()
        wx.stopPullDownRefresh()
      }).catch(res => {
        console.log('获取模板失败', res)
        wx.hideLoading();
        wx.showToast({
          title: '请在 设置 => 店铺装修 中启用模板',
          icon: 'none'
        })
        wx.stopPullDownRefresh()
      })
    
  },
  onLoad(options){
    console.log('qiangqiang')
    if (this.options.hasOwnProperty('id')) {
      wx.setStorageSync('shareInfo', { sharePeople_id: this.options.id, leader_id: this.options.leader_id })
      this.setData({
        leader_id: this.options.leader_id
      })
    }
    if (this.options.hasOwnProperty('scene')) {
      let obj = Object.fromEntries(decodeURIComponent(this.options.scene).split('&').map(i => i.split('=')))
      wx.setStorageSync('shareInfo', { sharePeople_id: obj.id, leader_id: obj.leader_id })
      this.setData({
        leader_id: obj.leader_id
      })
    }
    getApp().login().then(res => {
      this.getUserInfo()
      getApp().bindGroup()
    })
    if (!wx.getStorageSync('indexData')) { //判断是否缓存了首页数据
      this.btnGetInfo()
    } else {
      this.setData({
        dataList: wx.getStorageSync('indexData'),
        indexBg: wx.getStorageSync('indexBg')
      })
      wx.hideLoading();
    }
  },
  onPullDownRefresh () {
    this.btnGetInfo()
  },
  // 生命周期函数--监听页面加载
  onShow: function (options) {
    this.setData({
      background: wx.getStorageSync('background'),
      reload: true
    })
    this.getQuanXian()
  },
  onHide(){
    this.setData({
      groupFlag: false,
      leave: true
    })
  },
  onUnload(){
    this.setData({
      groupFlag: false,
      leave: true
    })
  },
  /**
   * 分享
   */
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('shopInfo').name,
      path: `/pages/index/index/index?id=${wx.getStorageSync('user').id}&leader_id=${wx.getStorageSync('area_id')}`,
      imageUrl: this.data.default_pic_url
    }
  },
  getUserInfo() { // 获取用户信息
    getApp().ajax({
      url: 'shopUserInfo',
      noLogin: true
    }).then(res => {
      wx.setStorageSync('avatar', res.data.avatar)
      wx.setStorageSync('user', res.data)
      this.setData({
        isLogin: true
      })
    })
  },
  showColose(e){
    this.setData({
      is_bool: e.detail.is_bool,
      close_pic_url: e.detail.close_pic_url
    })
  },
  onReachBottom(){
    this.setData({
      page: this.data.page + 1
    })
  },
  isNewPeople () {
    wx.request({ 
      url: wx.getStorageSync('url') + 'shopNewUserVoucher', 
      header: {
        "Access-Token": wx.getStorageSync('jwt') 
      },
      success: res => {
        console.log(res)
        if(res.data.status == 200){
          this.setData({
            is_new_people: true
          })
        }
      }
    })
  },
  getVoucherAll(){
    this.setData({
      is_new_people: false
    })
  },
  getQuanXian() {
    getApp().merchantPlugin().then(res => {
      console.log(res)
      this.setData({
        groupFlag: res.group_buying,
        my_mini_info: res.my_mini_info,
        default_pic_url: res.default_pic_url
      })
    })
  },
  changLoading (e) {
    this.setData({
      loading: e.detail.status,
      reload: false
    })
  },
  cartUpdata() {
    this.setData({
      cartUpdata: this.data.cartUpdata + 1
    })
  },
  setbg(e){
    console.error(e)
    this.setData({
      background: e.detail.color
    })
  }
})