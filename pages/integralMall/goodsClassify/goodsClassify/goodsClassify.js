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
    classifyData: []
  },
  /**
   * 小程序触底方法
  */
  onReachBottom(){
    if(this.data.current_page <= this.data.count){
      this.getShopScoreCategoryAll(this.data.current_page);
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
    this.getShopScoreCategoryAll();
    this.getShopScoreClassGoods(this.options.id)
  },
  /**
   * 获取分类列表数据
  **/
  getShopScoreCategoryAll(){
    getApp().ajax({
      url: 'shopScoreCategoryAll',
      data: {
        parent_id: -1
      }
    }).then(res => {
      this.setData({
        classifyData: res.data
      })
    })
  },
  getShopScoreClassGoods(e){
    getApp().ajax({
      url: 'shopScoreGoods',
      data: {
        category_id: e
      }
    }).then(res => {
      console.log(res)
      this.setData({
        data: res.data
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
    this.getShopScoreClassGoods(data.detail.id);
  }
})