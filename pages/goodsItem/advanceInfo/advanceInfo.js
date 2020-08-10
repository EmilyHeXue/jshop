// pages/goodsItem/advanceInfo/advanceInfo.js
import { formatTime} from '../../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(val) {
        if (val.hasOwnProperty('advance_info')){
          this.setData({
            startTime: formatTime(new Date(val.advance_info.pay_start_time * 1000), '.', 'YMDHM'),
            endTime: formatTime(new Date(val.advance_info.pay_end_time * 1000), '.', 'YMDHM')
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    startTime:'',
    endTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
