// pages/goodsItem/layer/layer.js
import { formatTime } from '../../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   * show 是否显示该弹层
   * goodsid 商品id 用户获取分类数据
   * benStatus 用于区分是购买还是加入购物车
   */
  properties: {
    show:{
      type:Boolean,
      value:false,
      observe(e) {
      }
    },
    goodsid:{
      type:String
    },
    btnStatus:{
      type:String
    },
    //参加哪个团
    tuanNum: {
      type: Number,
      value: 0,
      observer(val){
        this.getData()
      }
    },
    submit_type: {
      type: Number,
      value: 0
    },
    //参团id
    group_id: {
      type: Number,
      value: 0
    },
    type:{
      type: String
    },
    service_goods_is_ship: {
      type: String
    },
    supplier_id: {
      type: Number
    },
    supplier_name: {
      type: String
    },
    start_time: {
      type: String
    },
    data: {
      type: Object,
      observer(e){
        if(e.hasOwnProperty('property1')){
          this.getData(e)
        }
        if (e.hasOwnProperty('advance_info')) {
          this.setData({
            start_advance_time: formatTime(new Date(e.advance_info.pay_start_time * 1000), '.', 'YMDHM'),
            end_advance_time: formatTime(new Date(e.advance_info.pay_end_time * 1000), '.', 'YMDHM')
          })
        }
      }
    },
    interFlag: {
      type: Boolean,
      observer(e) {
        if (e) {
          this.setData({
            advacneFlag: false
          })
        }
      }
    }
  },
  lifetimes: {
    attached(){
      this.setData({
        is_open: wx.getStorageSync('Config').is_stock
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    property1:{},
    property2: {},
    pic_url:'',
    fpic_url:'',
    price:'',
    stock:'',
    sales:'',
    num:1,
    goods_name:'',
    background: wx.getStorageSync('background'),
    is_open: false,
    start_advance_time: '',
    end_advance_time: '',
    advacneFlag: false,
    weight: 0
  },
  ready(){
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    postSubscribeMessage(){
      let empList = []
      if(this.data.data.is_group == 1){
        empList.push(wx.getStorageSync('SubscribeTemplateId')['assemble'])
        empList.push(wx.getStorageSync('SubscribeTemplateId')['merchandise_arrival'])
      }
      if(this.data.data.is_advance_sale == 1){
        empList.push(wx.getStorageSync('SubscribeTemplateId')['presale'])
        empList.push(wx.getStorageSync('SubscribeTemplateId')['merchandise_arrival'])
      }
      if (wx.getStorageSync('SubscribeTemplateId')['check']){
        wx.requestSubscribeMessage({
          tmplIds: empList,
          success: res => {
            getApp().postSubscribeMessage(res) //提交订阅消息
            this.buyGoods()
          },
          fail: err => { // 模板id失效
            this.buyGoods()
          }
        })
      }else {
        this.buyGoods()
      }
    },
    /**
     * 购买
    */
    async buyGoods (e) {
      if (this.data.sales == 0 ){
        wx.showToast({
          title: '该商品已售罄,请联系卖家补货',
          icon: 'none'
        })
        return false
      }
      if (this.data.start_time != 0 && this.data.start_time * 1000 > new Date().getTime()){
        wx.showToast({
          title: '活动未开始',
          icon: 'none'
        })
        return false
      }
      if (await this.getTuanConfig()){
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
          supplier_id: this.data.supplier_id,
          supplier_name: this.data.supplier_id == 0 ? wx.getStorageSync('shopInfo').name : this.data.supplier_name,
          list:[{
            goods_id: this.data.goodsid,
            goods_name: this.data.goods_name,
            price: this.data.data.is_advance_sale == 0 ? this.data.price : this.data.data.advance_info.front_money,
            number: this.data.num,
            weight: this.data.weight,
            total_price: this.data.price * this.data.num,
            property1_name: this.data.property1.data[this.data.property1.flag],
            property2_name: this.data.property2.data[this.data.property2.flag],
            pic_url: this.data.pic_url,
            stock_id: this.data.stock,
            service_goods_is_ship: this.data.service_goods_is_ship,
            type: this.data.type
          }]
        }]
        if (this.data.data.is_advance_sale == 0){
          wx.navigateTo({
            url: `/pages/createOrder/createOrder/createOrder?group_id=${this.data.group_id}`
          })
          wx.setStorageSync('advance_sale', 0)
        }else{
          this.setData({
            advacneFlag: true
          })
          wx.setStorageSync('advance_sale', 1)
        }
        wx.setStorageSync('shopcartData', data)
        wx.setStorageSync('tuanNum', this.data.tuanNum)
      }).catch(err => {
        wx.navigateTo({
          url: '/pages/login2/login2',
        })
      })
    },
    /**
     * 添加该商品进入购物车
    */
    addShopCart(e){
      getApp().addFormId(e.detail.formId)
      if (this.data.sales == 0) {
        wx.showToast({
          title: '该商品已售罄,请联系卖家补货',
          icon: 'none'
        })
        return false
      }
      let data = {
        goods_id:this.data.goodsid,
        price:this.data.price,
        number:this.data.num,
        total_price:this.data.price * this.data.num,
        property1_name:this.data.property1.data[this.data.property1.flag],
        property2_name:this.data.property2.data[this.data.property2.flag],
        pic_url:this.data.pic_url,
        stock_id: this.data.stock
      }
      getApp().ajax({
        url: 'shopCart',
        method: 'post',
        data: data
      }).then(res => {
        wx.showToast({
          title: '添加购物车完毕',
          icon: 'none'
        })
        this.setData({
          show: false
        })
      })
    },
    /**
     * 减少商品数量
    */
    subtract(){
      this.setData({
        num: this.data.num == 1 ? this.data.num : this.data.num - 1
      })
    },
    /**
     * 添加商品数量
    */
    add(){
      this.setData({
        num: this.data.num == this.data.sales ? this.data.num : this.data.num + 1
      })
    },
    /**
     * 关闭该弹出层
    */
    closeLayer(){
      this.triggerEvent('colseLayer')
    },
    /**
     * 获取初始数据
     * propert1 一级分类
    */
    getData(){
      /*getApp().ajax({
        url: `shopGoods/${id}`,
        data: {
          key: wx.getStorageSync('shopkey'),
          leader_id: wx.getStorageSync('area_id') || 0
        }
      }).then(res => {*/
        let res = {data: this.data.data}
        let property1 = {};
        let property2 = {}
        try {
          property1 = {
            key: res.data.property1.split(':')[0],
            data: res.data.property1.split(':')[1].split(','),
            flag: 0
          }
          property2 = {
            key: res.data.property2.split(':')[0],
            data: res.data.property2.split(':')[1].split(','),
            flag: 0
          }
        } catch (err) {
          console.log(res.data)
          property1 = {
            key: res.data.property1.split(':')[0],
            data: res.data.property1.split(':')[1].split(','),
            flag: 0
          }
        }
        this.setData({
          property1: property1,
          property2: property2,
          price: res.data.price,
          goods_name: res.data.name,
          fpic_url: res.data.pic_urls[0],
          background: wx.getStorageSync('background')
        })
        this.getProperty2(this.data.property1.data[this.data.property1.flag])
      //})
    },
    /**
     * 点击一级苏剧获取二级数据
     * propert1Name 第一条分类的名字
     * index 下标,用于绑定数据
    */
    getProperty2(data){
      let propert1Name = '';
      let index = '';
      try{
        propert1Name = data.currentTarget.dataset.name;
        index = data.currentTarget.dataset.index;
      }catch(err){
        propert1Name = data;
        index = 0;
      }
      getApp().ajax({
        url: `shopGoodsStockProperty/${this.data.goodsid}`,
        data: {
          property1_name: propert1Name,
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        let data = [];
        res.data.map((item)=>{
          data.push(item.property2_name)
        })
        this.setData({
          ['property2.data']: data,
          ['property2.flag']: 0,
          ['property1.flag']: index
        })
        this.merchantGoodsStock();
      })
    },
    /**
     * 获取二级数据的详细数据
     * property2_name 规格二的名字
     * index 下标
    */
    merchantGoodsStock(data){
      let property2_name = '';
      let index = '';
      let ajaxData = {}
      wx.setStorageSync('leader_discount', 0)
      if(this.data.tuanNum != 0){
        ajaxData = {
          property1_name: this.data.property1.data[this.data.property1.flag],
          property2_name: property2_name,
          key: wx.getStorageSync('shopkey'),
          number: this.data.tuanNum,
          submit_type: this.data.submit_type
        }
      }else{
        ajaxData = {
          property1_name: this.data.property1.data[this.data.property1.flag],
          property2_name: property2_name,
          key: wx.getStorageSync('shopkey')
        }
      }
      try{
        ajaxData.property2_name = data.currentTarget.dataset.name || '';
        index = data.currentTarget.dataset.index;
      }catch(err){
        ajaxData.property2_name = this.data.property2.data[this.data.property2.flag] || '';
        index = 0;
      }
      getApp().ajax({
        url: `shopGoodsStock/${this.data.goodsid}`,
        data: ajaxData
      }).then(res => {
        this.setData({
          pic_url: res.data.pic_url,
          price: this.data.tuanNum == 0 ? res.data.price : res.data.group_price,
          stock: res.data.id,
          sales: res.data.number,
          weight: res.data.weight,
          ['property2.flag']: index
        })
        if (this.data.group_id == 0 && this.data.tuanNum != 0) {
          wx.setStorageSync('leader_discount', parseInt((res.data.group_price - res.data.leader_price)* 100)/100)
          this.setData({
            price: res.data.leader_price,
          })
        }
      })
    },
    click () {
      return false;
    },
    go() {
      wx.navigateTo({
        url: `/pages/createOrder/createOrder/createOrder?group_id=${this.data.group_id}`
      })
    }, 
    changeadvacneFlag () {
      this.setData({
        advacneFlag: !this.data.advacneFlag
      })
    },
    getTuanConfig() { //获取团购配置
      return new Promise((reslove) => {
        getApp().ajax({
          url: 'shopTuanConfig',
          data: {
            key: wx.getStorageSync('shopkey')
          }
        }).then(res => {
          reslove(!res.data.is_bool)
        })
      }) 
    }
  }
})
