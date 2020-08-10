// pages/footer/footer.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cartUpdata: {
      type: Number,
      observer() {
        this.getCartData()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    menu:[
      { name: '卷泡商城', url: '/pages/index/index/index', pic_url: '/images/footer/index.png', unpic_url: '/images/footer/unindex.png' },
      { name: '购物车', url: '/pages/shopCart/shopCart/shopCart', pic_url: '/images/footer/shopcart.png', unpic_url: '/images/footer/unshopcart.png' },
      { name: '个人中心', url: '/pages/home/my/my', pic_url: '/images/footer/my.png', unpic_url: '/images/footer/unmy.png' }
    ],
    show:false,
    url:'',
    text_selection: '',
    bottom_text: '',
    nums: 0
  },
  attached () {
    this.tof()
    this.getThen()
    this.getCartData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tof () {
      if(!wx.getStorageSync('footer')){
        getApp().getColor().then(res=> {
          let nabigationFontColor = res.theme_text == "white" ? "#ffffff" : "#000000"
          let theme = res.theme

          wx.setStorageSync('background', theme)
          wx.setStorageSync('copyright', res.copyright)
          wx.setStorageSync('nabigationFontColor', nabigationFontColor)
          console.log(res.copyright)

          let footer = res.navigation
          wx.setStorageSync('footer', footer)

          let text_selection = res.text_selection
          let bottom_text = res.bottom_text
          wx.setStorageSync('text_selection', text_selection)
          wx.setStorageSync('bottom_text', bottom_text)
          this.getData()
        })
      }else{
        this.getData()
      }
    },
    getData () {
      let footer = wx.getStorageSync('footer')
      let url = getCurrentPages()[getCurrentPages().length - 1].route
      let arr = []
      let flag = false
      for(let i of footer){
        let str = i.choice_page_url.split('?')[0].substr(1)
        arr.push(str)
        if (str == url){
          flag = true
          this.triggerEvent('show',{flag: true})
        }
      }
      this.setData({
        menu: footer,
        url: url,
        show: flag,
        menuUrl: arr
      })
    },
    go (e) {
      let url = e.currentTarget.dataset.url
      if (url.substr(1) != this.data.url){
        wx.redirectTo({
          url: url
        })
      }
    },
    getThen () {
      wx.request({
        url: `${wx.getStorageSync('url')}shopThemes`,
        data: {
          key: wx.getStorageSync('shopkey')
        },
        success: res => {
          if (res.data.status == 200) {
            wx.setNavigationBarColor({
              frontColor: res.data.data.theme_text == "white" ? "#ffffff" : "#000000",
              backgroundColor: res.data.data.theme
            })
            
            this.setData({
              text_selection: res.data.data.text_selection,
              bottom_text: res.data.data.bottom_text
            })
            wx.setStorageSync('background', res.data.data.theme)
            wx.setStorageSync('text_selection', res.data.data.text_selection)
            console.error('eeee')
            this.triggerEvent('background', { color: res.data.data.theme })
          }
        }
      })
    },
    /**
     * 获取购物车数据
     */
    getCartData() {
      getApp().ajax({
        url: 'shopCart',
        noLogin: true
      }).then(res => {
        let cartData = Object.fromEntries(res.data.map(e => [e.stock_id, e.number]))
        this.setData({
          nums: res.data.map(e => Number(e.number)).reduce((pre, cur, index) => {
            return Number(pre) + Number(cur)
          })
        })
      })
    }
  }
})
