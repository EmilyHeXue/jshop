// pages/line/line.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(val) {
        console.log(val)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:{
      "1": 'solid',
      '2': 'dashed',
      '3': 'dotted'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
