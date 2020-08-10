// pages/fixedIcon/fixedIcon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(val) {
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showFlag: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    go (e) {
      console.log(e.currentTarget.dataset.url)
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    },
    show () {
      this.setData({
        showFlag: !this.data.showFlag
      })
    },
    toShare () {
      wx.navigateTo({
        url: '/pages/share/share?type=1',
      })
    },
    toTop () {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    },
    toclip(){
      wx.setClipboardData({
        data: ''.padStart(300, '1'),
      })
    }
  }
})
