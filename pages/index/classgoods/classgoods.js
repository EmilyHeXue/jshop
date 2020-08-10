// pages/classgoods/classgoods.js
let inter = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type: Object,
      observer (val) {
        if(val.id){
          if(val.details.type == 1){
            this.getList()
          }else{
            this.getshopGrouping()
          }
          this.getTime()
        } 
      }
    },
    pageFlag: {
      type: Number,
      observer(val){
        this.getData(this.data.m_category_id)
      }
    },
    background: {
      type: String
    },
    reload: {
      type: Boolean,
      observer(val) {
        if(val){
          this.setData({
            menuData: [],
            current_page: 1,
            ajaxFlag: true,
          })
          this.getData(this.data.m_category_id)
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
  lifetimes:{
    attached () {
      this.getShopCart()
    },
    detached: function (){
      clearInterval(inter)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    chooseindex: -1,
    menuList: [],
    menuData: [],
    headerFlag:1,
    m_category_id:0, //商品分类id
    ontime:{ //剩余时间
      hours: '24',
      minutes: '00',
      seconds: '00'
    },
    willtime: { //开始时间
      hours: '24',
      minutes: '0',
      seconds: '0'
    },
    current_page: 1,
    ajaxFlag: true,
    is_open: false,
    cartList: {}
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //获取所有二级分类
    getList () {
      wx.request({
        url: `${wx.getStorageSync('url')}shopSubCategory`,
        data: {
          key: wx.getStorageSync('shopkey')
        },
        success: res => {
          if(res.data.status === 200){
            this.setData({
              menuList: res.data.data,
              is_open: wx.getStorageSync('Config').is_stock
            })
            this.getData(0)
          }
        }
      })
    },
    //获取指定二级分类商品数据
    getData (id) {
      if (this.data.ajaxFlag){
        this.setData({
          ajaxFlag: false
        })
        let data = {
          key: wx.getStorageSync('shopkey'),
          current_page: this.data.current_page
        }
        if (id != 0) {//如果id不是0, 则设置指定二级分类id
          data.m_category_id = id
        }
        if (this.data.headerFlag == 2) {//是否预售商品, 是的话设置data的type
          data.type = 1
        }
        this.triggerEvent('loading',{status: true})
        getApp().ajax({
          url: 'shopGoods',
          data
        }).then(res => {
          
          this.setData({
            menuData: [...this.data.menuData, ...res.data.map(e => {
              return {
                ...e,
                format_start_time1: e.format_start_time1.replace(/\:/, '-'),
                format_end_time1: e.format_end_time1.replace(/\:/, '-')
              }
            })],
            current_page: this.data.current_page + 1,
            m_category_id: id,
            ajaxFlag: true
          })
          this.triggerEvent('loading', { status: false })
        }).catch(err => {
          this.setData({
            menuData: this.data.menuData,
            m_category_id: id
          })
          this.triggerEvent('loading', { status: false })
        })
      }
    },
    //切换分类商品数据
    change (e) {
      if (this.data.data.details.type == 1 || e.currentTarget.dataset.id == 0){
        this.setData({
          chooseindex: e.currentTarget.dataset.index,
          menuData: [],
          current_page: 1,
          ajaxFlag: true,
          m_category_id: e.currentTarget.dataset.id
        })
        this.getData(e.currentTarget.dataset.id)
      }else{
        this.setData({
          chooseindex: e.currentTarget.dataset.index,
          menuData: [],
          current_page: 1,
          ajaxFlag: true,
          m_category_id: e.currentTarget.dataset.id
        })
        this.getshopGroupGoods()
      }
      
    }, 
    //商品详情跳转
    go(e){
      clearInterval(inter)
      if (e.currentTarget.dataset.is_bargain){
        wx.navigateTo({
          url: `/bargaining/pages/goodItem/goodItem/goodItem?id=${e.currentTarget.dataset.id}`,
        })
      }else{
        wx.navigateTo({
          url: `/pages/goodsItem/goodsItem/goodsItem?id=${e.currentTarget.dataset.id}`,
        })
      }
    },
    //却换头部显示
    changeHeader(e){
      this.setData({
        headerFlag: e.currentTarget.dataset.type,
        chooseindex: -1,
        current_page: 1,
        menuData:[],
        ajaxFlag: true
      })
      this.getData(0)
    },
    getTime(){//获取休市时间
      wx.request({
        url: `${wx.getStorageSync('url')}shopTuanConfig`,
        data: {
          key: wx.getStorageSync('shopkey')
        },
        header: {
          'Access-Token': wx.getStorageSync('jwt')
        },
        success: res => {
          console.log(res.data)
          if (res.data.status === 200) { //如果查询到数据
            wx.setStorageSync('leader_name', res.data.data.leader_name) //团长名词
            let timedown = new countdown(res.data.data.open_time, res.data.data.close_time) //申明倒计时对象
            this.setData({
              ontime: timedown.init_start_time(),
              willtime: timedown.init_close_time()
            })
            inter = setInterval(() => {
              this.setData({
                ontime: timedown.init_start_time(), 
                willtime: timedown.init_close_time()
              })
            }, 1000)
          }
        }
      })
    },
    /**
     * 获取购物车数据
     */
    getShopCart () {
      getApp().ajax({
        url: 'shopCart',
        noLogin: true
      }).then(res => {
        let obj = {}
        for(let i of res.data){
          obj[i.stock_id] = i.number
        }
        this.setData({
          cartList: obj
        })
      }).catch(err => {
        this.setData({
          cartList: {}
        })
      })
    },
    /**
     * 操作购物车
     */
    changeCart (e) {
      getApp().ajax({
        url: 'shopCart',
        method: 'post',
        data: {
          goods_id: e.currentTarget.dataset.goods_id,
          stock_id: e.currentTarget.dataset.stock_id,
          number: e.currentTarget.dataset.type == 'reduce' ? -1 : 1
        }
      }).then(res => {
        this.getShopCart()
        this.triggerEvent('cartUpdata')
      })
    },
    /**
     * 获取商品分组
     */
    getshopGrouping(){
      getApp().ajax({
        url: 'shopGrouping',
        noLogin: true,
        data: {
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        console.log(res)
        this.setData({
          menuList: res.data
        })
        this.getData(0)
      })
    },
    /**
     * 获取商品分组商品
     */
    getshopGroupGoods() {
      this.setData({
        ajaxFlag: false
      })
      getApp().ajax({
        url: 'shopGroupingGoods',
        noLogin: true,
        data: {
          key: wx.getStorageSync('shopkey'),
          grouping_id: this.data.m_category_id,
          page: this.data.current_page
        }
      }).then(res => {
        this.setData({
          menuData: [...this.data.menuData, ...res.data.map(e => {
            return {
              ...e,
              format_start_time1: e.format_start_time1.replace(/\:/, '-'),
              format_end_time1: e.format_end_time1.replace(/\:/, '-')
            }
          })],
          ajaxFlag: true,
          current_page: this.data.current_page + 1
        }) 
        this.triggerEvent('loading', { status: false })
      })
    }
  }
})


class countdown {
  constructor(start_time = 0, close_time = 0) {
    console.log(start_time, close_time)
    this.close_time_will = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, parseInt(close_time / 3600), parseInt(close_time % 3600 / 60), close_time % 60).getTime()
    this.close_time_on = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), parseInt(close_time / 3600), parseInt(close_time % 3600 / 60), close_time % 60).getTime()
    this.start_time_will = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, parseInt(start_time / 3600), parseInt(start_time % 3600 / 60), start_time % 60).getTime()
    this.start_time_on = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), parseInt(start_time / 3600), parseInt(start_time % 3600 / 60), start_time % 60).getTime()
    console.log(this.start_time_will, this.start_time_on  )
  }

  init_close_time() {
    let interval = new Date().getTime() < this.close_time_on ? parseInt((this.close_time_on - new Date().getTime() ) / 1000) : parseInt((this.close_time_will - new Date().getTime()) / 1000) //判断停止时间是今天还是明天

    let hour = parseInt(interval / 3600).toString().padStart(2, 0)
    let minute = parseInt(interval % 3600 / 60).toString().padStart(2, 0)
    let second = parseInt(interval % 60).toString().padStart(2, 0)
    return { hour, minute, second }
  }

  init_start_time() {
    let interval = new Date().getTime() < this.start_time_on ? parseInt((this.start_time_on -new Date().getTime()) / 1000) : parseInt((this.start_time_will - new Date().getTime()) / 1000) //判断停止时间是今天还是明天
    let hour = parseInt(interval / 3600).toString().padStart(2, 0)
    let minute = parseInt(interval % 3600 / 60).toString().padStart(2, 0)
    let second = parseInt(interval % 60).toString().padStart(2, 0)
    return { hour, minute, second }
  }
}