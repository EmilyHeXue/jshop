// pages/home/address/address.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   * addressData 地址列表
  **/
  data: {
    addressData:'',
    noLogin: false
  },
  /**
   * 生命周期函数--监听页面显示
  **/
  onShow: function () {
    getApp().postFormIds()
    app.setTheme()
    this.shopContact();
    wx.setNavigationBarTitle({
      title: '收货地址'
    })
  },
  /**
   * 获取收货地址
  **/
  shopContact(){
    getApp().ajax({
      url: 'shopContact'
    }).then(res => {
      this.setData({
        addressData:res.data
      })
    }).catch(err => {
      this.setData({
        addressData:[]
      })
    })
  },
  /**
   * 编辑收货地址
   */
  edit (e) {
    wx.navigateTo({
      url: `../addAddress/addAddress?id=${e.currentTarget.dataset.id}`
    })
  },
  /**
   * 删除收货地址
  **/
  delData(e){
    wx.showModal({
      title:'提示',
      content:'确定删除该收货地址?',
      success: res => {
        if(res.confirm){
          getApp().ajax({
            url: `shopContact/${e.currentTarget.dataset.id}`,
            method:'delete'
          }).then(res => {
            this.shopContact();
            wx.showToast({
              title:'删除成功',
              icon:'success',
              duration:1000
            })
          })
        }
      }
    })
  },
  /**
   * 跳转到新建
  */
  go(){
    wx.navigateTo({
      url: '../addAddress/addAddress'
    })  
  },
  /**
   * 跳转到我的
  */
  back(){
    wx.switchTab({
      url: '../my/my'
    })  
  }
})