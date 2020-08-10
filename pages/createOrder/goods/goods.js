// pages/createOrder/goods/goods.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   * goodsData 购物车数据
   */
  properties: {
    goodsData:{
      type:Array,
      observer(val) {
      }
    },
    user_contact_id: {
      type: Number,
      observer(val){
        console.log("i'm is change address", val)
      }
    },
    show: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: []
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 设置红包优惠
     */
    setVoucher_id (e) {
      let data = this.data.goodsData
      data[e.detail.index].voucher_id = e.detail.coupone.id
      data[e.detail.index].coupone_price = e.detail.coupone.price
      this.triggerEvent('update', {data})
    },
    /**
     * 初始化商品数据
     */
    initShopData (e) {
      let data = this.data.goodsData
      data[e.detail.index] = {
        ...data[e.detail.index],
        discount_ratio: e.detail.discount_ratio,
        leader_discount: e.detail.leader_discount,
        coupone_price: 0
      }
      this.triggerEvent('update', { data })
    },
    /**
     * 计算邮费 
     **/
    setYoufei (e) {
      let data = this.data.goodsData
      data[e.detail.index] = {
        ...data[e.detail.index],
        youfei: e.detail.youfei
      }
      console.log(e.detail, data)
      console.log('goods: 团长配送费', e.detail)
      this.triggerEvent('update', { data })
    },
    /**
     * 添加备注
     */
    remark (e) {
      let data = this.data.goodsData
      data[e.detail.index] = {
        ...data[e.detail.index],
        remark: e.detail.data
      }
      this.triggerEvent('update', { data })
    },
    /**
     * 计算满减
     */
    setManjian (e) {
      let data = this.data.goodsData
      data[e.detail.index] = {
        ...data[e.detail.index],
        reduction_decrease: e.detail.reduction_decrease
      }
      console.log('满减',e.detail, data)
      this.triggerEvent('update', { data })
    }
  }
})
