// pages/group/creategroup/creategroup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu: ['地下城与勇士', '英雄连门', '假面骑士 zi-o', '假面骑士 ooo', '梦比优斯奥特曼'],
    avatar: wx.getStorageSync('avatar'),
    nick_name: '',
    sex: ['男', '女', '保密'],
    sexIndex: 0,
    name: '',
    phone: '',
    area: '',
    latitude: '',
    longitude: '',
    address: '',
    addr: '',
    vercode: '',
    close_pic_url: '',
    remark: '',
    flag: false,
    leader_name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().setTheme()
    if (options) {
      console.log('dosome')
    }
    this.getData()
    getApp().postFormIds()
  },
  show() {
    this.setData({
      flag: !this.data.flag
    })
  },
  getData() {
    wx.request({
      url: `${wx.getStorageSync('url')}shopTuanConfig`,
      data: {
        key: wx.getStorageSync('shopkey')
      },
      method: 'get',
      header: {
        'Access-Token': wx.getStorageSync('jwt')
      },
      success: res => {
        console.log(res)
        this.setData({
          close_pic_url: res.data.data.close_pic_url,
          leader_name: wx.getStorageSync('leader_name')
        })
      }
    })
  },
  postData(e) {
    this.setData({
      remark: e.detail.formId
    })
    let json = [...new Set([...wx.getStorageSync('FormIds'), e.detail.formId])]
    wx.setStorageSync('FormIds', json)
    let data = e.detail.value
    wx.request({
      url: `${wx.getStorageSync('url')}shopTuanUser`,
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Access-Token': wx.getStorageSync('jwt')
      },
      method: 'post',
      success: res => {
        console.log(res)
        if (res.data.status == 200) {
          wx.showToast({
            title: '申请提交完毕,请等待商家审核',
            icon: 'none'
          })
          setTimeout(() => {
            console.log('do something')
          }, 1000)
        } else if (res.data.status == 500) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },
  chooseSex(e) {
    this.setData({
      sexIndex: e.detail.value
    })
  },
  chooseAddress(e) {
    this.setData({
      province_code: e.detail.code[0],
      city_code: e.detail.code[1],
      area_code: e.detail.code[2],
      address: e.detail.value
    })
  },
  chooseArea(e) {
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        this.setData({
          area: res.name,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
    })
  },
  getVercode() {
    console.log(this.data.phone)
    if ("" == this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false
    }
    if (!/^[1][0-9][0-9]{9}$/.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      })
      return false
    }
    wx.request({
      url: `${wx.getStorageSync('url')}sms`,
      data: {
        phone: this.data.phone
      },
      header: {
        'Access-Token': wx.getStorageSync('jwt')
      },
      success: res => {
        console.log(res)
      }
    })
  }
})