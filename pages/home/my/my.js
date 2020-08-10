
// pages/home/my/my.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   * title 导航条名称
   * headlog 头像
   * nickName 昵称
   * integral 积分
   * show 是否显示登陆窗口
   * menus 菜单列表
  **/
  data: {
    title: '个人中心',
    headlog:'',
    nickName:'',
    integral:100,
    show:false,
    menus:[
      { name: '优惠券', imgUrl: '/images/my/menu/coupons.png', url: '../coupons/coupons/coupons' },
      { name: '购物车', imgUrl: '/images/my/menu/shopCart.png', url: '/pages/shopCart/shopCart/shopCart' },
      //{ name: '到店付', imgUrl: '/images/my/menu/blancepay.png', url: '/pages/home/balancePay/balancePay' },
      //{ name: '打卡签到', imgUrl: '/images/my/menu/clockIn.png', url: '/pages/clockIn/clockIn/clockIn' },
      //{ name: '收货地址', imgUrl: '/images/my/menu/address.png', url: '../address/address' }
    ],
    orderMenus: [
      { name: '待付款', src: '/images/my/orderMenus/pay.png', url: '/pages/order/order/order', id:'0' },
      { name: '待发货', src: '/images/my/orderMenus/delivery.png', url: '/pages/order/order/order', id: '1' },
      { name: '待收货', src: '/images/my/orderMenus/get.png', url: '/pages/order/order/order', id: '3' },
      { name: '待评价', src: '/images/my/orderMenus/ok.png', url: '/pages/order/order/order', id: '6' },
      { name: '售后订单', src: '/images/my/orderMenus/deliveried.png', url: '/pages/returnOrder/returnOrder/returnOrder', id: '0' },
    ],
    background:'',
    nabigationFontColor: '',
    page:false,
    phone: '',
    copyright: '',
    is_leader: false,
    sce:'',
    qrcode:'',
    qrCodeFlag: false,
    balance: 0.00,
    score: 0,
    vip_name:'',
    discount_ratio: 9,
    recharge_balance: 0.00,
    layerFlag: false,
    Vip_integral: false,
    Vip_payment: false,
    level: 0,
    leader_name: '',
    a: '0',
    b: '0',
    c: '0',
    version: '1.4.55'
  },
  onLoad(options){
    this.setData({
      sce: decodeURIComponent(options.scene),
      background: wx.getStorageSync('background'),
      avatar: wx.getStorageSync('avatar'),
      leader_name: wx.getStorageSync('leader_name')
    })
  },
  onPullDownRefresh(){
    this.getUserInfo();
  },
  /**
   * 跳转地址
   * url 跳转用地址,该地址不可是tabbar内的地址,否则会跳转失败
  **/
  go(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  setConfig(){
    this.setData({
      ...wx.getStorageSync('Config')
    })
  },
  onShow: function () {
    console.log('wiwjwiji')
    this.getUserInfo();
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    this.shopAppInfo()
    this.setConfig()
    this.getCopyright()
    this.shopUserOrder()
    this.setData({
      nabigationFontColor: wx.getStorageSync('nabigationFontColor'),
      Vip_integral: wx.getStorageSync('Config').user_vip == 2,
      Vip_payment: wx.getStorageSync('Config').user_vip == 1
    })
  },
  /**
   * 重新获取用户信息
  **/
  getjwt(data){
    this.getUserInfo();
  },
  
  /**
   * 获取用户信息
   * headlog 头像
   * nickName 昵称
   * integral 积分
  **/
  getUserInfo(){
    console.log('will wo')
    app.ajax({
      url: 'shopUserInfo',
      noLogin: true
    }).then(res => {
      this.setData({
        headlog: res.data.avatar,
        nickName: res.data.nickname,
        is_leader: res.data.is_leader,
        balance: res.data.balance,
        score: res.data.score,
        vip_name: res.data.is_vip == 1 ? res.data.vip_name : false,
        discount_ratio: res.data.discount_ratio * 10,
        recharge_balance: res.data.recharge_balance,
        level: res.data.level
      })
      wx.setStorageSync('avatar', res.data.avatar)
      wx.setStorageSync('union_id', res.data.union_id)
      wx.setStorageSync('user', res.data)
      wx.stopPullDownRefresh()
    })
  },
  footerFlag (e) {
    console.log(e)
    this.setData({
      page: true
    })
  },
  goOrder (e){
    let url = `${e.currentTarget.dataset.url}?id=${e.currentTarget.dataset.id}`
    wx.navigateTo({
      url: url,
    })
  },

  /**
   * 
   */
  showService () {
    wx.showActionSheet({
      itemList: ['拨打电话','在线客服'],
      success: res => {
        console.log(res.tapIndex)
        if(res.tapIndex == 0){
          wx.makePhoneCall({
            phoneNumber: this.data.phone,
          })
        }else{
          wx.navigateTo({
            url: '/pages/webview/webview',
          })
        }
      }
    })
  },
  /**
   * 获取店铺信息
   */
  shopAppInfo () {
    wx.request({
      url: `${wx.getStorageSync('url')}ShopAppInfo`,
      data:{
        key: wx.getStorageSync('shopkey')
      },
      success: res => {
        console.log(res.data)
        if(res.data.status == 200){
          this.setData({
            phone: res.data.data.phone
          })
        }
      }
    })
  },
  setbackground (e){
    this.setData({
      background: e.detail.color
    })
  },
  Toqiandao(){
    wx.navigateTo({
      url: '/pages/clockIn/clockIn/clockIn',
    })
  },
  ToTuanzhang(){//进入团长中心
    if (wx.getStorageSync('user').state == 1){
      wx.showToast({
        title: `你已被冻结${wx.getStorageSync('leader_name')}功能,请联系商家进行处理`,
        icon: 'none'
      })
      return false
    }
    wx.redirectTo({
      url: '/group/groupcenter/groupcenter/groupcenter',
    })
  },
  creategroup(){//跳转到申请团长页面
    wx.navigateTo({
      url: '/group/groupbrochure/groupbrochure',
    })
  },
  getQrcode(){//获取提货码
    wx.showLoading({
      title: '',
    })
    app.ajax({
      url: 'shopOrderQrcode',
      data: {
        uid: wx.getStorageSync('user').id
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      this.setData({
        qrcode: res.data,
        qrCodeFlag: !this.data.qrCodeFlag
      })
    })
  },
  showQrCode(){
    if(this.data.qrcode == ''){
      this.getQrcode()
    }else{
      this.setData({
        qrCodeFlag: !this.data.qrCodeFlag
      })
    }
    
  },
  getCopyright(){
    getApp().getColor().then(res => {
      this.setData({
        copyright: res.copyright
      })
    })
  },
  goIntegralMall(){
    wx.navigateTo({
      url: '/pages/integralMall/index/index/index',
    })
  },
  changeLayerFlag(){
    console.log('aasasas')
    this.setData({
      layerFlag: !this.data.layerFlag
    })
  },
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  },
  tomendian() {
    wx.navigateTo({
      url: '/pages/home/balancePay/balancePay',
    })
  },
  /**
   * 获取订单数量
   */
  shopUserOrder () {
    getApp().ajax({
      url: 'shopUserOrder',
      noLogin: true
    }).then(res => {
      console.error('报错了哟',res)
      this.setData({
        a: res.data.a,
        b: res.data.b,
        c: res.data.c,
      })
    })
  }
})