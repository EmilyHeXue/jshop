// pages/returnOrder/returnOrderHeader/returnOrderHeader.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menuIndex:{
      type: Number,
      default:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    List:[
      { name: '全部', id: '0' },
      { name: '处理中', id: '1' },
      { name: '已同意', id: '2' },
      { name: '已完成', id: '3' }
    ],
    menuIndex:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    change (e) {
      let id = e.currentTarget.dataset.id
      this.setData({
        menuIndex:id
      })
      this.triggerEvent('change', {id:id})
    }
  }
})
