// pages/goodsItem/goodsComment/goodsComment.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsId:{
      type:Number,
      observer (val) {
        if(val != ''){
          this.getData(val)
        }
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    data:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取数据
     */
    getData(val) {
      getApp().ajax({
        url: `shopGoodsComments/${val}`,
        data: {
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        this.setData({
          data: res.data
        })
      })
    },
    go () {
      wx.navigateTo({
        url: `/pages/goodsItem/commentsDetail/commentsDetail?id=${this.data.goodsId}`,
      })
    }
  }
})
