// pages/imageList/imageList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(val) {
        console.log('图片列表',val)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    go(e) {
      console.log(e.currentTarget.dataset.link)
      wx.navigateTo({
        url: e.currentTarget.dataset.link,
      })
    }
  }
})
