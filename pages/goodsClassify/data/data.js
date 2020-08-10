// pages/goodsClassify/data/data.js.
let app = getApp()
Component({
  /**
   * 组件的属性列表
   * data 分类商品的值
   */
  properties: {
    data:{
      type:Array,
      observer (e) {
        this.setData({
          layerData: e[0]
        })
      }
    },
    classifyData: {
      type: Array,
      observer(e) {
        console.log(e)
        if(e.length != 0){
          this.setData({
            active: e[0].id
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: 1,
    datas: [],
    cartData:{},
    layerData: {},
    layerFlag: false,
    background: '',
    propertyindex: 0,
    nums: 0
  },
  attached(){
    this.getData()
    this.setData({
      background: wx.getStorageSync('background')
    })
  },
  /**
   * 组件的方法列表
   */
  
  methods: {
    /**
     * 跳转到商品详情
    **/
    togoodsItem(data){
      let id = data.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/goodsItem/goodsItem/goodsItem?id=${id}`
      })
    },

    /**
     * 更改分类详情 
     */
    change (e) {
      let id = e.currentTarget.dataset.id
      this.setData({
        active: id
      })
      this.triggerEvent('changeData',{id:id})
    },
    /**
     * 获取购物车数据
     */
    getData () {
      getApp().ajax({
        url: 'shopCart'
      }).then(res => {
        let cartData = Object.fromEntries(res.data.map(e => [e.stock_id, e.number]))
        this.setData({
          cartData,
          nums: res.data.map(e => Number(e.number)).reduce((pre, cur, index) => {
            return Number(pre) + Number(cur)
          })
        })
      })
    },
    /**
     * 添加购物车
     */
    addShopCart (e) {
      console.log(e.currentTarget.dataset.item)
      let item = e.currentTarget.dataset.item
      let index = e.currentTarget.dataset.index
      getApp().ajax({
        url: 'shopCart',
        method: 'post',
        data: {
          goods_id: item.id,
          stock_id: item.stock[index].id,
          number: 1,
          supplier_id: item.supplier_id
        }
      }).then(res => {
        this.triggerEvent('cartUpdata')
        this.getData()
      })
    },
    /**
     * 删减购物车
     */
    reduceShopCart (e) {
      let item = e.currentTarget.dataset.item
      let index = e.currentTarget.dataset.index
      getApp().ajax({
        url: 'shopCart',
        method: 'post',
        data: {
          goods_id: item.id,
          stock_id: item.stock[index].id,
          number: -1,
          supplier_id: item.supplier_id
        }
      }).then(res => {
        this.triggerEvent('cartUpdata')
        this.getData()
      })
    },
    /**
     * 绑定弹窗数据
     */
    bindIndex (e) {
      console.log(this.data.data[e.currentTarget.dataset.index])
      this.setData({
        layerData: this.data.data[e.currentTarget.dataset.index],
        layerFlag: true
      })
    },
    changeindex (e) {
      this.setData({
        propertyindex: e.currentTarget.dataset.index
      })
    },
    show () {
      this.setData({
        layerFlag: false
      })
    }
  }
})
