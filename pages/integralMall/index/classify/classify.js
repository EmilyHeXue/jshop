// pages/integralMall/index/classify/classify.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached(){
      this.getList()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getList(){
      getApp().ajax({
        url: 'shopScoreCategoryAll'
      }).then(res => {
        this.setData({
          list: res.data
        })
      })
    },
    go(e){
      console.log(e)
      wx.navigateTo({
        url: `../../goodsClassify/goodsClassify/goodsClassify?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.name}`,
      })
    }
  }
})
