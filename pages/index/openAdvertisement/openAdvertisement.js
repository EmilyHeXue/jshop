// pages/index/openAdvertisement/openAdvertisement.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached(){
      if (getApp().globalData.openAdvertisement){
        this.getData()
      }
      
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isOpen: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取开屏广告
     */
    getData() {
      getApp().ajax({
        url: 'shopOpenAdvertisement',
        data: {
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        if (res.data.open_advertisement != null){
          this.setData({
            img: res.data.open_advertisement.img,
            url: res.data.open_advertisement.url,
            isOpen: res.data.open_advertisement.isOpen == "true"
          })
          setTimeout(() => {
            this.setData({
              isOpen: false
            })
          }, 5000)
        }else {
          this.setData({
            isOpen: false
          })
        }
      })
      getApp().globalData.openAdvertisement = false
    },
    /**
     * 
     */
    go () {
      wx.navigateTo({
        url: this.data.url,
      })
    },
    close(){
      this.setData({
        isOpen: false
      })
    }
  }
})
