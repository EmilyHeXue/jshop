// pages/goodsItem/footer/footer.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodstype: {
      type: Number
    },
    property: {
      type: Array
    },
    price: {
      type: Number,
      value: 0
    },
    group_price: {
      type: Number,
      value: 0
    },
    data: {
      type: Object,
      observer(e) {
        console.log(e.advance_info)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    background: wx.getStorageSync('background'),
    propertyFlag: false,
    flag: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 返回首页
    */
    goIndex(){
      wx.redirectTo({
        url: `/pages/index/index/index`
      })
    },
    /**
     * 添加购物车
    **/
    addGoodsShop(){
      this.triggerEvent('show', {status:'add'});
    },
    /**
     * 购买
    **/
    toBuy(){
      this.triggerEvent('show', {status:'buy'});
    },
    goKefu(){
      wx.navigateTo({
        url: '/pages/webview/webview',
      })
    },
    toGroupBuy(){
      if(this.data.property.length == 1){
        this.triggerEvent('show', { status: 'buy', tuanNum: this.data.property[0], submit_type: 1});
      } else {
        this.setData({
          propertyFlag: true
        })
      }
    },
    change(e){
      this.setData({
        flag: e.currentTarget.dataset.index,
        propertyFlag: false
      })
      this.triggerEvent('show', { status: 'buy', tuanNum: this.data.property[e.currentTarget.dataset.index], submit_type:1});
    },
    close(){
      this.setData({
        propertyFlag: false
      })
    }
  }
})
