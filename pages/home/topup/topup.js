// pages/home/topup/topup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseindex: 0,
    price: 100,
    balance_id: '',
    recharge_balance: 0,
    balanceList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: '余额充值',
    })
    this.getUserInfo()
    this.getBalanceList()
  },
  /**
   * 获取个人信息
   */
  getUserInfo(){
    getApp().ajax({
      url: 'shopUserInfo'
    }).then(res => {
      this.setData({
        recharge_balance: res.data.recharge_balance
      })
    })
  },
  /** 
   * 切换选项
   */
  change(e){
    console.log(e.currentTarget.dataset.index)
    let price = ''
    if (e.currentTarget.dataset.index != -1){
      price = e.currentTarget.dataset.price
    }
    this.setData({
      chooseindex: e.currentTarget.dataset.index,
      price,
      balance_id: e.currentTarget.dataset.id
    })
  },
  /**
   * 获取充值列表
   */
  getBalanceList(){
    getApp().ajax({
      url: 'balanceList'
    }).then(res => {
      console.log(res)
      this.setData({
        balanceList: res.data,
        price: res.data[0].money,
        balance_id: res.data[0].id
      })
    })
  },
  /**
   * 用户自定义充值金额
   */
  changePrice(e) {
    console.log(e.detail.value)
    this.setData({
      price: e.detail.value
    })
  },
  /**
   * 创建充值订单
   */
  createOrder(){
    console.log(this.data)
    if(this.data.price == ''){
      wx.showToast({
        title: '请输入正确的金额',
        icon: 'none'
      })
      return false
    }
    getApp().ajax({
      url: 'balanceAccess',
      method: 'post',
      data: {
        money: this.data.price,
        balance_id: this.data.balance_id
      }
    }).then(res => {
      console.log(res.data)
      this.topay(res.data)
    })
  },
  /**
   * 支付
   */
  topay(order){
    getApp().ajax({
      url: `balanceAccess/${order}`,
      method: 'post',
      data: {
        pay_type: 2
      }
    }).then(res => {
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        success: res => {
          this.getUserInfo()
          wx.showToast({
            title: '充值成功',
            icon: 'none'
          })
        }
      })
    })
  }
})