// pages/navigation/navigation.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(val) {
        console.error(val)
        let list = []
        val.details.imgs.map((e,i) => {
          console.log( this.data.number[val.details.style], i %  this.data.number[val.details.style])
          if(i % (this.data.number[val.details.style] * 2) == 0) {
            console.log(list, typeof list)
            list.push([e])
          }else{
            list[list.length - 1].push(e)
          }
        })
        this.setData({
          menu: list,
          swiperHeight: list[0].length > this.data.number[val.details.style] ? true : false
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    number: {
      1: 2,
      2: 3,
      3: 4,
      4: 5
    },
    menu: [],
    swiperHeight: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    go(e) {
      console.log(e.currentTarget.dataset.link)
      wx.navigateTo({
        url: e.currentTarget.dataset.link,
      })
    },
    calculateheight(e){
      this.setData({
        swiperHeight: this.data.menu[e.detail.current].length > this.data.number[this.data.data.details.style] ? true : false
      })
    }
  }
})
