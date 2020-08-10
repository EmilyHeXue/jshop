// pages/goodsItem/goodsCoupons/goodsCoupons.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(e){
        if (e.hasOwnProperty('id') && e.is_advance_sale == 0){
          this.getGoodsCoupons(e.id)
          this.getData()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    background: '',
    fontcolor:'',
    couponsData: [],
    layerFlag: false,
    goodsCoupons: {},
    reduction: {}
  },
  /**
   * 生命周期
   */
  lifetimes:{
    attached () {
      this.setData({
        background: wx.getStorageSync('background'),
        fontcolor: wx.getStorageSync('nabigationFontColor')
      })
      
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取红包列表
     */
    getData () {
      getApp().ajax({
        url: 'ShopRedEnvelope',
        data: {
          key: wx.getStorageSync('shopkey'),
          type: 1
        }
      }).then(res => {
        this.setData({
          couponsData: [...this.data.couponsData, ...res.data],
          reduction: wx.getStorageSync('Config').reduction_info
        })
      })
    },
    /**
     * 获取商品红包
     */
    getGoodsCoupons (id) {
      getApp().ajax({
        url: 'ShopRedEnvelope',
        data: {
          key: wx.getStorageSync('shopkey'),
          goods_id:  id
        }
      }).then(res => {
        this.setData({
          goodsCoupons: res.data[0],
          couponsData: [...this.data.couponsData, ...res.data]
        })
      })
    },
    /**
     * 
     */
    couponsShow () {
      this.setData({
        layerFlag: !this.data.layerFlag
      })
    },
    /**
     * getCoupons
     */
    getCoupons (e) {
      getApp().ajax({
        url: 'ShopRedEnvelope',
        method: "post",
        data: {
          type_id: e.currentTarget.dataset.id
        }
      }).then(res => {
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 2000
        })
      })
    }
  }
})
