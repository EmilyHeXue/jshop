// pages/index/newUserVoucher/newUserVoucher.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    flag:{
      type: Boolean
    },
    isLogin: {
      type: Boolean,
      observer(val){
        if(val) {
          this.getData()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: []
  },
  lifetimes: {
    attached(){
      
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getData(){
      wx.request({
        url: `${wx.getStorageSync('url')}ShopRedEnvelope`,
        data: {
          type: 2,
          key: wx.getStorageSync('shopkey')
        },
        success: res => {
          console.log(res.data)
          if(res.data.status == 200){
            this.setData({
              data: res.data.data
            })
          }
        }
      })
    },
    getAll(e){
      getApp().ajax({
        url: 'ShopVoucherReceive',
        method: 'post'
      }).then(res => {
        wx.showToast({
          title: '领取成功',
          icon: 'none'
        })
        this.closeLayer()
      })
    },
    closeLayer(){
      this.triggerEvent('getVoucherAll')
    }
  }
})
