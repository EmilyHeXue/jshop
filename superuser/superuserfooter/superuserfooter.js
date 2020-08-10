// pages/group/groupfooter/groupfooter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name:{
      type: String,
      observer (e) {
        console.log(e)
      }
    }
  },
  /**
   * 组件生命周期
   */
  lifetimes: {
    attached () {
      wx.setNavigationBarColor({
        frontColor: this.data.fontColor,
        backgroundColor: this.data.background
      })
      wx.setNavigationBarTitle({
        title: this.data.name
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    menu:[
      { name: '店铺首页', url: '/pages/index/index/index', picurl: '/images/group/groupfooter/ft1.png', selectpicurl: '/images/group/groupfooter/ft1-on.png' },
      //{ name: '团员订单', url: '/group/groupmenbersorder/groupmenbersorder/groupmenbersorder', picurl: '/images/group/groupfooter/ft2.png', selectpicurl: '/images/group/groupfooter/ft2-on.png' },
      //{ name: '销售额', url: '/group/groupsales/groupsales/groupsales', picurl: '/images/group/groupfooter/ft3.png', selectpicurl: '/images/group/groupfooter/ft3-on.png' },
      { name: `${wx.getStorageSync('leader_name')}中心`, url: '/group/groupcenter/groupcenter/groupcenter', picurl: '/images/group/groupfooter/ft4.png', selectpicurl: '/images/group/groupfooter/ft4-on.png' },
    ],
    text_selection: wx.getStorageSync('text_selection'),
    background: wx.getStorageSync('background'),
    fontColor: wx.getStorageSync('nabigationFontColor')
  },

  /**
   * 组件的方法列表
   * e.currentTarget.dataset.name 路由名称
   * this.data.name 路由名称
   * e.currentTarget.dataset.url 路由url
   */
  methods: {
    go (e) {
      if (e.currentTarget.dataset.name == '扫码'){
        wx.scanCode({
          success: res => {
            if (wx.getStorageSync('user').is_self) {
              if (JSON.parse(res.result).order_sn){
                this.tuanConfirm(JSON.parse(res.result).order_sn)
              }else{
                wx.navigateTo({
                  url: `/group/groupmenbersorder/groupmenbersorder/groupmenbersorder?uid=${JSON.parse(res.result).uid}`,
                })
              }
            }
          }
        })
      }else if (e.currentTarget.dataset.name !== this.data.name){
        wx.redirectTo({
          url: e.currentTarget.dataset.url,
        })
      } 
    },
    tuanConfirm(order_sn) {
      getApp().ajax({
        url: 'tuanConfirm',
        method: 'put',
        data: {
          order_sn: order_sn
        }
      }).then(res => {
        wx.showToast({
          title: '核销成功',
          icon: 'none'
        })
        this.triggerEvent('deleteData', { index: e.currentTarget.dataset.index })
      }).catch(res => {
      })
    }
  }
})
