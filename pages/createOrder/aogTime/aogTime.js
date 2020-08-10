// pages/createOrder/aogTime/aogTime.js
let zhou = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六'
}
let obj = {}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    is_estimated: {
      type: Boolean
    }
  },
  lifetimes: {
    attached(){
      if (wx.getStorageSync('Config').estimated_service_time_info.is_estimated == 1){
        switch (wx.getStorageSync('Config').estimated_service_time_info.estimated_type){
          case '1': 
            this.setData({
              estimated_data: Array.from({ length: 7 }, (v, i, d) => this.everyDayFormat(i)),
              estimated_time: wx.getStorageSync('Config').estimated_service_time_info.estimated_time,
              estimated_type: wx.getStorageSync('Config').estimated_service_time_info.estimated_type
            })
            break;
          case '2':
            this.setData({
              estimated_data: this.everyWeekFormat(wx.getStorageSync('Config').estimated_service_time_info.estimated_data),
              estimated_time: wx.getStorageSync('Config').estimated_service_time_info.estimated_time,
              estimated_type: wx.getStorageSync('Config').estimated_service_time_info.estimated_type
            })
            break;
          case '3':
            let estimated_data = this.fixedTimeFormat(wx.getStorageSync('Config').estimated_service_time_info.estimated_data, wx.getStorageSync('Config').estimated_service_time_info.estimated_time)
            this.setData({
              estimated_data: estimated_data,
              estimated_time: obj[estimated_data[0]],
              estimated_type: wx.getStorageSync('Config').estimated_service_time_info.estimated_type
            })
            break;
        }
      }
      this.triggerEvent('estimated_service_time', {estimated_service_time: JSON.stringify(this.data.choose)})
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    estimated_data: ['周一', '周二', '周四'],
    estimated_time: ['01:00:00 - 02:00:00', '02:00:00 - 03:00:00', '03:00:00 - 04:00:00', '04:00:00 - 05:00:00'], 
    estimated_type: 2,
    choose: ['选择预计配送时间', '不选则由商城尽快配送'],
    layerShow: false,
    willchoose: ['','']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseDate(e){
      if(this.data.estimated_type == 3){
        this.setData({
          willchoose: [e.currentTarget.dataset.data, obj[e.currentTarget.dataset.data][0]],
          estimated_time: obj[e.currentTarget.dataset.data]
        })
      }else {
        this.setData({
          willchoose: [e.currentTarget.dataset.data, this.data.estimated_time[0]]
        })
      }
    },
    /**
     * 选择时间
     */
    chooseTime(e) {
      this.setData({
        willchoose: [this.data.choose[0] == '选择预计配送时间' && this.data.willchoose[0] == '' ? this.data.estimated_data[0] : this.data.willchoose[0], e.currentTarget.dataset.data]
      })
      console.log(this.data.willchoose)
    },
    /**
     * 每天
     */
    everyDayFormat(i){
      return `${new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * i).getMonth() + 1}.${new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * i).getDate()}(${zhou[new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * i).getDay()]})`
    },
    /**
     * 每周
     */
    everyWeekFormat(conditions){
      return Array.from({ length: 7 }, (v, i, d) => {
          return {
            day: this.everyDayFormat(i),
            week: zhou[new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * i).getDay()]
          }
      }).filter(i => conditions.includes(i.week)).map(i => i.day)
    },
    fixedTimeFormat(estimated_date, estimated_time){
      
      let data = estimated_date.map((i, b, c) => {
        return [`${new Date(i).getMonth() + 1}.${new Date(i).getDate()}(${zhou[new Date(i).getDay()]})`, estimated_time[b]]
      }).forEach((i,b) => {
        if (obj[i[0]] == undefined){
          obj[i[0]] = [i[1]]
        }else{
          obj[i[0]] = [...obj[i[0]],i[1]]
        }
      })
      data = []
      for(let i in obj){
        console.log(i)
        data = [...data,i]
      }
      return data
    },
    show(){
      this.setData({
        layerShow: !this.data.layerShow
      })
    },
    post(){
      this.setData({
        choose: this.data.willchoose,
        layerShow: !this.data.layerShow
      })
      this.triggerEvent('estimated_service_time', { estimated_service_time: JSON.stringify(this.data.choose) })
    }
  }
})
