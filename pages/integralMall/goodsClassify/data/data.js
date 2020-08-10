// pages/goodsClassify/data/data.js.
let app = getApp()
Component({
  /**
   * 组件的属性列表
   * data 分类商品的值
   */
  properties: {
    data:{
      type:Array
    },
    classifyData: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 1,
    switch: true,
    nav: true
  },
  attached(){
    
  },
  /**
   * 组件的方法列表
   */
  
  methods: {
    /**
     * 跳转到商品详情
    **/
    togoodsItem(data){
      let id = data.currentTarget.dataset.id;
      wx.navigateTo({
        url: `../../goodsItem/goodsItem?id=${id}`
      })
    },

    /**
     * 切换排序 1:综合, 2:销量
     */
    tab: function (e) {
      let index = e.currentTarget.dataset.index
      this.setData({
        active: index
      })
      this.triggerEvent('changData', { index: index })
    },

    /**
     * 显示分类
     */
    nav: function () {
      this.setData({
        nav: false
      })
    },

    /**
     * 隐藏分类
     */
    hide: function () {
      this.setData({
        nav: true
      })
    },
    /**
     * 更改分类详情 
     */
    change (e) {
      let id = e.currentTarget.dataset.id
      let name = e.currentTarget.dataset.name
      console.log(id,name)
      this.hide()
      this.triggerEvent('changeData',{id:id,name:name})
      
    }
  }
})
