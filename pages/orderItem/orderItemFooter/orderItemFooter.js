// pages/orderItem/orderItemFooter/orderItemFooter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    order_sn:{
      type:String,
      observer (val) {
        console.log(val,'刺激')
        this.setData({
          show: true
        })
      }
    },
    status:{
      type:Number
    },
    express_type:{
      type: Number,
      observer(val){
        console.log(val)
      }
    },
    goodsData: {
      type: Object
    },
    is_advance:{
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    color: wx.getStorageSync('background'),
    show:false,
    qrcode:'',
    qrcodeShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 查看物流
     * order_sn 订单编号
     */
    checkLogistics () {
      let order_sn = this.data.order_sn
      wx.navigateTo({
        url: `/pages/logisticsInformation/logisticsInformation/logisticsInformation?order_sn=${order_sn}`,
      })
    },
    /**
     * 确认收货
     * order_sn 订单编号
     */
    getGoods () {
      let order_sn = this.data.order_sn
      if (this.data.express_type === 0){
        this.shopOrderGoods(order_sn)
      }else{
        this.toQrCode(order_sn)
      }
    },
    //生成二维码
    toQrCode(order_sn) {
      wx.request({
        url: `${wx.getStorageSync('url')}shopOrderQrcode`,
        header: {
          'Access-Token': wx.getStorageSync('jwt'),
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          order_sn: order_sn
        },
        success: res => {
          console.log(res)
          this.setData({
            qrcode: res.data.data,
            qrcodeShow: true
          })
        }
      })
    },
    show(){
      this.setData({
        qrcodeShow: !this.data.qrcodeShow
      })
    },
    //自己确认收货
    shopOrderGoods(order_sn){
      wx.showModal({
        title: '确认收货',
        content: '是否收到货物',
        success: res => {
          if (res.confirm) {
            wx.request({
              url: `${wx.getStorageSync('url')}shopOrderGoods`,
              method: 'put',
              header: {
                'Access-Token': wx.getStorageSync('jwt'),
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                order_sn: order_sn
              },
              success: res => {
                if (res.data.status == 200) {
                  wx.showToast({
                    title: '收货完成',
                  })
                  this.triggerEvent('getData', 'ok')
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none'
                  })
                }
              }
            })
          } else {
            console.log('不取消该订单')
          }
        }
      })
    },
    /**
     * 退货
     * order_sn 订单编号
     */
    returnGoods () {
      let order_sn = this.data.order_sn
      wx.showModal({
        title: '退款',
        content: '亲，真的要退款吗',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: `/pages/applicationForDrawback/applicationForDrawback/applicationForDrawback?order_sn=${order_sn}`,
            })
          } else {
            
          }
        }
      })
    },
    /**
     * 删除订单
     * order_sn 订单编号
     */
    delOrder () {
      let order_sn = this.data.order_sn
      wx.showModal({
        title: '删除订单',
        content: '是否删除该订单',
        success: res => {
          if (res.confirm) {
            wx.request({
              url: `${wx.getStorageSync('url')}shopOrder/${this.data.order_sn}`,
              method: 'delete',
              header: {
                'Access-Token': wx.getStorageSync('jwt'),
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: res => {
                if(res.data.status == 200){
                  wx.navigateBack({
                    url:'/pages/order/order/order'
                  })
                  wx.showToast({
                    title: '删除成功',
                    icon: 'none'
                  })
                }
              }
            })
          } else {
            console.log('不删除该订单')
          }
        }
      })
    },
    /**
     * 取消订单
     * order_sn 订单编号
     */
    unpay () {
      let order_sn = this.data.order_sn
      wx.showModal({
        title: '取消订单',
        content: '是否取消该订单',
        success: res => {
          if(res.confirm){
            wx.request({
              url: `${wx.getStorageSync('url')}shopUnOrder/${order_sn}`,
              method: 'put',
              header:{
                'Access-Token': wx.getStorageSync('jwt'),
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: res => {
                console.log(res.data);
                if(res.data.status == 200){
                  wx.showToast({
                    title: '取消订单成功',
                  })
                  this.triggerEvent('getData', 'ok')
                }
              }
            })
          }else{
            console.log('不取消该订单')
          }
        }
      })
    },
    /**
     * 评价
     * order_sn 订单编号
     */
    evaluation () {
      let order_sn = this.data.order_sn
      wx.navigateTo({
        url: `/pages/comments/comments/comments?order_sn=${order_sn}`
      })
    },
    /**
     * 支付
     * order_sn: string 订单编号
     * timeStamp: string 时间戳
     * nonceStr: string 随机字符串
     * package: string 统一下单接口返回的 prepay_id 参数值
     * signType: string 签名算法
     * paySign: string 签名
     * success: func
     */
    gopay () {
      let order_sn = this.data.order_sn
      let order_price = this.data.goodsData.payment_money
      let is_advance = this.data.is_advance
      if (is_advance){
        wx.navigateTo({
          url: `/pages/gopay/gopay?order_sn=${order_sn}&order_price=${order_price}&is_advance_sale=1`
        })
      }else{
        wx.navigateTo({
          url: `/pages/gopay/gopay?order_sn=${order_sn}&order_price=${order_price}`
        })
      }
    }
  }
})
