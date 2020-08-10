// pages/goodsItem/buypeople/buypeople.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object
    }
  },
  lifetimes: {
    attached(){
      this.setData({
        is_open: wx.getStorageSync('Config').is_stock
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    is_open: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    go() {
      wx.navigateTo({
        url: `/pages/goodsItem/buypeopleDetail/buypeopleDetail/buypeopleDetail?id=${this.data.goodsid}`,
      })
    }
  }
})
