Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },
  lifetimes: {
    attached() {
      this.getData()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    flag: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData() {
      getApp().ajax({
        url: 'vipList'
      }).then(res => {
        console.log(res)
        this.setData({
          list: res.data
        })
        this.triggerEvent('props',{data: res.data[0]})
      })
    },
    choose(e) { //选择
      if (e.currentTarget.dataset.index != this.data.flag){ //判断当前选择的下标与flag是否一致, 如果一致则不执行任何操作
        this.setData({
          flag: e.currentTarget.dataset.index //将当前下标赋值给flag
        })
        this.triggerEvent('props', { data: this.data.list[this.data.flag] }) //向父组件传递对应数据
      }
    }
  }
})
