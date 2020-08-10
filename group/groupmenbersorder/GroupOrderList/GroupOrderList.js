// pages/group/groupmenbersorder/GroupOrderList/GroupOrderList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    List: [
      { 
        order_sn:'123456879',
        status:'代发货',
        pic_url:'/images/clockIn/b.png',
        content:'日日做着同样的事情,循环着与昨日相同的惯例,若能避开猛烈的狂喜,自然不会有悲痛来袭',
        price:'0.01',
        nums:'1',
        avatar:wx.getStorageSync('avatar'),
        nickname:'咸鱼康',
        phone:'15195729049',
        remark:'配送到家 谢谢',
        price2: '1000.00',
        pay:'1000.00'
      }
    ],
    groupid: wx.getStorageSync('user').id
  },

  /**
   * 组件的方法列表
   */
  methods: {
    call (e) {
      if (wx.getStorageSync('user').is_self){
        wx.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.phone,
        })
      }
    },
    go(e){
      wx.navigateTo({
        url: `/pages/payOk/payOk/payOk?order_sn=${e.currentTarget.dataset.order_sn}&isadmin=true`,
      })
    },
    //团长确认收货
    tuanReceiving(e){
      if(wx.getStorageSync('user').is_self){
        getApp().ajax({
          url: 'tuanReceiving',
          method: 'put',
          data: {
            order_sn: e.currentTarget.dataset.order_sn
          }
        }).then(res => {
          wx.showToast({
            title: '收货成功',
            icon: 'none'
          })
          this.triggerEvent('deleteData', { index: e.currentTarget.dataset.index })
        }).catch(err => {
        })
      }else{
        wx.showToast({
          title: '暂无操作权限',
          icon: 'none'
        })
      }
    },
    //订单核销
    tuanConfirm(e){
      if (wx.getStorageSync('user').is_self) {
        getApp().ajax({
          url: 'tuanConfirm',
          method: 'put',
          data: {
            order_sn: e.currentTarget.dataset.order_sn
          }
        }).then(res => {
          wx.showToast({
            title: '核销成功',
            icon: 'none'
          })
          this.triggerEvent('deleteData', { index: e.currentTarget.dataset.index })
        }).catch(res => {
        })
      } else {
        wx.showToast({
          title: '暂无操作权限',
          icon: 'none'
        })
      }
    }
  }
})
