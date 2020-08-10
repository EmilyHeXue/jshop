// pages/seckill/seckillHeader/seckillHeader.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menu:{
      type: Array,
      value: []
    },
    background: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    change (e) {
      this.setData({
        selectIndex: e.currentTarget.dataset.index
      })
      this.triggerEvent('change', { id: e.currentTarget.dataset.index})
    }
  }
})
