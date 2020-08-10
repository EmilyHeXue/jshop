// pages/comments/star/star.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    faindex:{
      type: Number,
      abserver (val) {
        console.log(val)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: [false, false, false, false, false],
    text: {
      "1": "非常差",
      "2": "较差",
      "3": "中",
      "4": "较好",
      "5": "非常好"
    },
    evaluation: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    choose (e) {
      let index = e.currentTarget.dataset.index
      let flag = [false, false, false, false, false]
      for(let i in flag){
        if(i <= index){
          flag[i] = true
        }
      }
      this.setData({
        data:flag,
        evaluation: ++index
      })
      this.triggerEvent('nums', { evaluation: index, index: this.data.faindex})
    }
  }
})
