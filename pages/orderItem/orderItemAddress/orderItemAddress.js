// pages/orderItem/orderItemAddress/orderItemAddress.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    addressData:{
      type:Object,
      observer (val) {
        console.log(val)
        this.setData({
          address: {...val, address: val.address.slice(0, val.address.length -7 )}
        })
      }
    },
    groupaddr: {
      type: String
    },
    groupphone: {
      type: Number
    },
    express_type: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    address:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
