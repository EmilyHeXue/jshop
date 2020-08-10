// pages/index/buyprompt/buyprompt.js
let inter
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    leave: {
      type: Boolean,
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
    name: '',
    avatar: '',
    data: [],
    showFlag: false,
    animation: '',
    is_open: false
  },
  lifetimes: {
    attached() {
      if (wx.getStorageSync('Config').pay_info){
        this.init()
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getData() {
      wx.request({
        url: `${wx.getStorageSync('url')}shopRandomOrder`,
        header: {
          "Access-Token":wx.getStorageSync('jwt')
        },
        success: res => {
          this.setData({
            data: res.data.data
          })
        }
      })
    },
    init() {
      let use
      inter = setInterval(() => {
        if (this.data.data.length == 1 || this.data.data.length == 0){
          this.getData()
        }
        
        use = this.data.data.splice(0, 1)[0]
        try{
          this.setData({
            name: use.nickname,
            avatar: use.avatar,
            animation: 'animation'
          })
          setTimeout(() =>{
            this.setData({
              animation: ''
            })
          },3000)
        }catch(err){

        }
      }, 6000)
    }
  }
})
