// pages/comments/comments/comments.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_sn: '',
    data:[],
    page: false,
    background: wx.getStorageSync('background')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '评价订单',
    })
    this.setData({
      order_sn: options.order_sn
    })
    this.getData()
    getApp().postFormIds()
  },
  /**
   * 获取订单数据
   */
  getData () {
    wx.showLoading({
      title: 'Loading',
    })
    wx.request({
      url: `${wx.getStorageSync('url')}shopOrder/${this.data.order_sn}`,
      header: {
        'Access-Token': wx.getStorageSync('jwt')
      },
      success: res => {
        wx.hideLoading()
        if(res.data.status == 200){
          let arr = [];
          for (let i of res.data.data.order) {
            let data = {
              order_id: i.id,
              pic_url: i.pic_url,
              content: '',
              pics_url: [],
              serverId: [],
              describe_score: '',
              express_score: '',
              service_score: '',
            }
            arr.push(data);
          }
          this.setData({
            data: arr
          })
        }
      }
    })
  },
  footerFlag (e) {
    this.setData({
      page: true
    })
  },

  /**
   * post
   */
  post () {
    console.log(this.data.data)
    wx.showModal({
      title: '提示',
      content: '是否发送评论内容?',
      success: res => {
        if(res.confirm){
          this.shopGoodsComment()
        }
      }
    })
  },
  shopGoodsComment () {
    let params = {
      data: JSON.stringify(this.data.data),
      order_sn: this.data.order_sn,
      class: 2
    }
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: `${wx.getStorageSync('url')}shopGoodsComment`,
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Access-Token': wx.getStorageSync('jwt')
      },
      data: params,
      success: res => {
        console.log(res)
        wx.hideLoading()
        if (res.data.status == 200) {
          wx.showToast({
            title: '评价成功',
          })
          wx.redirectTo({
            url: '/pages/order/order/order',
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },

  /**
   * operation
   * type: String 传过来的类型 express_score: 物流服务, service_score: 服务态度, describe_score: 描述相符, content: 评论内容
   * index: Number 当前数据下标
   * data: String/Number 值 评分/评论内容
   */
  operation (e) {
    let type = e.detail.type
    let index = e.detail.index
    let data = e.detail.evaluation
    this.data.data[index][type] = data
    this.setData({
      data: this.data.data
    })
  },

  /**
   * img 图片上传
   */
  img (e) {
    let index = e.detail.index
    let img = e.detail.pics_url
    this.data.data[index].pics_url.push(img)
    this.setData({
      data: this.data.data
    })
  },
  /**
   * 删除图片
   */
  delImg (e) {
    let index = e.detail.index
    let imgindex = e.detail.imgindex
    this.data.data[index].pics_url.splice(imgindex,1)
    this.setData({
      data: this.data.data
    })
  }
})