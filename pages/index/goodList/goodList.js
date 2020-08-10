// pages/goodList/goodList.js
const app = getApp()
let inter
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {},
      observer(val) {
        if(val){
          if (val.details.style == 1) { ///拼团
            this.getGroup()
          } else if (val.details.style == 2) { //秒杀
            this.getSeckill()
          } else if (val.details.style == 3) { //新人专享
            this.getNewPeople()
          }
        }
        
      }
    },
    leave: {
      type: Boolean,
      observer(val) {
        if (val) {
          clearInterval(inter)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    gooddata:[],
    buyPeople: [],
    index: 0,
    name: '',
    avatar: '',
    animation: '',
    first_time:'',
    last_time: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取秒杀商品
     * date 2020/4/16
     * @author kang
     */
    getSeckill(data){
      getApp().ajax({
        url: 'shopFlashSale'
      }).then(fa => {
        try {
          this.setData({
            first_time: fa.data[0].start_time2,
            last_time: fa.data[1].start_time2,
          })
        } catch (err) {
          this.setData({
            first_time: fa.data[0].start_time2,
          })
        }
        this.getSeckillData(fa.data[0].id)
      }).catch(err => {
        this.setData({
          gooddata: []
        })
      })
    },
    getSeckillData(data){
      console.log(typeof data)
      app.ajax({
        url: `shopFlashSale/${typeof data == 'string' ? data : data.currentTarget.dataset.id}`
      }).then(res => {
        console.log(res)
        try {
          this.setData({
            gooddata: res.data.goods
          })
        } catch (err) {
          this.setData({
            gooddata: res.data.goods,
            first_time: fa.data[0].start_time2,
          })
        }
      })
    },
    /**
     * 获取拼团商品
     * date 2020/4/16
     * @author kang
     */
    getGroup(data) {
      getApp().ajax({
        url: 'shopGoods',
        data: {
          is_open_assemble: 1,
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        this.setData({
          gooddata: res.data
        })
        this.getBuy()
      }).catch(err => {
        this.getBuy()
      })
    },
    /**
     * 获取新人专享商品
     * date 2020/4/16
     * @author kang
     */
    getNewPeople(data) {
      getApp().ajax({
        url: 'shopGoods', 
        data: {
          is_recruits: 1,
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        this.setData({
          gooddata: res.data
        })
      }).catch(err => {
        this.setData({
          gooddata: []
        })
      })
    },
    /**
     * 获取购买人
     * date 2020/4/16
     * @author kang
     */
    getBuy() {
      getApp().ajax({
        url: 'shopRandomOrder',
        noLogin: true
      }).then(res => {
        clearInterval(inter)
        this.setData({
          buyPeople: res.data,
          name: res.data[res.data.length - 1].nickname,
          avatar: res.data[res.data.length - 1].avatar,
          animation: 'animation'
        })
        setTimeout(() => {
          this.setData({
            animation: ''
          })
        }, 500)
        this.init()
      })
    },
    /**
     * 滚动消息
     * date 2020/4/17
     * @author kang
     */
    init() {
      let use
      inter = setInterval(() => {
        if (this.data.buyPeople.length == 1 || this.data.buyPeople.length == 0) {
          this.getBuy()
        }

        use = this.data.buyPeople.splice(0, 1)[0]
        try {
          this.setData({
            name: use.nickname,
            avatar: use.avatar,
            animation: 'animation'
          })
          setTimeout(() => {
            this.setData({
              animation: ''
            })
          }, 500)
        } catch (err) {

        }
      }, 5000)
    },
    go(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }
  }
})
