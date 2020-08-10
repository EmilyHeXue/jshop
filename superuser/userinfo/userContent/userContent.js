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
      this.setData({
        background: '#434959'
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
    background: '#434959'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData() {
      getApp().ajax({
        url: 'distributionCenter'
      }).then(res => {
        console.log(res)
        this.setData({
          data: {...this.data.data, ...res.data}
        })
      })
    },
    tuanLeader() {
      this.setData({
        data: wx.getStorageSync('user')
      })
    },
    go(e){
      console.log()
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  }
})
