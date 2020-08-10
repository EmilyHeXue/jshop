// pages/audio/audio.js
let __audioCtx = wx.createInnerAudioContext()
function tp2 (data) {
  return (parseInt(data).toString().padStart(2, '0'))
}
//let __audioCtx
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(val) {
        if(val.details){
          __audioCtx.src = val.details.imgs[0].link
          __audioCtx.onEnded(()=>{
            this.end()
          })
        }
      }
    },
    leave:{
      type: Boolean,
      observer (val) {
        if (val) {
          clearInterval(inter)
        }
      }
    }
  },
  lifetimes:{
    attached(){
      
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    status:false,
    time: '00:00',
    interval: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    todo(){
      
      __audioCtx.play()
      let interval = setInterval(()=>{
        this.setData({
          time: `${tp2((__audioCtx.currentTime) / 60)}:${tp2((__audioCtx.currentTime) % 60)}`
        })
      },1000)
      this.setData({
        status: true,
        interval
      })
    },
    stop(){
      this.setData({
        status: false
      })
      __audioCtx.pause()
      clearInterval(this.data.interval)
    },
    end() {
      this.setData({
        status: false
      })
      __audioCtx.stop()
      clearInterval(this.data.interval)
    }
  }
})
