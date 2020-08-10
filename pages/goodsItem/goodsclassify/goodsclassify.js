// pages/goodsItem/goodsclassify/goodsclassify.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    show () {
      this.triggerEvent('show', { status: 'all' })
    }
  }
})
