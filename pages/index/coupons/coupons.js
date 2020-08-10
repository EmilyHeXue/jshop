// 首页红包
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type:Object,
      observer (val) {
      }
    },
    bg:{
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    color:{
      "0":"#77adfd, #58d3fd",
      "1":"#a4bbfb, #dc92f7",
      "2":"#fcb187, #f7dd9f"
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
      领取红包
    */
    getcoupons(e){
      wx.request({
        url: wx.getStorageSync('url') + 'ShopRedEnvelope',
        method:"post",
        data:{
          type_id:e.currentTarget.dataset.id
        },
        header:{
          'Access-Token':wx.getStorageSync('jwt'),
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:res => {
          if(res.data.status == 200){
            wx.showToast({
              title: '领取成功',
              icon: 'success',
              duration: 2000
            })
          } else if (res.data.status == 1001){
            this.triggerEvent('nojwt','')
          }else{
            wx.showToast({
              title: '无效的优惠券码',
              icon:'none'
            })
          }
        }
      })
    }
  }
})
