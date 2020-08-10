// pages/integralMall/createOrder/chooseAddress/chooseAddress.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes:{
    attached(){
      this.getList()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    data:{},
    list:[],
    layerFlag: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getList(){
      getApp().ajax({
        url: 'shopContact'
      }).then(res => {
        console.log(res)
        this.setData({
          data: res.data[0],
          list: res.data
        })
        this.triggerEvent('addressid', { addressid: res.data[0].id })
      })
    },
    changeAddress(e){
      this.setData({
        layerFlag: !this.data.layerFlag
      })
    },
    chooseThis(e){
      console.log(this.data.list[e.currentTarget.dataset.index])
      this.setData({
        data: this.data.list[e.currentTarget.dataset.index],
        layerFlag: false
      })
      this.triggerEvent('addressid', { addressid: this.data.list[e.currentTarget.dataset.index].id})
    }
  }
})
