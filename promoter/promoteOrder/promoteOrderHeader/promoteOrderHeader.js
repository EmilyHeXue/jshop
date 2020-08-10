// pages/group/groupmenbersorder/GroupMenbersOrderHeader/GroupMenbersOrderHeader.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: Number,
      observer(val) {
        this.setData({
          menuIndex: val - 1
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    menu:[
      { text: '全部', id: 1 },
      { text: '待付款', id: 2 },
      { text: '待发货', id: 3 },
      { text: '配送中', id: 4 },
      { text: '待取货', id: 5 },
      { text: '已完成', id: 6 },
    ],
    menuIndex:0,
    searchData:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeindex (e) {
      this.setData({
        menuIndex: e.currentTarget.dataset.index
      })
      this.triggerEvent('changList', {id: this.data.menu[e.currentTarget.dataset.index].id})
    },
    search (e) {
      console.log(this.data.value)
      this.triggerEvent('search', {text: this.data.value})
    },
    write (e) {
      this.setData({
        value: e.detail.value
      })
    }
  }
})
