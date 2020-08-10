// pages/createOrder/address/address.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(e) {
       if(e){
         this.getAddress()
       }
      }
    },
    listname: {
      type: String
    },
    addressFlag: {
      type: String,
      observer(e){
        console.error(e)
        if (e != '到点自提') {
          this.getAddress()
        }
      }
    }
  },
  lifetimes: {
    attached () {
      
    }
  },
  /**
   * 组件的初始数据
   * address 选中的地址
   * dataList 地址列表
   * show 是否显示选择栏
   */
  data: {
    data:{},
    willData: {},
    dataList:'',
    layerFlag:false,
    background: wx.getStorageSync('background'),
    nabigationFontColor: wx.getStorageSync('nabigationFontColor')
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 是否显示弹出层(选择地址栏)
    **/
    showlayer(e){
      if (e.detail.formId){
        getApp().addFormId(e.detail.formId)
      }
      this.setData({
        layerFlag: !this.data.layerFlag,
        willData: this.data.data
      })
    },
    willChoose(e){
      this.setData({
        willData: this.data.dataList[e.currentTarget.dataset.index]
      });
    },
    chooseAddress(){
      this.setData({
        layerFlag: false,
        data: this.data.willData
      });
      this.triggerEvent('getaddress', this.data.data)
    },
    close () {
      this.setData({
        layerFlag: false
      });
    },
    //获取地址id
    getAddress() {
      app.ajax({
        url: 'shopContact'
      }).then(res => {
        console.log('',res)
        this.setData({
          dataList: res.data,
          data: res.data[0]
        })
        this.triggerEvent('getaddress', res.data[0])
      }).catch(err => {
        this.setData({
          data: []
        })
      })
    },
    goCreatedAddress(){
      wx.navigateTo({
        url: '/pages/home/addAddress/addAddress',
      })
    }
  }
})
