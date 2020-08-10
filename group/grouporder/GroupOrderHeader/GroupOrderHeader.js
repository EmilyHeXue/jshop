// pages/group/grouporder/GroupOrderHeader/GroupOrderHeader.js
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
    menu:[
      { text: '全部', type: 0 },
      { text: '最近7天', type: 1 },
      { text: '最近30天', type: 2 },
      { text: '上月记录', type: 3 },
    ],
    selectIndex: 0,
    date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeIndex (e) {
      this.setData({
        selectIndex: e.currentTarget.dataset.index
      })
    }
  }
})
