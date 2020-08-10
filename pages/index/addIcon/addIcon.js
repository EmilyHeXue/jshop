// pages/index/addIcon/addIcon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },
  lifetimes:{
    attached() {
      if (getApp().globalData.showFlag){
        this.setData({
          showFlag: true,
          top: wx.getMenuButtonBoundingClientRect().height + wx.getMenuButtonBoundingClientRect().top + 5
        })
        setTimeout(()=>{
          this.setData({
            showFlag: false
          })
          getApp().globalData.showFlag = false
        },6000)
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    showFlag: false,
    top: wx.getMenuButtonBoundingClientRect().bottom
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
