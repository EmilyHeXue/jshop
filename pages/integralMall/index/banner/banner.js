// pages/integralMall/index/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes:{
    attached(){
      this.getBanner()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    data: [
      { pic_url: ''}
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getBanner(e){
      getApp().ajax({
        url: 'shopScoreBanner'
      }).then(res => {
        this.setData({
          data: res.data
        })
      })
    },
    go(e) {
      console.log(e.currentTarget.dataset)
      wx.navigateTo({
        url: `../../goodsItem/goodsItem?id=${e.currentTarget.dataset.link}`,
      })
    }
  }
})
