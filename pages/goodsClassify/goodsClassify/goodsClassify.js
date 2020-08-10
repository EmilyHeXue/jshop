let app = getApp()
Page({

  /**
   * 页面的初始数据
   * id 首页传过来的id,用于获取数据
   * name 首页传过来的分类名称,改变title用的
   * data data组建里循环出来的数据
   * count 总条目数,如果当前页大于或等于总条目数,则不去获取数据
   * current_page 当前页
  **/
  data: {
    id:'',
    name:'',
    data:[],
    count:'',
    current_page:1,
    page:false,
    classifyData: [],
    ajaxFlag: true,
    footerFlag: true,
    cartUpdata: 0
  },
  /**
   * 小程序触底方法
  */
  onReachBottom(){
    if (this.data.ajaxFlag){
      this.getShopClassGoods();
    }
    
  },
  /**
   * 生命周期函数--监听页面显示
  **/
  onShow: function () {
    getApp().postFormIds()
    getApp().setTheme()
    this.setData({
      id:this.options.id,
      name:this.options.name
    })
    wx.setNavigationBarTitle({
      title: this.options.name
    })
    this.getShopCategoryAll();
    this.getMenuList()
  },
  /**
   * 获取一级分类数据
  **/
  getShopCategoryAll(){
    app.ajax({
      url: `shopAdminCategory`,
      data: {
        key: wx.getStorageSync('shopkey'),
        id: this.options.id
      },
    }).then(res => {
      console.log(res)
      wx.setNavigationBarTitle({
        title: res.data.data[0].name,
      })
    })
  },
  /**
   * 获取二级列表
   */
  getMenuList() {
    //shopAdminCategory
    app.ajax({
      url: `shopCategory/${this.options.id}`,
      data: {
        key: wx.getStorageSync('shopkey')
      }
    }).then(res => {
      console.log(res.data)
      this.setData({
        id: res.data[0].id,
        classifyData: res.data
      })
      this.getShopClassGoods()
    }).catch(err => {
    })
  },
  getShopClassGoods(e){
    getApp().ajax({
      url: 'shopGoods',
      data: {
        m_category_id: this.data.id,
        key: wx.getStorageSync('shopkey'),
        current_page: this.data.current_page,
        supplier: this.options.supplier  || 0
      }
    }).then(res => {
      console.log(res)
      let data = this.data.data
      data.push(...res.data)
      this.setData({
        data,
        current_page: this.data.current_page + 1
      })
    }).catch(err => {
      this.setData({
        data: this.data.data,
        ajaxFlag: false
      })
    })
  },
  footerFlag (e) {
    this.setData({
      page:true
    })
  },
  changeData(data){
    this.setData({
      id: data.detail.id,
      name: data.detail.name,
      count:'',
      current_page:1,
      data:[]
    })
    wx.setNavigationBarTitle({
      title: data.detail.name
    })
    this.getShopClassGoods(data.detail.id);
  },
  /**
   * 通知底部菜单更新数据
   * date 2020/4/22
   * @author kang
   */
  cartUpdata(){
    this.setData({
      cartUpdata: this.data.cartUpdata + 1
    })
  }
})