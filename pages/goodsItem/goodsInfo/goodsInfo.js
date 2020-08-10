// pages/goodsItem/goodsclassify/goodsclassify.js
let app = getApp()
import { formatMD } from '../../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer (e) {
        if (e.start_time != 0 && e.hasOwnProperty('send_time')){
          this.setData({
            startTime: formatMD(e.start_time),
            sendTime: formatMD(e.send_time)
          })
        }
      }
    }
  }, 

  lifetimes: {
    attached () {
      this.setData({
        is_open: wx.getStorageSync('Config').is_stock
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    startTime: '',
    sendTime: '',
    endTime: '',
    is_open: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})