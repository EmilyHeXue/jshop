// pages/createOrder/coupons/coupons.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   * supplier_id 店铺id
   * goodsData 店铺商品
   * shopindex 店铺下标
   * user_contact_id 收货地址id
   */
  properties: {
    supplier_id: {
      type: Number,
      value: -1,
      observer (val) {
        this.gethongbao(val, this.data.goodsData.map(e => e.goods_id).join(','))
      }
    },
    goodsData: {
      type: Array,
      value: [],
      observer (e) {
        let goodsPrice = e.map(i => i.price * i.number).reduce((pre, cur, index) => {
          return Number(pre) + Number(cur)
        })
        this.setData({
          goodsPrice
        })
      }
    },
    shopindex: {
      type: Number
    },
    ajaxshow: {
      type: Boolean,
      observer (e) {
        setTimeout(() => {
          console.log('i want todo', this.data.user_contact_id )
          if (this.data.supplier_id === 0 && this.data.user_contact_id == 2) {
            this.shopTuanFee()
          }
        }, 100)
      }
    },
    user_contact_id: {
      type: Number,
      observer (e) {
        console.log('收货地址id', e)
        if(e == 2){ // 团长配送
          this.setData({
            youfei: 0
          })
          if (this.data.supplier_id === 0) {
            this.shopTuanFee()
          } else {
            this.shopTuanSupplier(this.data.supplier_id)
          }
        }else if(e == 1){ // 到店自提
          this.setData({
            youfei: 0
          })
          this.triggerEvent('setYoufei', { index: this.data.shopindex, youfei: 0 })
        } else { // 快递
          console.log('团长id',this.data.supplier_id)
          if (this.data.supplier_id === 0) {
            this.copFullReduction().then(res => { // 满减是否包邮匹配
              if (res || res == 'true'){
                console.log('已达满减条件', res)
                this.setData({
                  youfei: 0
                })
                this.triggerEvent('setYoufei', { index: this.data.shopindex, youfei: 0 })
              }else{
                console.log('已达满减条件个屁嘞', res)
                this.shopKdf(e)
              }
            })
          } else {
            this.shopTuanSupplierexpress(e)
          }
        }
      }
    }
  },
  lifetimes: {
    ready () {
      let allPrice = this.data.goodsData.map(i => i.number * i.price).reduce((pre, cur, index) => {
        return Number(pre) + Number(cur)
      })
      if(this.data.supplier_id === 0){
        this.copFullReduction()
        this.setData({
          is_vip: wx.getStorageSync('user').is_vip == 1 ? true : false,
          discount_ratio: wx.getStorageSync('user').is_vip == 1 ? Math.round((allPrice - allPrice * parseFloat(wx.getStorageSync('user').discount_ratio)) * 100) / 100 : 0,
          leader_discount: wx.getStorageSync('leader_discount'),
          free_data: wx.getStorageSync('Config').reduction_info
        })
        this.triggerEvent('initShopData', {
          index: this.data.shopindex,
          discount_ratio: this.data.discount_ratio,
          leader_discount: this.data.leader_discount,
          youfei: this.data.youfei
        })
      }
    }
  },
  /**
   * 组件的初始数据
   * coupone 选中的红包
   * couponeList 红包列表
   * show 是否显示选择栏
   * youfei 邮费
  **/
  data: {
    coupone:'',
    couponeList:'',
    show:false,
    discount_ratio: 0,
    is_vip: false,
    leader_discount: 0,
    goodsPrice: 0,
    youfei: 0,
    is_reduction: false,
    reduction_achieve: '',
    reduction_decrease: 0,
    free_shipping: false,
    free_flag: false,
    free_data: []
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取邮费
    */
    shopKdf(id){
      app.ajax({
        url: `shopKdf/${id}`,
        data: {
          number: this.data.goodsData.map(i => i.number).reduce((pre, cur, index) => {
            return Number(pre) + Number(cur)
          }),
          weight: this.data.goodsData.map(i => i.weight * i.number).reduce((pre, cur, index) => {
            return Number(pre) + Number(cur)
          })
        }
      }).then(res => {
        console.log('邮费',res)
        this.setData({
          youfei: res.data
        })
        this.triggerEvent('setYoufei', { index: this.data.shopindex, id, youfei: res.data }) 
      })
    },
    /**
     * 获取门店快递费
    */
    shopTuanSupplierexpress(id) {
      app.ajax({
        url: `shopSkdf/${id}`,
        data: {
          supplier_id: this.data.supplier_id,
          number: this.data.goodsData.map(i => i.number).reduce((pre, cur, index) => {
            return Number(pre) + Number(cur)
          }),
          weight: this.data.goodsData.map(i => i.weight * i.number).reduce((pre, cur, index) => {
            return Number(pre) + Number(cur)
          })
        }
      }).then(res => {
        this.setData({
          youfei: res.data
        })
        this.triggerEvent('setYoufei', { index: this.data.shopindex, youfei: res.data })
      })
    },
    /**
     * 获取门店配送
    */
    shopTuanSupplier(id) {
      app.ajax({
        url: `shopTuanSupplier`,
        data: {
          supplier_id: id
        }
      }).then(res => {
        this.setData({
          youfei: res.data.tuan_express_fee
        })
        this.triggerEvent('setYoufei', { index: this.data.shopindex, youfei: res.data.tuan_express_fee })
      })
    },
    /**
     * 设置团长配送费
     */
    shopTuanFee(){
      this.setData({
        youfei: wx.getStorageSync('area').tuan_express_fee
      })
      console.log('coupons: 团长配送费', wx.getStorageSync('area').tuan_express_fee)
      this.triggerEvent('setYoufei', { index: this.data.shopindex, youfei: wx.getStorageSync('area').tuan_express_fee })
    },
    /**
     * 获取红包
    */
    gethongbao(supplier_id, goods_id){
      getApp().ajax({
        url: 'ShopVoucherSupplier',
        data: {
          supplier_id,
          goods_id
        }
      }).then(res => {
        this.setData({
          couponeList: res.data
        })
      })
    },
    /**
     * 显示
    */
    showLayer(){
      this.setData({
        show:true
      })
    },
    /**
     * 关闭
    */
    closeLayer(data){
      this.setData({
        show:false,
        coupone:this.data.couponeList[data.currentTarget.dataset.index]
      })
      console.log(this.data)
      this.triggerEvent('setVoucher_id', { index: this.data.shopindex, coupone: this.data.coupone})
    },
    /**
     * 不使用优惠券
    */
    nocpuponce(){
      this.setData({
        coupone:{
          is_used:2
        },
        show:false
      })
      this.triggerEvent('coupone', {is_used:2,price:0,full_price:0});
    },
    /**
     * 填写备注
    */
    remark(data){
      this.triggerEvent('remark', { index: this.data.shopindex, data: data.detail.value });
    },
    /**
     * 计算满减
     */
    copFullReduction () {
      return new Promise((reslove, reject) => {
        let json = wx.getStorageSync('Config').reduction_info
        if (json.is_reduction == 1) {
          let arr = json.reduction_achieve.map((i, v, h) => {
            return {
              reduction_achieve: Number(i),
              reduction_decrease: json.reduction_decrease[v],
              free_shipping: json.free_shipping[v]
            }
          }).filter(i => {
            return i.reduction_achieve <= this.data.goodsPrice
          }).sort((i, v) => {
            return i.reduction_achieve - v.reduction_achieve
          })
          if (arr.length == 0) {
            arr = {
              reduction_achieve: '未达满减条件',
              reduction_decrease: 0,
              free_shipping: false
            }
          } else {
            arr = arr[arr.length - 1]
          }
          this.setData({
            reduction_achieve: arr.reduction_achieve,
            reduction_decrease: arr.reduction_decrease,
            free_shipping: arr.free_shipping,
            is_reduction: true
          })
          this.triggerEvent('setManjian', {
            index: this.data.shopindex,
            reduction_decrease: arr.reduction_decrease
          })
          console.log('free_shipping', arr.free_shipping)
          reslove(arr.free_shipping)
        }else{
          reslove(false)
        }
      })
    },
    closefree_shopinglayer () {
      this.setData({
        free_flag: !this.data.free_flag
      })
    }
  }
})
