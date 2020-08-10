// pages/group/groupcenter/groupContent/groupContent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached () {
      console.log('aaaa')
      this.getData()
      this.tuanLeader()
      this.getDiy()
      this.setData({
        background: wx.getStorageSync('background'),
        leader_name: wx.getStorageSync('leader_name')
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    avatar: wx.getStorageSync('user').avatar,
    balance: 0,
    data:{},
    is_leader: wx.getStorageSync('user').is_leader,
    announcement: '',
    background: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData() {
      wx.request({
        url: `${wx.getStorageSync('url')}shopBalance`,
        header: {
          "Access-Token": wx.getStorageSync('jwt')
        },
        success: res => {
          if (res.data.status === 200) {
            this.setData({
              balance: res.data.data.balance,
              avatar: wx.getStorageSync('user').avatar
            })
          }
        }
      })
    },
    tuanLeader() {
      getApp().ajax({
        url: 'tuanLeader'
      }).then(res => {
        this.setData({
          data: res.data
        })
      }).catch(res => {
      })
    },
    go(e){
      console.log()
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    },
    goInfo (e) {
      if (wx.getStorageSync('Config').leader_level){
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        })
      }
    },
    getDiy(){
      getApp().ajax({
        url: 'shopTuanConfig',
        data:{
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        wx.setStorageSync('leader_name', res.data.data.leader_name) //团长名词
        this.setData({
          announcement: res.data.content,
          leader_name: res.data.leader_name
        })
      })
    }
  }
})
