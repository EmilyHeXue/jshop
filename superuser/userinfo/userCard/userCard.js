// pages/group/groupcenter/groupCard/groupCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached(){
      this.setData({
        shopname: wx.getStorageSync('shopName'),
        shopavatar: wx.getStorageSync('shopAvatar')
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    shopname: '',
    shopavatar: ''
  },
  onShareAppMessage() {
    return {
      title: wx.getStorageSync('shopInfo').name,
      path: `/pages/index/index/index?id=${wx.getStorageSync('user').id}&leader_id=${wx.getStorageSync('area_id')}`,
      imageUrl: wx.getStorageSync('shopInfo').default_pic_url
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //页面跳转
    go(e){
      console.log(e)
      wx.navigateTo({
        url: e.currentTarget.dataset.link,
      })
    }
  }
})
