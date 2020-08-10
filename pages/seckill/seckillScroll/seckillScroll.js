// pages/seckill/seckillScroll/seckillScroll.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      value: [],
      observer(val){
        if(val.length != 0){
          let data = val
          this.initAnimation(data)
        }
      }
    }
  },
  lifetimes:{
    attached () {
      
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    secound: 6,
    animation: true,
    list:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initAnimation(val){
      let indata = val.slice(0,val.length)
      let sliceData = indata.splice(0, 4)
      this.setData({
        list: sliceData
      })
      setInterval(() => {
        let date = this.data.secound - 1
        if (date == -1) {
          if (indata.length == 0) indata = val.slice(0, val.length)
          sliceData = indata.splice(0, 4)
          date = 6
          this.setData({
            animation: true,
            list: sliceData
          })
        } else if (date == 1) {
          this.setData({
            animation: false
          })
        }
        this.setData({
          secound: date
        })
      }, 1000)
    },
    go(e){
      wx.navigateTo({
        url: `/pages/goodsItem/goodsItem/goodsItem?id=${e.currentTarget.dataset.id}`,
      })
    }
  }
})
