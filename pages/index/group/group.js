// pages/index/group/group.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    groupFlag:{
      type: Boolean,
      value: false,
      observer (val) {
        if(val){
          console.log('aaaaaa')
          this.getShopInfo()
          this.getData()
          this.setData({
            area: wx.getStorageSync('area').area_name || '',
            avatar: wx.getStorageSync('area').avatar || '',
            background: wx.getStorageSync('background'),
            show: true,
            realname: wx.getStorageSync('area').realname || '',
            leader_name: wx.getStorageSync('leader_name'),
            fans: wx.getStorageSync('area').fans,
            leader_money: wx.getStorageSync('area').leader_money
          })
        }
      }
    },
    isLogin: {
      type: Boolean,
      observer(val) {
        if (val) {
          this.getData()
        }
      }
    },
    leader_id: {
      type: Number,
      observer(val){
        if(val != 0){
          this.getShareTuan(val)
        }
      }
    },
    data: {
      type: Object,
      observer(val) {
        console.log(val)
      }
    },
    reload: {
      type: Boolean,
      observer(val) {
        if (val) {
          this.getTuanConfig()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    avatar: '',
    noavatar: '',
    area: '',
    data: [],
    flag: false,
    background: wx.getStorageSync('background'),
    height:0,
    top:0,
    shopname:'',
    show: false,
    realname: '',
    leader_name: '',
    fans: 0,
    leader_money: 0
  },
  lifetimes: {
    attached() {
      
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取团长信息,并绑定团长
     */
    getShareTuan(leader_id){
      getApp().ajax({
        url: `shopTuanUserInfo/${leader_id}`,
        noLogin: true
      }).then(res => {
        wx.setStorageSync('area', res.data)
        wx.setStorageSync('area_id', res.data.uid)
        this.setData({
          area: res.data.area_name,
          avatar: res.data.avatar,
          realname: res.data.realname,
          fans: res.data.fans,
          leader_money: res.data.leader_money
        })
      })
    },
    /**
     * 获取最后一次绑定团长信息
     */
    getData() {
      getApp().ajax({
        url: 'shopTuanUserLast',
        noLogin: true
      }).then(res => {
        if (this.data.leader_id == 0){
          wx.setStorageSync('area', res.data)
          wx.setStorageSync('area_id', res.data.uid)
          this.setData({
            area: res.data.area_name,
            avatar: res.data.avatar,
            realname: res.data.realname,
            fans: res.data.fans,
            leader_money: res.data.leader_money
          })
        }
      })
    },
    show() { //跳转选择团长页面
      wx.navigateTo({
        url: '/group/changegroup/changegroup/changegroup',
      })
    },
    getShopInfo(){ //获取店铺信息
      app.ajax({
        url: 'ShopAppInfo',
        data: {
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        this.setData({
          shopname: res.data.name,
          noavatar: res.data.pic_url
        })
        wx.setStorageSync('shopInfo', res.data)
        wx.setNavigationBarTitle({
          title: res.data.name
        })
      })
    },
    getTuanConfig(){ //获取团购配置
      app.ajax({
        url: 'shopTuanConfig',
        noLogin: true,
        data:{
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        wx.setStorageSync('leader_name', res.data.data.leader_name)//设置团长别名
        wx.setStorageSync('is_bool', !res.data.is_bool) //是否休市
        wx.setStorageSync('leader_name', res.data.leader_name) //团长名词
        this.triggerEvent('is_bool', { is_bool: res.data.is_bool, close_pic_url: res.data.close_pic_url })
      })
    },
    go(e){
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }
  }
})