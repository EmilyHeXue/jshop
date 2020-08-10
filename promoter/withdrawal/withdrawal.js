// pages/group/withdrawal/withdrawal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { name: '微信', value: 1 },
      { name: '支付宝', value: 2 },
      { name: '银行卡', value: 3 }
    ],
    bindValue:1,
    background: wx.getStorageSync('background'),
    money: 0,
    min_withdraw_money: 0,
    withdraw_fee_ratio: 0,
    balance: 0,
    poundage: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().postFormIds()
    getApp().setTheme()
    this.getData()
    wx.setNavigationBarTitle({
      title: '佣金提现',
    })
  },

  calculate (e){
    console.log(e.detail.value)
    this.setData({
      poundage: e.detail.value * this.data.withdraw_fee_ratio
    })
  },
  radioChange (e) {
    console.log(e.detail.value)
    this.setData({
      bindValue: e.detail.value
    })
  },
  getData () {
    wx.request({
      url: `${wx.getStorageSync('url')}shopBalance`,
      header:{
        "Access-Token": wx.getStorageSync('jwt')
      },
      success: res => {
        if(res.data.status === 200){
          this.setData({
            balance: res.data.data.balance,
            min_withdraw_money: res.data.data.min_withdraw_money,
            withdraw_fee_ratio: res.data.data.withdraw_fee_ratio
          })
        }
      }
    })
  },
  shopBalances (e) {
    if (e.detail.value.hasOwnProperty('realname')) {
      if (e.detail.value.realname.trim().length == 0){
        wx.showToast({
          title: `姓名不能为空`,
          icon: 'none'
        })
        return false;
      }
      if (e.detail.value.pay_number.trim().length == 0) {
        wx.showToast({
          title: `卡号或账号不能为空`,
          icon: 'none'
        })
        return false;
      }
    }
    if (parseFloat(e.detail.value.money) < this.data.min_withdraw_money){
      wx.showToast({
        title: `最低提现金额为${this.data.min_withdraw_money}元`,
        icon: 'none'
      })
      return false;
    }
    if(e.detail.value.send_type == 3){
      if(!/^([1-9]{1})(\d{14}|\d{18})$/.test(e.detail.value.pay_number.trim())){
        wx.showToast({
          title: '请输入正确的银行卡号',
          icon: 'none'
        })
        return false
      }
    }
    wx.request({
      url: `${wx.getStorageSync('url')}shopBalances`,
      method: 'post',
      header: {
        "Access-Token": wx.getStorageSync('jwt'),
        "content-type": 'application/x-www-form-urlencoded'
      },
      data:{
        ...e.detail.value
      },
      success: res => {
        console.log(res)
        if(res.data.status == 200){
          wx.showToast({
            title: '已提交申请',
            icon: 'none'
          })
          this.getData()
          this.setData({
            money: 0
          })
        }
      }
    })
  }
})