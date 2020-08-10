// pages/integralMall/createOrder/layer/layer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: true
    },
    score:{
      type: Number,
      value: 0
    },
    data: {
      type: Object
    },
    addressid: {
      type: Number
    },
    goodsScore: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    status: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    yes(e) {
      console.log(this.data)
      if(Number(this.data.data.score) > wx.getStorageSync('user').score){
        this.setData({
          status: 2
        })
      }else{
        getApp().ajax({
          url: 'shopScoreOrder',
          method: 'post',
          data: {
            score_goods_id: this.data.data.id,
            user_contact_id: this.data.addressid
          }
        }).then(res => {
          this.setData({
            status: 1
          })
        }).catch(res => {
          if(res.data.message == '库存不足'){
            this.setData({
              status: 3
            })
          }
        })
      }
    },
    ok(e) {
      wx.redirectTo({
        url: '../../order/order',
      })
    },
    err(e) {
      wx.redirectTo({
        url: '/pages/index/index/index',
      })
    },
    show(){
      this.triggerEvent('show',{})
      this.setData({
        status: 0
      })
    }
  }
})
