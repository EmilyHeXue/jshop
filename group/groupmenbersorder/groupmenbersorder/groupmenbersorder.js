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
    type: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      backgroundColor: '#373D4B',
      frontColor: '#ffffff',
    })
    wx.setNavigationBarTitle({
      title: this.data.title,
    })
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('is here')
    this.getmoreData()
  },

  getList (e = {}) {
    let id = e.hasOwnProperty('detail')? e.detail.id : e
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
        console.log(data)
        data.push(...res.data)
        console.log(data)
        this.setData({
          data: data,
          page: this.data.page++
        })
        console.log(this.data.data)
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
  },
  /**
   * 一键收货
   */
  showTime(e){
    console.log(e.detail)
    wx.showModal({
      cancelColor: 'cancelColor',
      content: `是否一键签收从${e.detail.value}发货的订单`,
      success: res => {
        if(res.confirm){
          getApp().ajax({
            url: 'shopTuanReceipt',
            method: 'put',
            data:{
              time: e.detail.value
            }
          }).then(res => {
            wx.showToast({
              title: '一键收货成功',
            })
            this.getList()
          })
        }
      }
    })
  }
})