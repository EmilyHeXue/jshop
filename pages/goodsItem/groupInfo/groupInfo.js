// pages/goodsItem/groupInfo/groupInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },
  lifetimes: {
    attached () {
      this.setData({
        area: wx.getStorageSync('area'),
        area_id: wx.getStorageSync('area').uid
      })
      this.getQuanXian()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    area: {},
    area_id: 0,
    groupFlag: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getQuanXian() {
      getApp().merchantPlugin().then(res => {
        console.log(res)
        this.setData({
          groupFlag: res.group_buying
        })
      })
    },
    /**
     * 导航
     * date 2020/4/29
     * @author kang
     */
    navto () {
      wx.openLocation({
        latitude: Number(this.data.area.latitude),
        longitude: Number(this.data.area.longitude),
      })
    }
  }
})
