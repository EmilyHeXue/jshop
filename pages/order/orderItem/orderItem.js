// pages/order/orderItem/orderItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderList:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    orderStatus: {
      '0': '未付款',
      '1': '已付款',
      '2': '已关闭',
      '3': '待收货',
      '6': '已收货',
      '7': '已完成'
    },
    color: wx.getStorageSync('background'),
    qrcode: '',
    qrcodeShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 跳转到退货页面
     * order_sn 订单order_sn
    **/
    returnGoods(data){
      let order_sn = data.currentTarget.dataset.order_sn;
      wx.showModal({
        title: '提示',
        content: '亲，真的要退款吗?',
        success: res => {
          if(res.confirm){
            wx.navigateTo({
              url: `/pages/applicationForDrawback/applicationForDrawback/applicationForDrawback?order_sn=${order_sn}`
            })
          }
        }
      })
    },
    /**
     * 提醒商家发货
     */
    posts (data) {
      wx.showLoading({
        title: '',
      })
      let order_sn = data.currentTarget.dataset.order_sn
      console.log(order_sn)
      setTimeout(() => {
        wx.hideLoading()
        wx.showToast({
          title: '已通知商家尽快发货',
          icon: 'none'
        })
      }, Math.random().toFixed(2) * 400 + 100)
    },
    /**
     * 跳转到查看物流页面
     * id 订单id
    **/
    checkLogistics(data){
      let order_sn = data.currentTarget.dataset.order_sn;
      wx.navigateTo({
        url: `/pages/logisticsInformation/logisticsInformation/logisticsInformation?order_sn=${order_sn}`
      })
    },
    /**
     * 跳转到评价
     * id 订单id
    **/
    toEvaluation(data){
      let order_sn = data.currentTarget.dataset.order_sn;
      wx.navigateTo({
        url: `/pages/comments/comments/comments?order_sn=${order_sn}`
      })
    },
    /**
     * 付款,直接拉取请求就行了
     * sn 订单编号
    **/
    toPay(data){
      let order_sn = data.currentTarget.dataset.order_sn;
      let order_price = data.currentTarget.dataset.order_price;
      let is_advance = data.currentTarget.dataset.is_advance
      if (is_advance){
        wx.navigateTo({
          url: `/pages/gopay/gopay?order_sn=${order_sn}&order_price=${order_price}&is_advance_sale=1`
        })
      }else{
        wx.navigateTo({
          url: `/pages/gopay/gopay?order_sn=${order_sn}&order_price=${order_price}`
        })
      }
    },
    /**
     * 确认收货,一个模态框,确定就发送请求
     * order_sn 订单编号
    **/
    getGoods(data){
      wx.showModal({
        title:'收货确认',
        content:'确定已收货',
        success: res => {
          console.log(res);
          if(res.confirm){
            wx.showLoading({
              title: '',
            })
            wx.request({
              url: wx.getStorageSync('url') + 'shopOrderGoods',
              method:'put',
              header:{
                'Access-Token':wx.getStorageSync('jwt'),
                'content-type':'application/x-www-form-urlencoded'
              },
              data:{
                order_sn: data.currentTarget.dataset.order_sn
              },
              success: res => {
                console.log(res);
                if(res.data.status == 200){
                  wx.hideLoading()
                  wx.showToast({
                    title: '收货完成',
                    icon:'none'
                  })
                  this.triggerEvent('getList', 'ok')
                }
              }
            })
          }else if(res.cancel){
            console.log('用户点击取消')
          }
        }
      })
    },
    /**
     * 删除订单,一个模态框,确定就发送请求
     * order_sn 订单编号
    **/
    delOrder(data) {
      let order_sn = data.currentTarget.dataset.order_sn
      wx.showModal({
        title: '删除订单',
        content: '是否删除订单',
        success: res => {
          if (res.confirm) {
            wx.request({
              url: `${wx.getStorageSync('url')}shopOrder/${order_sn}`,
              method: 'delete',
              header: {
                'Access-Token': wx.getStorageSync('jwt'),
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: res => {
                if(res.data.status == 200 || res.data.status == 204){
                  this.triggerEvent('getList','ok')
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    /**
     * unPay
     */
    unPay (e) {
      console.log()
      let order_sn = e.currentTarget.dataset.order_sn
      wx.showModal({
        title: '取消订单',
        content: '是否取消该订单?',
        success: res => {
          if(res.confirm){
            console.log(order_sn)
            wx.request({
              url: `${wx.getStorageSync('url')}shopUnOrder/${order_sn}`,
              method: 'put',
              header: {
                'Access-Token': wx.getStorageSync('jwt'),
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: res => {
                if(res.data.status == 200){
                  this.triggerEvent('getList', 'ok')
                }else{
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none'
                  })
                }
              }
            })
          }
        }
      })
    },
    //显示核销码
    showQrcode(e){
      console.log()
      wx.request({
        url: `${wx.getStorageSync('url')}shopOrderQrcode`,
        header: {
          'Access-Token': wx.getStorageSync('jwt'),
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          order_sn: e.currentTarget.dataset.order_sn
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
    show() {
      this.setData({
        qrcodeShow: !this.data.qrcodeShow
      })
    },
    godeatil(data){
      let order_sn = data.currentTarget.dataset.order_sn;
      wx.navigateTo({
        url: `/pages/orderItem/orderItem/orderItem?order_sn=${order_sn}`
      })
    }
  }
})
