// bargaining/pages/goodItem/banner/banner.js
let countdown
Component({
  attached(){
    
  },
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(val){
        if (val.bargain_end_time && val.bargain_end_time * 1000  > new Date().getTime()){
          this.simpodataformart(val.bargain_end_time)
          countdown = setInterval(() => {
            this.simpodataformart(val.bargain_end_time)
          }, 1000)
        }else{
          this.setData({
            timeout: false
          })
        }
      }
    },
    leave:{
      type: Boolean,
      observer(val) {
        if(val){
          clearInterval(countdown)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    day: 0,
    time: 0,
    minute: 0,
    second: 0,
    timeout: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    simpodataformart(bargain_end_time) {
      let timeInterval = parseInt((bargain_end_time * 1000 - new Date().getTime()) / 1000)
      let day = parseInt(timeInterval / 86400).toString().padStart(2, 0)
      let hour = parseInt(timeInterval % 86400 / 3600).toString().padStart(2, 0)
      let minute = parseInt(timeInterval % 3600 / 60).toString().padStart(2, 0)
      let second = parseInt(timeInterval % 60).toString().padStart(2, 0)
      this.setData({
        day,
        hour,
        minute,
        second,
        timeout: true
      })
    }
  }
})
