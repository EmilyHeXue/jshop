// pages/address/address.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(val) {
        if(val.details){
          this.setData({
            marker: [{ 
              id: 1, 
              latitude: val.details.lat, 
              longitude: val.details.lon, 
              title: val.details.name, 
              zIndex: 999
            }]
          })
        }
      }
    }
  },

  lifetimes:{
    attached(){
      this.setData({
        map: wx.createMapContext('address', this)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    marker:[],
    map:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navgar(e){
      wx.openLocation({
        latitude: parseFloat(e.currentTarget.dataset.lat),
        longitude: parseFloat(e.currentTarget.dataset.lon),
      })
    }
  }
})
