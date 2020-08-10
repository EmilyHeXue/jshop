// pages/group/groupcommissionwater/List/List.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type:Array,
      default:[],
      observer(val){
        console.log(val)
      }
    },
    apiIndex: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    send_type:{
      0: "余额",
      1: '微信',
      2: '支付宝',
      3: '银行卡'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
