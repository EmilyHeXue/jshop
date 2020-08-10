// pages/group/groupcenter/groupCard/groupCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached(){
      this.getShopLeaderTotalCensus()
      this.getShopLeaderTotalToday()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    avatar: wx.getStorageSync('avatar'),
    orderToday:[
      { name: '总订单数', data: 0 },
      { name: '有效订单', data: 0 },
      { name: '付款人数', data: 0 },
      { name: '预估收入', data: 0 }
    ],
    menuList: [
      { name: '待配送', src: '/images/group/groupContent/menu/peisong.png', link: '/group/groupmenbersorder/groupmenbersorder/groupmenbersorder?id=3' },
      { name: '待收货', src: '/images/group/groupContent/menu/shouhuo.png', link: '/group/groupmenbersorder/groupmenbersorder/groupmenbersorder?id=4' },
      { name: '待取货', src: '/images/group/groupContent/menu/quhuo.png', link: '/group/groupmenbersorder/groupmenbersorder/groupmenbersorder?id=5' },
      { name: '已完成', src: '/images/group/groupContent/menu/wancheng.png', link: '/group/groupmenbersorder/groupmenbersorder/groupmenbersorder?id=6' },
      { name: '订单流水', src: '/images/group/groupContent/menu/dingdanliushui.png', link: '/group/groupcommissionwater/groupcommissionwater/groupcommissionwater' },
      //{ name: '我的团员', src: '/images/group/groupContent/menu/wodetuanyuan.png', link: '' },
      //{ name: '推广订单', src: '/images/group/groupContent/menu/qixiatuanzhang.png', link: '/group/promoteOrder/promoteOrder/promoteOrder?id=1' },
      { name: '自提订单', src: '/images/group/groupContent/menu/tuanyuandingdan.png', link: '/group/groupmenbersorder/groupmenbersorder/groupmenbersorder?id=1' },
      { name: '销售额', src: '/images/group/groupContent/menu/xiaoshou.png', link: '/group/groupsales/groupsales/groupsales' },
    ],
    list:[
      { name: '7天销售', nums: 0 },
      { name: '月销售', nums: 0 },
      { name: '总销售', nums: 0 },
      { name: '总订单', nums: 0 },
      //{ name: '总佣金', nums: 0 },
      //{ name: '总件数', nums: 0 },
      //{ name: '我的团员', nums: 0 },
      //{ name: '旗下团长', nums: 9999.99 },
    ]
  },

  /**
   * 组件的方法列表
   * 
   */
  methods: {
    //今日详情
    getShopLeaderTotalToday(){
      getApp().ajax({
        url: 'shopLeaderTotalToday'
      }).then(res => {
        let orderToday = {
          allOrder: res.data.orderCount,
          payNums: res.data.orderUser,
          willPrice: res.data.orderBalance,
          effectiveOrder: res.data.orderValid
        }
        this.setData({
          orderToday
        })
      })
    },
    /**
     * 底部数据
     */
    getShopLeaderTotalCensus(){
      getApp().ajax({
        url: 'shopLeaderTotalCensus'
      }).then(res => {
        let list = [
          { name: '7天销售', nums: res.data.week },
          { name: '月销售', nums: res.data.month },
          { name: '总销售', nums: res.data.count },
          { name: '总订单', nums: res.data.order },
          { name: '总佣金', nums: res.data.balance },
          { name: '总件数', nums: res.data.number },
          { name: '我的团员', nums: res.data.user },
          { name: '旗下团长', nums: res.data.leader },
        ]
        this.setData({
          list
        })
      })
    },
    //页面跳转
    go(e){
      wx.navigateTo({
        url: e.currentTarget.dataset.link,
      })
    }
  }
})
