// pages/goodsItem/share/share.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shareFlag:{
      type: Boolean
    },
    goodsid: {
      type: Number,
      observer() {
      }
    },
    goodName: {
      type: String,
      observer() {
      }
    },
    bannerList: {
      type: Array,
      observer(){
      }
    },
    data: {
      type:Object
    }
  },

  lifetimes: {
    attached() {
     this.setData({
       good_phenosphere_is_open: wx.getStorageSync('Config').good_phenosphere
     }) 
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    good_phenosphere_is_open: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showShare() {
      this.triggerEvent('showShare')
    },
    toshare() {
      wx.navigateTo({
        url: `/pages/share/share?id=${this.data.goodsid}&type=2&price=${this.data.data.min_price}`,
      })
    },
    togoodsgroup(){
      wx.openBusinessView({
        businessType: 'friendGoodsRecommend',
        extraData: {
          product: {
            item_code: this.data.goodsid,
            title: this.data.goodName,
            image_list: this.data.bannerList
          }
        },
        success: function (res) {
        },
        fail: function (res) {
        }
      })
    }
  }
})
