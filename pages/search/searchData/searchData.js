// pages/search/searchData/searchData.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type: Array,
      default: [],
      observer (val) {
        
      }
    },
    background: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 1,
    switch: true,
    nav: true,
    classifyData:[]
  },

  /**
   * 组建进入节点
   */
  attached () {
    this.getClassIfy()
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 切换排序 1:综合, 2:销量
     */
    tab: function (e) {
      let index = e.currentTarget.dataset.index
      this.setData({
        active: index
      })
      this.triggerEvent('changData', { index: index})
    },

    /**
     * 设置显示方式
     */
    switch: function () {
      if (this.data.switch) {
        this.setData({
          switch: false
        })
      } else {
        this.setData({
          switch: true
        })
      }
    },

    /**
     * 获取分类数据
     */
    getClassIfy () {
      wx.request({
        url: wx.getStorageSync('url') + 'shopCategory',
        method: "get",
        data: {
          key: wx.getStorageSync('shopkey')
        },
        header: {
          'Access-Token': wx.getStorageSync('jwt')
        },
        success: res => {
          if (res.data.status == 200) {
            let data = []
            for(let i of res.data.data){
              data.push(...i)
            }
            this.setData({
              classifyData: data
            })
          }
        }
      })
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
     * 页面跳转
     */
    goGoods (e){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/goodsItem/goodsItem/goodsItem?id=${id}`,
      })
    }
  }
})
