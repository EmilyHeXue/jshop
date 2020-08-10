// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    leader: {},
    background: '',
    code: '',
    codeLayer: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      backgroundColor: '#373D4B',
      frontColor: '#ffffff',
    })
    this.getshopBalance()
    this.tuanLeader()
    this.getDiy()
    this.getShopLeaderTotalCensus()
    this.tuanCenter()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 获取余额
   */
  getshopBalance() {
    getApp().ajax({
      url: 'shopBalance',
      data: {
        type: 1
      }
    }).then(res => {
      this.setData({
        balance: res.data.balance,
        avatar: wx.getStorageSync('user').avatar
      })
    })
  },
  /**
   * 获取团长信息
   */
  tuanLeader() {
    getApp().ajax({
      url: 'tuanLeader'
    }).then(res => {
      this.setData({
        leader: {
          ...res.data,
          leader_level: wx.getStorageSync('user').level_name
        }
      })
    })
  },
  go(e){
    console.log()
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /**
   * 
   * @param {*} e 
   */
  goInfo (e) {
    if (wx.getStorageSync('Config').leader_level){
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  /**
   * 获取团自定义名词
   */
  getDiy(){
    getApp().ajax({
      url: 'shopTuanConfig',
      data:{
        key: wx.getStorageSync('shopkey')
      }
    }).then(res => {
      wx.setStorageSync('leader_name', res.data.leader_name) //团长名词
      this.setData({
        announcement: res.data.leader_name
      })
      wx.setNavigationBarTitle({
        title: `${res.data.leader_name}中心`
      })
    })
  },
  /**
   * 今日详情
   * @member {Object} orderToday 今日团长订单数据
   * @member {String} orderToday.allOrder 总订单数
   * @member {String} orderToday.payNums 付款人数
   * @member {String} orderToday.willPrice 预估收入
   * @member {String} orderToday.effectiveOrder 有效订单
   */
  tuanCenter(){
    getApp().ajax({
      url: 'tuanCenter'
    }).then(res => {
      let data = {
        ...res.data
      }
      this.setData({
        data,
        background: wx.getStorageSync('background')
      })
    })
  },
  /**
   * 底部数据
   * @member {Object} list 
   * @member {String} list.order 总订单数
   * @member {String} list.count 总销售
   * @member {String} list.balance 总佣金
   * @member {String} list.user 总用户数
   */
  getShopLeaderTotalCensus(){
    getApp().ajax({
      url: 'shopLeaderTotalCensus'
    }).then(res => {
      let list = {
        order: res.data.order,
        count: res.data.count,
        balance: res.data.balance,
        user: res.data.user
      }
      this.setData({
        list
      })
    })
  },
  /**
   * 调取二维码扫描
   */
  toscan(){
    wx.scanCode({
      success: res => {
        if (wx.getStorageSync('user').is_self) {
          if (JSON.parse(res.result).order_sn){
            this.tuanConfirm(JSON.parse(res.result).order_sn)
          }else{
            wx.navigateTo({
              url: `/group/groupmenbersorder/groupmenbersorder/groupmenbersorder?uid=${JSON.parse(res.result).uid}`,
            })
          }
        }
      }
    })
  },
  /**
   * 核销订单
   * @param {String} order_sn 
   */
  tuanConfirm(order_sn) {
    getApp().ajax({
      url: 'tuanConfirm',
      method: 'put',
      data: {
        order_sn: order_sn
      }
    }).then(res => {
      wx.showToast({
        title: '核销成功',
        icon: 'none'
      })
    })
  },
  /**
   * 输入取货吗
   */
  changIndex (e){
    this.setData({
      code: e.detail.value
    })
  },
  /**
   * 核销码核销
   */
  codetoget () {
    getApp().ajax({
      url: 'tuanConfirm',
      method: 'put',
      data: {
        pick_up_code: this.data.code
      }
    }).then(res => {
      wx.showToast({
        title: '核销成功',
        icon: 'none'
      })
      this.showLayer()
    }).catch(err => {
      wx.showToast({
        title: '核销码错误',
        icon: 'none'
      })
    })
  },
  /**
   * 显示提示窗
   */
  showLayer (){
    this.setData({
      codeLayer: !this.data.codeLayer
    })
  }
})