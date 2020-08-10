// pages/orderItem/orderItem/orderItem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_sn:'',
    title: '订单详情',
    addressData: '收货地址',
    goodsData: '商品信息',
    orderItem: '订单信息',
    logisticsInformation: '物流信息',
    status: '',
    page: false,
    show:false,
    express_type: 0,
    groupphone: 0,
    groupaddr:''
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (option) {
    getApp().postFormIds()
    wx.setNavigationBarTitle({
      title: this.data.title,
    })
    this.setData({
      order_sn:option.order_sn
    })
  },
  onShow(){
    this.getData()
  },
  getData() {
    console.log(this.options)
    wx.showLoading({
      title: '获取数据中',
    })
    wx.request({
      url: `${wx.getStorageSync('url')}shopOrder/${this.data.order_sn}`,
      header: {
        'Access-Token': wx.getStorageSync('jwt'),
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if(res.data.status == 200){
          let addressData = {
            name: res.data.data.name,
            phone: res.data.data.phone,
            address: res.data.data.address,
          }
          let status = res.data.data.status
          let goods = {
            data: res.data.data.order,
            orderAllPrice: (res.data.data.total_price * 1 - res.data.data.express_price * 1).toFixed(2),
            express_price: res.data.data.express_price,
            express_type: res.data.data.express_type,
            voucher: parseFloat(res.data.data.voucher_price.price).toFixed(2),
            payment_money: res.data.data.payment_money,
            total_price: parseFloat(res.data.data.total_price * 1 - res.data.data.voucher_price.price * 1).toFixed(2),
            reduction_achieve: res.data.data.reduction_achieve
          }
          let goodsData = goods
          let orderItem = { //订单
            pay_time: res.data.data.weixinOrder.pay_time == '' ? '未付款' : res.data.data.weixinOrder.pay_time,
            create_time: res.data.data.create_time,
            send_out_time: res.data.data.send_out_time != '' ? res.data.data.send_out_time : '未发货',
            order_sn: res.data.data.order_sn,
            transaction_id: res.data.data.weixinOrder.transaction_id != null ? res.data.data.weixinOrder.transaction_id : '未付款'
          }
          let logisticsInformation = res.data.data.id //订单id
          this.setData({
            addressData: addressData,
            goodsData: goodsData,
            orderItem: orderItem,
            logisticsInformation: logisticsInformation,
            status: status,
            show: true,
            express_type: res.data.data.express_type,
            groupphone: res.data.data.hasOwnProperty('leader') ? res.data.data.leader.phone : '',
            groupaddr: res.data.data.hasOwnProperty('leader') ? res.data.data.leader.addr : '',
            is_advance: res.data.data.is_advance
          })
        }
        wx.hideLoading()
      }
    })
  },
  footerFlag (e) {
    this.setData({
      page: true
    })
  }
})