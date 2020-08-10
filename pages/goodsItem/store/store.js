// pages/goodsItem/store/store.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    label:{
      type: Array,
      observer (val) {
      }
    },
    supplier_id: {
      type: String,
      observer (val) {
      }
    },
    data: {
      type: Object,
      observer (val) {
        console.log(val.supplier_id)
        val.supplier_id == 0 ? this.getInfo() :this.getLeaderInfo(val.supplier_id)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    name: '',
    pic_url: '',
    detail_info: '',
    is_open: false
  },
  attached () {
    this.setData({
      is_open: wx.getStorageSync('Config').is_merchant_info
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getInfo () {
      getApp().ajax({
        url: 'ShopAppInfo',
        data: {
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        this.setData({
          name: res.data.name,
          pic_url: res.data.pic_url,
          detail_info: res.data.detail_info
        })
      })
    },
    /**
     * 获取门店信息
     * date 2020/4/3
     * @author kang
     */
    getLeaderInfo(val) {
      getApp().ajax({
        url: `shopSuppliers/${val}`
      }).then(res => {
        this.setData({
          name: res.data.leader.realname,
          pic_url: res.data.leader.logo,
          detail_info: res.data.intro
        })
      })
    },
    goIndex () {
      if(this.data.supplier_id == 0){
        wx.redirectTo({
          url: '/pages/index/index/index',
        })
      }else{
        wx.redirectTo({
          url: `/supplier/index/index?id=${this.data.supplier_id}`,
        })
      }
      
    }
  }
})
