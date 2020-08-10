// pages/goodsItem/buypeopleDetail/BPDList/BPDList.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    avatar: wx.getStorageSync('user').avatar
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
