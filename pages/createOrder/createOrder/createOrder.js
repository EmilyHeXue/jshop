// pages/createOrder/createOrder/createOrder.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   * goodsData 路由传过来的商品数据
   * data.user_contact_id 收货地址id
   * data.goods 商品信息
   * data.voucher_id 红包id 
   * data.remark 备注
   * data.allPrice 商品总价
   * data.orderPrice 订单总价
  **/
  data: {
    goodsData: [],
    data: {
      user_contact_id: '',
      goods: '', 
      voucher_id: '', 
      remark: '', 
      allPrice: 0,
      orderPrice: 0,
      openid: wx.getStorageSync('openid')
    },
    address:[],
    youfei: '',
    page:false,
    background: '#ff0000',
    modelFlag: false,
    modelData:[
      { name: '姓名', data: ''},
      { name: '电话', data: '' }
    ],
    tabFlag: false,
    goodstype:0,
    tuanexpress: 0,
    distribution: 0,
    is_vip: false,
    discount_ratio: 1,
    pay_type: 2,
    recharge_balance: 0,
    balance_pay_is_open: false,
    is_estimated: false,
    estimated_service_time: '', //预约到货时间
    user_contact_id: 0,
    user_name: '',
    user_phone: '',
    session: '',
    useraddressid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.getSession()
    this.getUserInfo()
    getApp().postFormIds()
    wx.setNavigationBarTitle({
      title: '确认订单'
    })
    this.setData({
      balance_pay_is_open: wx.getStorageSync('Config').balance_pay,
      tabFlag: true,
      background: wx.getStorageSync('background'),
      goodsData: wx.getStorageSync('shopcartData'),
      is_vip: wx.getStorageSync('user').is_vip == 1 ? true : false,
      user_phone: wx.getStorageSync('user').phone,
      user_name: wx.getStorageSync('user').name,
      modelData: [
        { name: '姓名', data: wx.getStorageSync('user').name },
        { name: '电话', data: wx.getStorageSync('user').phone }
      ],
      is_estimated: wx.getStorageSync('Config').estimated_service_time_info.is_estimated == 1
    })
  },
  onHide () {
    this.setData({
      tabFlag: false
    })
  },

  /**
   * 选择收货地址
   */
  changeAddress (e) {
    console.error('createOrder',e.detail)
    this.setData({
      modelData: e.detail.address,
      ['data.user_contact_id']: e.detail.user_contact_id,
      useraddressid: e.detail.useraddressid,
      user_contact_id: e.detail.user_contact_id,
      tuanexpress: wx.getStorageSync('area').tuan_express_fee
    })
  },
  /**
   * 显示模态床
  */
  shopOrderPayXcx(e){
    this.setData({
      modelFlag: true
    })
  },
  /**
   * 创建订单
   */
  toOrder (order) {
    if ((this.data.goodstype != 0) &&  !wx.getStorageSync('area_id')){
      wx.showModal({
        title: '温馨提醒',
        content: `您未选择${wx.getStorageSync('leader_name')},无法使用团购功能,是否选择${wx.getStorageSync('leader_name')}`,
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/group/changegroup/changegroup/changegroup',
            })
          }
        }
      })
      return false
    }
    let data = {}
    let emplIds = [
      wx.getStorageSync('SubscribeTemplateId')['send_goods'], //发货提醒
      wx.getStorageSync('SubscribeTemplateId')['merchandise_arrival'],//预约到货通知
      wx.getStorageSync('SubscribeTemplateId')['pick_up_notice'] //取货通知
    ]
    data = {
      goods: JSON.stringify(this.data.goodsData), //商品信息
      type: this.data.goodstype,
      leader_id: wx.getStorageSync('area_id') || 0
    }
    if (wx.getStorageSync('tuanNum') != 0){ //判断是否团购订单
      data.group_type = 1,
      data.number = wx.getStorageSync('tuanNum')
      data.group_id = this.options.group_id || 0
      emplIds[1] = wx.getStorageSync('SubscribeTemplateId')['assemble']//拼团进度通知
      emplIds[2] = wx.getStorageSync('SubscribeTemplateId')['pick_up_notice']//取货通知
    }
    if (wx.getStorageSync('advance_sale') == 1) { //判断是否预售订单
      data.advance_sale = 1
      emplIds[1] = wx.getStorageSync('SubscribeTemplateId')['presale']//预售尾款支付提醒
      emplIds[2] = wx.getStorageSync('SubscribeTemplateId')['merchandise_arrival']//预约到货通知
    }
    if (this.options.bargin_id){ //判断是否砍价商品
      data.bargin_id = this.options.bargin_id
    }
    if (this.data.goodstype == 1) { // 如果收货方式为自提
      try {//判断姓名是否为空
        if (this.data.user_name.trim().length === 0) { 
          wx.showToast({
            title: '请填写用户姓名',
            icon: 'none'
          })
          return false
        }
      }catch(err) {
        wx.showToast({
          title: '请填写用户姓名',
          icon: 'none'
        })
        return false
      }
      try {//判断手机号是否为空
        if (this.data.user_phone.trim().length === 0) {
          wx.showToast({
            title: '请填写手机号',
            icon: 'none'
          })
          return false
        }
      } catch (err) {
        wx.showToast({
          title: '请填写手机号',
          icon: 'none'
        })
        return false
      }
      
      data.name = this.data.user_name
      data.phone = this.data.user_phone
      data.user_contact_id = 0
    }else {
      data.user_contact_id = this.data.useraddressid != 0 ? this.data.useraddressid : this.data.user_contact_id
      if(data.user_contact_id == undefined){
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none'
        })
        return false
      }
    }
    if (wx.getStorageSync('Config').estimated_service_time_info.hasOwnProperty('is_estimated')){
      if (wx.getStorageSync('Config').estimated_service_time_info.is_estimated == 1) { // 判断是否开启送达时间
        data.estimated_service_time = this.data.estimated_service_time
      }
    }
    if (wx.getStorageSync('SubscribeTemplateId')['merchandise_arrival']){ //判断是否有订阅消息id
      wx.requestSubscribeMessage({
        tmplIds: emplIds,
        success: res => {
          getApp().postSubscribeMessage(res)
          wx.showLoading({
            title: '订单提交中',
          })
          this.orderPay(data)
        },
        fail: err => {
          wx.showLoading({
            title: '订单提交中',
          })
          this.orderPay(data)
        }
      })
    }else{
      wx.showLoading({
        title: '订单提交中',
      })
      this.orderPay(data)
    }
  },
  /**
   * 调取支付
   * date 2020/4/9
   * @author kang
   */
  orderPay (data) {
    getApp().ajax({
      url: 'shopOrderPay1',
      data,
      method: 'post'
    }).then(res => {
      wx.setStorageSync('group_id', res.data.group_id)
      if(res.data.hasOwnProperty('bool') && res.data.bool == true){
        wx.redirectTo({
          url: `/pages/gopay/gopay?order_sn=${res.data.order_sn}&order_price=${this.data.allPrice}&group_id=${res.data.group_id}&group_number=${res.data.group_number}&is_advance_sale=1`
        })
      }else if(this.options.hasOwnProperty('solitaire')){
        wx.redirectTo({
          url: `/pages/gopay/gopay?order_sn=${res.data.order_sn}&order_price=${this.data.allPrice}&group_id=${res.data.group_id}&group_number=${res.data.group_number}&solitaire=${this.options.solitaire}`
        })
      }else{
        wx.redirectTo({
          url: `/pages/gopay/gopay?order_sn=${res.data.order_sn}&order_price=${this.data.allPrice}&group_id=${res.data.group_id}&group_number=${res.data.group_number}`
        })
      }
      
      return false
      this.toPay(res.data.order_sn, wx.getStorageSync('tuanNum') != 0, res.data.group_id, res.data.group_number)
    })
  },
  /**
   * 付款
   * @property {string} order_sn - 订单编号
   * @property {boolean} is_tuan - 是否拼团订单
   * @property {string | number} group_id - 拼团id
   */
  toPay(order_sn, is_tuan, group_id, group_number) {
    getApp().ajax({
      // url: `shopGoPay/${order_sn}`,
      url: `shopGoPay1/${order_sn}`,
      method: 'post',
      data: {
        type: this.data.pay_type
      }
    }).then(res => {
      if(this.data.pay_type == 2){
        this.requestPayment(res.data, order_sn, is_tuan, group_id, group_number)
      }else{
        this.getUserInfo()
        wx.setStorageSync('shopcartData', [])
        if (is_tuan){
          this.isMeet(group_id, group_number, order_sn)
        }else{
          wx.redirectTo({
            url: `/pages/payOk/payOk/payOk?order_sn=${order_sn}`,
          })
        }
      }
    })
  },
  /**
   * 调取微信支付
   * @property {object} e - 订单编号
   * @property {string} order_sn - 订单编号
   * @property {boolean} is_tuan - 是否拼团订单
   * @property {string | number} group_id - 拼团id
   */
  requestPayment(e, order_sn, is_tuan, group_id, group_nums){
    wx.requestPayment({
      timeStamp: e.timeStamp,
      nonceStr: e.nonceStr,
      package: e.package,
      signType: e.signType,
      paySign: e.paySign,
      success: response => {
        wx.setStorageSync('shopcartData', [])
        if (is_tuan){
          this.isMeet(group_id, group_nums, order_sn)
        }else{
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
  },
  error () {
    this.setData({
      modelFlag: false
    })
  },
  ok() {
    this.setData({
      modelFlag: false
    })
    this.toOrder()
  },
  footerFlag (e) {
    this.setData({
      flag: true
    })
  },
  goodstype(e){//商品配送方式
    console.log('商品配送方式', e.detail)
    this.setData({
      goodstype: e.detail.type == 1 ? 1 : e.detail.type == 2 ? 2 : 0,
      tuanexpress: wx.getStorageSync('area').tuan_express_fee,
      user_contact_id: e.detail.type == 1 ? 1 : e.detail.type == 2 ? 2 : e.detail.useraddressid,
      useraddressid: e.detail.useraddressid
    })
    this.computeryoufei()
  },
  gettuanexpress(e){//获取团长配送费
    console.log('获取团长配送费',e.detail)
    this.setData({
      tuanexpress: e.detail.tuan_express_fee
    })
    this.computeryoufei()
  },
  /**
   * 计算邮费
   */
  computeryoufei(){
    if (this.data.goodstype == 0){
      this.setData({
        ['data.orderPrice']: Math.round(((this.data.data.allPrice * 1) + (this.data.youfei * 1)) * 100) / 100,
        distribution: this.data.youfei
      })
      console.log((this.data.data.orderPrice * 1) + (this.data.youfei * 1))
    } else if (this.data.goodstype == 1){
      this.setData({
        ['data.orderPrice']: Math.round((this.data.data.allPrice * 1) * 100) / 100,
        distribution: 0
      })
    }else if(this.data.goodstype == 2){
      this.setData({
        ['data.orderPrice']: Math.round(((this.data.data.allPrice * 1) + (this.data.tuanexpress) * 1) *100) /100,
        distribution: this.data.tuanexpress,
        ['goodsData[0].youfei']: this.data.tuanexpress
      })
    }
  },
  /**
   * 更改支付方式
   */
  change_pay_type(e){
    this.setData({
      pay_type: e.detail.value
    })
  },
  /**
   * 获取用户信息
   * headlog 头像
   * nickName 昵称
   * integral 积分
  **/
  getUserInfo() {
    app.ajax({
      url: 'shopUserInfo'
    }).then(res => {
      this.setData({
        recharge_balance: res.data.recharge_balance,
        user_name: res.data.name
      })
    })
  },

  /**
   * 判断拼团人数是否达到要求
   * @property {string | number} group_id - 拼团id
   * @property {string} order_sn - 订单编号
   * @property {number} group_number - 拼团人数
   */
  isMeet(group_id, group_number, order_sn) {
    if (group_number == wx.getStorageSync('tuanNum')){
      wx.redirectTo({
        url: `/pages/spellGroup/okGroup/okGroup?id=${this.options.group_id != 0 ? this.options.group_id : group_id}&order_sn=${order_sn}`,
      })
    }else{
      wx.redirectTo({
        url: `/pages/spellGroup/willGroup/willGroup?id=${this.options.group_id != 0 ? this.options.group_id : group_id}&order_sn=${order_sn}`,
      })
    }
  },
  /**
   * 选择送达时间
   */
  chooseEstimated (e) {
    this.setData({
      estimated_service_time: e.detail.estimated_service_time
    })
  },
  /**
   * 更新商品信息
   */
  update (e) {
    console.log(e)
    let price = e.detail.data.map(i => {
      return {
        discount_ratio: i.discount_ratio || 0,
        leader_discount: i.leader_discount || 0,
        coupone_price: i.coupone_price || 0,
        youfei: Number(i.youfei) || 0,
        reduction_decrease: Number(i.reduction_decrease) || 0,
        price: i.list.map(i => i.price * i.number).reduce((pre, cur, index) => {
          return Number(pre) + Number(cur)
        })
      }
    }).map(i => i.price - i.discount_ratio - i.coupone_price + Number(i.youfei) - i.reduction_decrease).reduce((pre, cur, index) => {
      return Number(pre) + Number(cur)
    })
    console.log(price)
    this.setData({
      goodsData: e.detail.data,
      allPrice: Math.round(price * 100) / 100
    })
  },
  /**
   * 更改用户姓名
   */
  changename (e) {
    console.log(e.detail)
    this.setData({
      user_name: e.detail.data,
      modelData: [{ name: '姓名', data: e.detail.data }, { name: '手机号', data: this.data.user_phone } ]
    })
  },
  /**
   * 更改用户电话
   */
  changephone(e) {
    this.setData({
      user_phone: e.detail.data,
      modelData: [{ name: '姓名', data: this.data.user_name }, { name: '手机号', data: e.detail.data }]
    })
  },
  /**
   * 获取session
   */
  getSession () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        getApp().ajax({
          url: 'shopTuanMiniprogramr',
          data: {
            code: res.code,
            key: wx.getStorageSync('shopkey'),
            type: 'miniprogram'
          }
        }).then(res => {
          this.setData({
            session: res.data.session_key
          })
        })
      }
    })
  }
})