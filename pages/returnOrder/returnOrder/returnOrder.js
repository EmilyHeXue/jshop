// pages/returnOrder/returnOrder/returnOrder.js
Page({

  /**
   * 页面的初始数据
   * List: Array 循环的数据
   * id: Number 售后订单的各种状态 0: 全部, 1: 处理中, 2: 已同意, 3: 已完成
   * page: Boolean 是否显示footer
   * modalFlag: Boolean 弹出窗是否显示 true: 显示, false: 不显示
   */
  data: {
    List:[],
    id:0,
    modalFlag:false,
    order_sn:'',
    value:'',
    page: false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getApp().postFormIds()
    this.getData(this.data.id); //获取全部的售后订单
    wx.setNavigationBarTitle({
      title: '售后订单',
    })
  },
  
  /**
   * 获取售后订单的数据
   * id 售后订单的各种状态 0: 全部, 1: 处理中, 2: 已同意, 3: 已完成
   */
  getData(id){
    wx.showLoading({
      title: 'Loading',
    })
    wx.request({
      url: `${wx.getStorageSync('url')}shopOrderAfterList`,
      header:{
        'Access-Token':wx.getStorageSync('jwt')
      },
      data:{
        status:id
      },
      method:'get',
      success: res => {
        console.log(res)
        wx.hideLoading()
        if( res.data.status == 200 ){
          this.setData({
            List: res.data.data
          })
        } else if ( res.data.status == 204 ){
          this.setData({
            List: []
          })
        }
      }
    })
  },

  /**
   * 获取更多订单,前提是后台做了分页
   */
  getMoreData () {
    
  },

  /**
   * 接收子组件传过来的值,再去请求售后订单的列表
   */
  change (e) {
    let id = e.detail.id
    this.setData({
      id:id
    })
    this.getData(id)
  },

  /**
   * 填写快递单号
   * order_sn: String 订单号
   */
  fullOrder (e) {
    let order_sn = e.currentTarget.dataset.order_sn
    this.setData({
      order_sn: order_sn,
      modalFlag: true
    })
  },

  /**
   * 文件输入
   */
  write (e) {
    let value = e.detail.value
    this.setData({
      value: value
    })
  },

  /**
   * 点击取消的回调
   */
  canel () {
    this.setData({
      modalFlag: false
    })
  },

  /**
   * 点击确定的回调
   * after_express_number: String 用户填写的快递单号
   * order_sn: String 订单编号
   * type: Number 小程序 1: 微信, 2: 小程序
   */
  ok () {
    if(this.data.value.trim().length == 0 ){
      wx.showToast({
        title: '请填写快递单号',
        icon:'none'
      })
      return false
    }
    let data = {
      after_express_number: this.data.value,
      order_sn: this.data.order_sn,
      type: 2
    }
    wx.request({
      url: `${wx.getStorageSync('url')}shopOrderAfter`,
      data: data,
      method: 'put',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Access-Token': wx.getStorageSync('jwt')
      },
      success: res => {
        if(res.data.status == 200){
          wx.showToast({
            title: '提交成功',
            icon: 'none'
          })
          this.setData({
            modalFlag:false
          })
          this.getData(this.data.id)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          this.setData({
            modalFlag: false
          })
        }
      }
    })
  },
  footerFlag (e) {
    this.setData({
      page:true
    })
  }
})