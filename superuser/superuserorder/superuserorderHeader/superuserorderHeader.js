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
          menuIndex: val
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    menu:[
      { text: '已付款', id: 2 },
      { text: '已完成', id: 1 },
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
      this.triggerEvent('changList', {index: e.currentTarget.dataset.index})
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
