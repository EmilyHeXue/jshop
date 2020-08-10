// pages/model/model.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type: String,
      default: '标题'
    },
    show:{
      type: Boolean,
      default: true
    },
    data:{
      type: Array,
      abserver(val){
        console.log('data',val)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    background: wx.getStorageSync('background'),
    fontcolor: wx.getStorageSync('nabigationFontColor')
  },
  lifetimes: {
    attached () {
      console.log('我出来了!!!!')
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    canel (e) {
      getApp().addFormId(e.detail.formId)
      this.triggerEvent('error', '')
    },
    ok (e) {
      getApp().addFormId(e.detail.formId)
      this.triggerEvent('ok','')
    }
  }
})
