// pages/gopay/gopay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance_pay_is_open: false,
    recharge_balance: 0,
    pay_type: 2,
    bg: '',
    order_price: 192
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '确认订单信息',
    })
    getApp().setTheme()
    console.log(options)
    Promise.all([this.getPlugin(), this.getUserInfo()]).then(res => {
      this.setData({
        recharge_balance: res[1].data.recharge_balance,
        balance_pay_is_open: res[0].data.balance_pay == 1 && !options.hasOwnProperty('is_advance_sale'),
        order_price: this.options.order_price,
        bg: wx.getStorageSync('background')
      })
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 获取店铺配置
   * date 2020/4/26
   * @author kang
   */
  getPlugin(){
    return getApp().ajax({
      url: `shopPlugin`,
      data: {
        key: wx.getStorageSync('shopkey')
      }
    })
  },
  /**
   * 获取用户信息
   * date 2020/4/26
   * @author kang
   */
  getUserInfo(){
    return getApp().ajax({
      url: `shopUserInfo`
    })
  },
  /**
   * 更改支付方式
   */
  change_pay_type(e) {
    this.setData({
      pay_type: e.detail.value
    })
  },
  onHide(){
    wx.setStorageSync('tuanNum', 0)
  },
  onUnload(){
    wx.setStorageSync('tuanNum', 0)
  },
  /**
   * 订阅消息
   */
  subscribeMessage(){
    let emplIds = [
      wx.getStorageSync('SubscribeTemplateId')['refund'], //退款提醒
      wx.getStorageSync('SubscribeTemplateId')['pick_up_notice'] //取货通知
    ]
    console.log(emplIds)
    if (wx.getStorageSync('SubscribeTemplateId')['refund']){ //判断是否有订阅消息id
      wx.requestSubscribeMessage({
        tmplIds: emplIds,
        success: res => {
          console.log('1')
          getApp().postSubscribeMessage(res)
          this.toPay({})
        },
        fail: err => {
          console.log('2')
          this.toPay({})
        }
      })
    }else{
      this.toPay({})
    }
  },
  /**
   * 付款
   * @property {string} order_sn - 订单编号
   * @property {boolean} is_tuan - 是否拼团订单
   * @property {string | number} group_id - 拼团id
   */
  toPay({ 
    order_sn = this.options.order_sn, 
    is_tuan = wx.getStorageSync('tuanNum') != 0, 
    group_id = this.options.group_id, 
    group_number = this.options.group_number}) {
    getApp().ajax({
      url: `shopGoPay1/${order_sn}`,
      method: 'post',
      data: {
        type: this.data.pay_type
      }
    }).then(res => {
      if (this.data.pay_type == 2) {
        this.requestPayment(res.data, order_sn, is_tuan, group_id, group_number)
      } else {
        this.getUserInfo()
        wx.setStorageSync('shopcartData', [])
        if (is_tuan) {
          this.isMeet(group_id, group_number, order_sn)
        } else if(this.options.hasOwnProperty('solitaire')){
          wx.navigateTo({
            url: `/solitaire/mysolitaireshare/mysolitaireshare?id=${this.options.solitaire}&price=${this.data.order_price}`,
          })
        } else {
          wx.redirectTo({
            url: `/pages/payOk/payOk/payOk?order_sn=${order_sn}`,
          })
        }
      }
    })
  },
  /**
   * 判断拼团人数是否达到要求
   * @property {string | number} group_id - 拼团id
   * @property {string} order_sn - 订单编号
   * @property {number} group_number - 拼团人数
   */
  isMeet(group_id, group_number, order_sn) {
    if (group_number == wx.getStorageSync('tuanNum')) {
      wx.redirectTo({
        url: `/pages/spellGroup/okGroup/okGroup?id=${this.options.group_id != 0 ? this.options.group_id : group_id}&order_sn=${order_sn}`,
      })
    } else {
      wx.redirectTo({
        url: `/pages/spellGroup/willGroup/willGroup?id=${this.options.group_id != 0 ? this.options.group_id : group_id}&order_sn=${order_sn}`,
      })
    }
  },
  /**
   * 调取微信支付
   * @property {object} e - 订单编号
   * @property {string} order_sn - 订单编号
   * @property {boolean} is_tuan - 是否拼团订单
   * @property {string | number} group_id - 拼团id
   */
  requestPayment(e, order_sn, is_tuan, group_id, group_nums) {
    wx.requestPayment({
      timeStamp: e.timeStamp,
      nonceStr: e.nonceStr,
      package: e.package,
      signType: e.signType,
      paySign: e.paySign,
      success: response => {
        wx.setStorageSync('shopcartData', [])
        if (is_tuan) {
          this.isMeet(group_id, group_nums, order_sn)
        } else {
          wx.redirectTo({
            url: `/pages/payOk/payOk/payOk?order_sn=${order_sn}`,
          })
        }
      },
      fail: error => {
        console.log(error)
        wx.redirectTo({
          url: `/pages/order/order/order`,
        })
      }
    })
  }
})