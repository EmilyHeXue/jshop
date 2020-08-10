// pages/goodsItem/recommendGoods/recommendGoods.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      observer(e) {
        if (e.length != 0) {
          this.getRecommendGoods(e)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goods_list:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getRecommendGoods(type){
      getApp().ajax({
        url: 'shopRecommendGoods',
        data: {
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        if(res.data[type] == 1){
          this.setData({
            goods_list: res.data.goods_list
          })
        }
      })
    },
    go (e) {
      wx.navigateTo({
        url: `/pages/goodsItem/goodsItem/goodsItem?id=${e.currentTarget.dataset.id}`,
      })
    }
  }
})
