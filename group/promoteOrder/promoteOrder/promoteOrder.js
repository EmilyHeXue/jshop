// pages/group/groupmenbersorder/groupmenbersorder.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   * 
   */
  data: {
    title:'团员订单',
    status: 1,
    data:[],
    page:1,
    flag: true,
    text: '',
    type: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '推广订单',
    })
    wx.setNavigationBarColor({
      backgroundColor: '#373D4B',
      frontColor: '#ffffff',
    })
    console.log(options)
    if (options.uid){
      this.setData({
        status: 1
      })
      this.search(options.uid)
    }else{
      this.setData({
        status: options.id || 1
      })
      this.getList(this.data.status)
    }
    
    app.postFormIds()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getmoreData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getList (e) {
    let id = e.detail ? e.detail.id : e
    this.setData({
      status: id,
      flag: true,
      page: 1,
      text: ''
    })
    app.ajax({
      url: `tuanOrder/${wx.getStorageSync('user').id || 0}`,
      data: {
        order_status: id,
        page: this.data.page,
        text: this.data.text,
        type: this.data.type
      }
    }).then(res => {
      for(let i of res.data){
        i.address = i.address.slice(0, i.address.length - 7)
      }
      this.setData({
        data: res.data,
        page: this.data.page + 1
      })
    }).catch(err => {
      this.setData({
        data: []
      })
    })
  },
  getmoreData(){
    if(this.data.flag){
      app.ajax({
        url: `tuanOrder/${wx.getStorageSync('user').id}`,
        data: {
          order_status: this.data.status,
          page: this.data.page,
          text: this.data.text,
          type: this.data.type
        }
      }).then(res => {
        for (let i of res.data) {
          i.address = i.address.slice(0, i.address.length - 7)
        }
        let data = this.data.data
        data = data.push(...res.data)
        this.setData({
          data: data,
          page: this.data.page++
        })
      }).catch(err => {
        this.setData({
          flag: false
        })
      })
    }
    
  },
  deleteData(e){
    console.log(e.detail)
    let list = this.data.data
    list.splice(e.detail.index,1)
    this.setData({
      data: list
    })
  },
  //搜索订单
  search(e){
    let text = e.detail ? e.detail.text : e
    this.setData({
      flag: true,
      page: 1,
      text
    })
    app.ajax({
      url: `tuanOrder/${wx.getStorageSync('user').id || 0}`,
      data:{
        order_status: this.data.status,
        page: this.data.page,
        text,
        type: this.data.type
      }
    }).then(res => {
      for (let i of res.data) {
        i.address = i.address.slice(0, i.address.length - 7)
      }
      this.setData({
        data: res.data,
        page: this.data.page + 1
      })
    }).catch(err => {
      this.setData({
        data: []
      })
    })
  }
})