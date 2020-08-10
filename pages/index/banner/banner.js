// pages/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type: Object,
      observe (val) {
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    style: 2
  },

  /**
   * 组件的方法列表
   */
  methods: {
    go (e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.link,
      })
    },
    tijiao(e){
    }
  }
})
