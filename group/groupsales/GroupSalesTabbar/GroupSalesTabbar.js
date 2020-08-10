// pages/group/groupsales/GroupSalesTabbar/GroupSalesTabbar.js
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
      { text: '今日销量', id:1 },
      { text: '7日销量', id: 2 },
      { text: '30日销量', id: 3 },
      { text: '总销量', id: 4 },
    ],
    background: wx.getStorageSync('background'),
    fontColor: wx.getStorageSync('nabigationFontColor'),
    selectIndex: 0,
    tabselect: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeIndex (e) {
      console.log(e.currentTarget.dataset.index)
      this.setData({
        selectIndex: e.currentTarget.dataset.index
      })
      this.triggerEvent('change', { id: this.data.menu[e.currentTarget.dataset.index].id, type: this.data.tabselect})
    },
    changeTabSelect (e) {
      this.setData({
        tabselect: e.currentTarget.dataset.index
      })
      this.triggerEvent('change', { id: this.data.menu[this.data.selectIndex].id, type: e.currentTarget.dataset.index })
    }
  }
})
