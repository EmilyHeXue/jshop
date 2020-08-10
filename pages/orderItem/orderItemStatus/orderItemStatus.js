// pages/orderItem/orderItemStatus/orderItemStatus.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status:{
      type: Number
    },
    create_time:{
      type: String,
      observer (val) {
        let now = new Date().getTime()
        val = new Date(val.substring(0, 19).replace(/-/g, '/')).getTime() + 24 * 60 * 60 * 1000;
        let shenyu = (val - now)
        let time = parseInt(shenyu / 1000 / 60 / 60 )
        let fen = parseInt((shenyu - (time * 60 * 60 * 1000)) / 1000 / 60)
        this.setData({
          time: time,
          minute: fen
        })
      }
    }
  },
  lifetimes: {
    attached () {
      this.setData({
        background: wx.getStorageSync('background'),
        fontColor: wx.getStorageSync('nabigationFontColor')
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    background: wx.getStorageSync('background'),
    fontColor: wx.getStorageSync('nabigationFontColor'),
    time: '',
    minute: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
