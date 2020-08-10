// pages/group/groupcommissionwater/Header/Header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectIndex:{
      type:Number,
      default: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    menu: [
      { text: '佣金流水', type: 0 },
      { text: '提现流水', type: 1 }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeIndex(e) {
      console.log(e.currentTarget.dataset.index)
      this.triggerEvent('changeList', { index: e.currentTarget.dataset.index })
    }
  }
})
