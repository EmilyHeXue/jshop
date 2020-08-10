// bargaining/pages/goodItem/layer/layer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(val) {
        if(val.name){
          this.getProperty1(val.property1)
          if (val.property2.length != 0){
            let property2 = {
              name: val.property2.split(':')[0],
              data: val.property2.split(':')[1].split(','),
              flag: 0
            }
            this.setData({
              property2
            })
          }
        }
      }
    },
    isBuy: {
      type: Boolean,
      observer (val) {
        if(!val) {
          this.setData({
            num: 1
          })
        }
      }
    },
    layerFlag: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    property1:{},
    property2: {},
    picUrl: '',
    gooddetail: {},
    num: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideLayer () {
      this.triggerEvent('hideLayer', { flag: false })
    },
    getProperty1(property) {
      let property1 = {
        name: property.split(':')[0],
        data: property.split(':')[1].split(','),
        flag: 0
      }
      this.setData({
        property1,
      })
      this.getProperty2List(property1)
    },
    /**
     * 获取二级规格列表
     */
    getProperty2List(e) {
      let property1_name
      let property1 = this.data.property1
      try{
        property1_name = e.data[e.flag]
      }catch(err){
        property1_name = e.currentTarget.dataset.name
        property1.flag = e.currentTarget.dataset.index
      }
      getApp().ajax({
        url: `shopGoodsStockProperty/${this.data.data.id}`,
        data: {
          property1_name,
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        let property2
        let data = [];
        res.data.map((item) => {
          data.push(item.property2_name)
        })
        console.log(data)
        property2 = {
          name: this.data.property2.name,
          data: data,
          flag: 0
        }
        this.setData({
          property2,
          property1
        })
        console.log(property1)
        this.getProperty2Detail(property2)
      })
    },
    /**
     * 获取规格详情
     */
    getProperty2Detail(e){
      let property2 = this.data.property2
      let ajaxData
      if (e.currentTarget){
        ajaxData = {
          property1_name: this.data.property1.data[this.data.property1.flag],
          property2_name:  e.currentTarget.dataset.name ,
          key: wx.getStorageSync('shopkey')
        }
        property2.flag = e.currentTarget.dataset.index
      }else {
        ajaxData = {
          property1_name: this.data.property1.data[this.data.property1.flag],
          property2_name: e.data[e.flag] || '',
          key: wx.getStorageSync('shopkey')
        }
      }
      
      getApp().ajax({
        url: `shopGoodsStock/${this.data.data.id}`,
        data: ajaxData
      }).then(res => {
        console.log(res)
        this.setData({
          gooddetail: res.data,
          property2
        })
      })
    },
    /**
     * 立即购买
     */
    tobuy(){
      if (this.data.sales == 0) {
        wx.showToast({
          title: '该商品已售罄,请联系卖家补货',
          icon: 'none'
        })
        return false
      }
      if (wx.getStorageSync('is_bool')) {
        wx.showToast({
          title: '现在是休市时间,无法购买, 请将商品加入购物车',
          icon: 'none'
        })
        return false
      }
      getApp().ajax({
        url: 'shopUserInfo'
      }).then(res => {
        let data = [{
          supplier_id: this.data.data.supplier_id,
          supplier_name: this.data.data.supplier_name,
          list: [{
            goods_id: this.data.data.id,
            goods_name: this.data.gooddetail.name,
            price: this.data.gooddetail.price,
            number: this.data.num,
            total_price: this.data.gooddetail.price * this.data.num,
            property1_name: this.data.property1.data[this.data.property1.flag],
            property2_name: this.data.property2.data[this.data.property2.flag],
            pic_url: this.data.gooddetail.pic_url,
            stock_id: this.data.gooddetail.id,
            service_goods_is_ship: this.data.data.service_goods_is_ship,
            type: this.data.data.type
          }]
        }]
        wx.setStorageSync('shopcartData', data)
        wx.navigateTo({
          url: `/pages/createOrder/createOrder/createOrder?group_id=${this.data.group_id}`
        })
      })
    },
    /**
     * 发起砍价
     */
    toBargaining(){
      getApp().ajax({
        url: 'shopBargain',
        method: 'post',
        data: {
          name: this.data.gooddetail.name,
          goods_id: this.data.data.id,
          stock_id: this.data.gooddetail.id
        }
      }).then(res => {
        wx.navigateTo({
          url: `/bargaining/pages/buyDetail/buyDetail?id=${res.data}`
        })
      })
    },
    /**
     * 减少商品数量
    */
    subtract() {
      this.setData({
        num: this.data.num == 1 ? this.data.num : this.data.num - 1
      })
    },
    /**
     * 添加商品数量
    */
    add() {
      if (this.data.isBuy) {
        this.setData({
          num: this.data.num == this.data.gooddetail.number ? this.data.num : this.data.num + 1
        })
      }
      console.log(this.data.property2)
    },
    /**
     * 提交订阅消息
     */
    postSubscribeMessage(){
      let empList = []
      empList.push(wx.getStorageSync('SubscribeTemplateId')['bargain'])
      empList.push(wx.getStorageSync('SubscribeTemplateId')['merchandise_arrival'])
      if (wx.getStorageSync('SubscribeTemplateId')['check']){
        wx.requestSubscribeMessage({
          tmplIds: empList,
          success: res => {
            getApp().postSubscribeMessage(res) //提交订阅消息
            this.toBargaining()
          },
          fail: err => { // 模板id失效
            this.toBargaining()
          }
        })
      }else {
        this.toBargaining()
      }
    }
  }
})
