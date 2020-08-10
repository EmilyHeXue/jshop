// pages/createOrder/tab/groupAddress/groupAddress.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    addresstype:{
      type: Number
    },
    flag: {
      type: Boolean
    },
    show: {
      type: Boolean,
      value: false,
      observer (e) {
        if (wx.getStorageSync('area') && e) {
          this.setData({
            area_name: wx.getStorageSync('area').area_name || '',
            group: wx.getStorageSync('area').realname,
            addr: wx.getStorageSync('area').addr,
            avatar: wx.getStorageSync('area').avatar,
            address: wx.getStorageSync('area').addr
          })
        }
      }
    }
  },
  lifetimes: {
    attached (e) {
      this.setData({
        leader_name: wx.getStorageSync('leader_name')
      })
    },
    detached(){
      console.log('我走了')
      this.setData({
        area_name:  '',
        group: '',
        addr: '',
        avatar: '',
        address: ''
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    bg: wx.getStorageSync('background'),
    area_name:  '',
    group: '',
    addr: '',
    avatar: '',
    address: '',
    name: wx.getStorageSync('user').nickname,
    phone: wx.getStorageSync('user').phone,
    leader_name: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    go(e){
      if (e.detail.formId) {
        getApp().addFormId(e.detail.formId)
      }
      wx.navigateTo({
        url: '/group/changegroup/changegroup/changegroup',
      })
      this.setData({
        area_name: '',
        group: '',
        addr: '',
        avatar: '',
        address: ''
      })
    },
    change(e){
      
      if (e.currentTarget.dataset.type == 'name'){
        this.setData({
          name: e.detail.value
        })
      } else if (e.currentTarget.dataset.type == 'phone'){
        this.setData({
          phone: e.detail.value
        })
      } else if (e.currentTarget.dataset.type == 'address'){
        this.setData({
          address: e.detail.value
        })
      }
      let data = {
        name: this.data.name,
        phone: this.data.phone,
        address: this.data.address
      }
    }
  }
})
