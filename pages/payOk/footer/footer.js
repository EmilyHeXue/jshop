// pages/footer/footer.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    menu: [
    ],
    show: true,
    url: '',
    text_selection: '',
    bottom_text: ''
  },
  attached() {
    this.tof()
    this.getThen()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tof() {
      if (app.globalData.status) {
        setTimeout(() => {
          this.getData()
        }, 200)
      } else {
        setTimeout(() => {
          return this.tof()
        }, 200)
      }
    },
    getData() {
      let footer = wx.getStorageSync('footer')
      let url = getCurrentPages()[getCurrentPages().length - 1].route
      let arr = []
      let flag = false
      for (let i of footer) {
        let str = i.choice_page_url.split('?')[0].substr(1)
        arr.push(str)
        if (str == url) {
          flag = true
          this.triggerEvent('show', { flag: true })
        }
      }
      this.setData({
        menu: footer,
        url: url,
        show: true,
        menuUrl: arr
      })
    },
    go(e) {
      let url = e.currentTarget.dataset.url
      if (url.substr(1) != this.data.url) {
        wx.redirectTo({
          url: url
        })
      }
    },
    getThen() {
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
            this.triggerEvent('background', { color: res.data.data.theme })
          }
        }
      })
    }
  }
})
