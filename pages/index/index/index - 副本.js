//index.js
//获取应用实例
Page({
  /**
   * show 是否显示登陆栏
   * bannerData 轮播图数据
   * classifyData 分类数据
   * couponsData 红包数据
   * goodsData 商品数据
  **/
  data: {
    show:false, //控制是否显示登录栏
    bannerData:[],
    classifyData:[],
    couponsData:[],
    goodsData:[],
    title:'卷泡商城',
    page:false,
    copyright: wx.getStorageSync('copyright'),
    footer: [],
    shopname:'卷泡商城',
    background:''
  },
  onLoad: function () {
    getApp().postFormIds()
    this.getShopInfo()
    this.getShopData()
    this.getbanner()
    this.shopCategory()
    this.couponsData()
    this.goodsData()
    wx.setNavigationBarTitle({
      title: '卷泡商城'
    })
  },
  /**
   * 获取jwt后再重新获取一遍首页数据
   */
  getjwt(data){
    this.getbanner()
    this.shopCategory()
    this.couponsData()
    this.goodsData()
  },
  /**
   * 没有jwt,则控制登陆框显示
  **/
  nojwt(data){
    this.setData({
      show:true
    })
  },
  /**
   * 获取轮播图
  **/
	getbanner:function(){
		wx.request({
      url: wx.getStorageSync('url') + 'ShopBanner',
      method:"get",
      data: {
        key: wx.getStorageSync('shopkey'),
        type: 2
      },
      header:{
        'Access-Token':wx.getStorageSync("jwt")
      },
      success:res => {
        if(res.data.status == 200){
          this.setData({
            bannerData:res.data.data
          })
        }else if(res.data.status == 1001){
          this.setData({
            show:true
          })
        }
      }
    })
	},
  /**
   * 获取菜单
  **/
  shopCategory(){
    wx.request({
      url:wx.getStorageSync('url') + 'shopCategory',
      method:"get",
      data:{
        key: wx.getStorageSync('shopkey')
      },
      header:{
        'Access-Token':wx.getStorageSync('jwt')
      },
      success:res => {
        if(res.data.status == 200){
          this.setData({
            classifyData:res.data.data
          })
        }
      }
    })
  },
  /**
   * 获取红包
  **/
  couponsData(){ 
    wx.request({
      url:wx.getStorageSync('url') + 'ShopRedEnvelope',
      method:"get",
      data: {
        key: wx.getStorageSync('shopkey')
      },
      header:{
        'Access-Token':wx.getStorageSync('jwt')
      },
      success:res => {
        if(res.data.status == 200){
          this.setData({
            couponsData:res.data.data
          })
        }
      }
    })
  },
  /**
   * 获取推荐商品
  **/
  goodsData(){
    wx.request({
      url:wx.getStorageSync('url') + 'shopIsTopGoods',
      method:"get",
      data: {
        key: wx.getStorageSync('shopkey')
      },
      header:{
        'Access-Token':wx.getStorageSync('jwt')
      },
      success:res => {
        if(res.data.status == 200){
          this.setData({
            goodsData:res.data.data
          })
        }
      }
    })
  },
  /**
   * 是否显示底部导航栏
  */
  show (e) {
    this.setData({
      page: true
    })
  },
  /**
   * 获取店铺版权
   */
  getShopData () {
    wx.request({
      url: `${wx.getStorageSync('url')}shopTheme`,
      data: {
        key: wx.getStorageSync('shopkey')
      },
      success: res => {
        if(res.data.status == 200){
          let img = res.data.data.copyright
          let footer = res.data.data.navigation
          this.setData({
            copyright: img,
            footer: footer
          })
          wx.setStorageSync('copyright', img)
          wx.setStorageSync('footer', footer)
          console.log('index 169', footer[0].filePut)
        }
      }
    })
  },

  /**
   * 获取店铺信息
   */
  getShopInfo () {
    wx.request({
      url: `${wx.getStorageSync('url')}ShopAppInfo`,
      data: {
        key: wx.getStorageSync('shopkey')
      },
      success: res => {
        console.err('获取店铺信息')
        if (res.data.status == 200) {
          this.setData({
            shopname: res.data.data.name
          })
          wx.setNavigationBarTitle({
            title: res.data.data.name,
          })
        }
      }
    })
  },

  /**
   * 分享
   */
  onShareAppMessage: function () {
    return {
      title: `${this.data.shopname}`,
      path: '/pages/index/index/index'
    }
  },
  setbackground(data){
    console.log('背景色',data.detail.color)
    this.setData({
      background: data.detail.color
    })
  }
})
