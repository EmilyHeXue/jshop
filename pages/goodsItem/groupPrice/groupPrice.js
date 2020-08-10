// pages/goodsItem/groupPrice/groupPrice.js
let inter = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    min_price: {
      type: String
    },
    max_price: {
      type: String
    },
    end_time: {
      type: String,
      observer(val){
        setTimeout(() => {
          if (new Date().getTime() > this.data.start_time * 1000){
            this.getEndTime(val)
          }
        }, 10)
        
      }
    },
    start_time: {
      type: String,
      observer(val) {
        if(new Date().getTime() < val * 1000){
          this.setData({
            isstart: true
          })
          this.getEndTime(val)
        }
      }
    },
    interFlag: {
      type: Object,
      observer(val){
        if(val){
          clearInterval(inter)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    time:'0天00:00:00',
    isstart: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getEndTime(val){
      inter = setInterval(()=>{
        let timeRemaining = (val * 1000 - Date.parse(new Date())) / 1000
        let day = parseInt(timeRemaining / 60 / 60 / 24)
        let time = parseInt((timeRemaining - day * 24 * 60 * 60) / 60 / 60).toString().padStart(2,'0')
        let mintu = parseInt((timeRemaining - day * 24 * 60 * 60 - time * 60 * 60) / 60).toString().padStart(2, '0')
        let second = (timeRemaining % 60).toString().padStart(2, '0')
        this.setData({
          time: `${day}天${time}:${mintu}:${second}`
        })
      },200)
      
    }
  }
})
