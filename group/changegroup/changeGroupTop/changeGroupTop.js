// pages/group/changegroup/changeGroupTop/changeGroupTop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes:{
    attached(){
        this.setData({
          avatar: wx.getStorageSync('area').avatar || '/images/my/info/noLogin.png',
          name: wx.getStorageSync('area').realname || '',
          area_name: wx.getStorageSync('area').area_name || '',
          address: wx.getStorageSync('area').addr || '',
          show:true,
          status: !wx.getStorageSync('user').is_leader,
          background: wx.getStorageSync('background'),
          leader_name: wx.getStorageSync('leader_name')
        })
    },
    detached(){
      this.setData({
        avatar: '',
        name: '',
        area_name: '',
        address: '',
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    avatar: '',
    name: '',
    area_name: '',
    address: '',
    background: wx.getStorageSync('background'),
    show: false,
    status: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    search(e){
      this.triggerEvent('search', { area_name: e.detail.value })
    },
    go(){
      wx.navigateTo({
        url: '/group/groupbrochure/groupbrochure',
      })
    },
    changeLocation(){
      this.triggerEvent('getData')
    }
  }
})
