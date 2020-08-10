// pages/classification/shopcart/shopcart.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cartindex: {
      type: Number,
      observer(){
        this.getData()
        this.setData({
          background: wx.getStorageSync('background')
        })
      }
    },
    loginFlag: {
      type: Boolean,
      observer() {
        this.getData()
        this.setData({
          background: wx.getStorageSync('background')
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    allPrice:0,
    nums: 0,
    background: 'red',
    data: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData(){
      getApp().ajax({
        url: 'shopCart'
      }).then(res => {
        let cartProperty = {},
        cartGood = {},
        price = 0,
        nums = 0
        for(let i of res.data){
          cartProperty[i.stock_id] = i.number
          cartGood[i.goods_id] = i.number
          price = price + parseFloat(i.number) * parseFloat(i.price)
          nums = nums + parseInt(i.number)
        }
        price = Math.round(price * 100) / 100
        this.setData({
          allPrice: price,
          data: res.data,
          nums
        })

        this.triggerEvent('initcartData', { cartProperty: cartProperty, cartGood: cartGood})
      }).catch(err => {
        this.setData({
          allPrice: 0,
          data: [],
          nums: 0
        })
        this.triggerEvent('initcartData', { cartProperty: {}, cartGood: {} })
      })
    },
    go(){
      wx.setStorageSync('shopcartData', this.data.data)
      wx.navigateTo({
        url: '/pages/createOrder/createOrder/createOrder'
      })
    },
    goshopcart(){
      wx.navigateTo({
        url: '/pages/shopCart/shopCart/shopCart',
      })
    }
  }
})
