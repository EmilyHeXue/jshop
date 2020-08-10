// pages/createOrder/tab/tab.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(e){
        if(e){
          console.log(e, '重了')
          this.setData({
            list: []
          })
          if(wx.getStorageSync('area').id){
            this.setData({
              flag: true
            })
          }
          app.setTheme()
          this.getAddressList()
        }
      }
    },
    user_phone: {
      type: String
    },
    user_name: {
      type: String
    },
    session: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    bg: '',
    chooseIndex: 0,
    flag: false,
    name: '',
    phone: '',
    address: {},
    addressFlag: false
  },
  lifetimes: {
    attached() {
      this.setData({
        bg: wx.getStorageSync('background')
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    changeList (e) {
      console.log(this.data)
      if (!wx.getStorageSync('area').id && this.data.list[e.currentTarget.dataset.index].name != '快递送货'){
        wx.showModal({
          title: '温馨提醒',
          content: `您未选择${wx.getStorageSync('leader_name')},无法使用团购功能,是否选择${wx.getStorageSync('leader_name')}`,
          success: res => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/group/changegroup/changegroup/changegroup',
              })
            }
          }
        })
      }
      this.setData({
        chooseIndex: e.currentTarget.dataset.index
      })
      let modelData
      if (this.data.list[e.currentTarget.dataset.index].name == '到点自提'){
        modelData = [
          { name: '姓名', data: wx.getStorageSync('area').realname},
          //{ name: '电话', data: this.data.address.phone },
          { name: '收货地址', data: wx.getStorageSync('area').area_name }
        ]
      } else if (this.data.list[e.currentTarget.dataset.index].name == '团长配送'){
        modelData = [
          { name: '姓名', data: this.data.address.name },
          { name: '电话', data: this.data.address.phone },
          { name: '收货地址', data: this.data.address.loction_name }
        ]
      }else{
        modelData = [
          { name: '姓名', data: this.data.address.name },
          { name: '电话', data: this.data.address.phone },
          { name: '收货地址', data: this.data.address.loction_name }
        ]
      }
      // 更新收货地址
      this.triggerEvent('changeAddress', {
        address: modelData, 
        user_contact_id: this.data.list[e.currentTarget.dataset.index].id,
        useraddressid: this.data.address.id
      })
      this.triggerEvent('goodstype', { type: this.data.list[e.currentTarget.dataset.index].id, useraddressid: this.data.address.id})
    },
    getExpress(){
      app.ajax({
        url:'shopTuanConfig',
        data:{
          key: wx.getStorageSync('shopkey')
        }
      }).then(res => {
        let list = this.data.list
        console.log(list)
        if (res.data.is_site == 1 && res.data.is_open == 1) {
          list.push({ name: '到点自提', id: 1, flag: true })
        }
        if (res.data.is_tuan_express == 1 && res.data.is_open == 1) {
          list.push({ name: `${wx.getStorageSync('leader_name')}配送`, id: 2, flag: true })
        }
        if (res.data.is_express == 1 || res.data.is_open == 0) {
          list.push({ name: '快递送货', id: this.data.address.id, flag: true })
        }
        this.setData({
          list: list,
          addressFlag: true
        })
        this.triggerEvent('goodstype', { type: this.data.list[0].id, useraddressid: this.data.address.id})
        if (!wx.getStorageSync('area').id && this.data.list[0].name != '快递送货') {
          wx.showModal({
            title: '温馨提醒',
            content: `您未选择${wx.getStorageSync('leader_name')},无法使用团购功能,是否选择${wx.getStorageSync('leader_name')}`,
            success: res => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/group/changegroup/changegroup/changegroup',
                })
              }
            }
          })
        }
        for (let i in this.data.list) {
          if (this.data.list[i].flag) {
            this.setData({
              chooseIndex: i
            })
            break
          }
        }
        let user_contact_id = {
          1: 1,
          2: 2,
        }
        this.triggerEvent('changeAddress', {
          address: this.initaddressInfo(list[0].name),
          user_contact_id: user_contact_id[this.data.list[0].id] || this.data.address.id,
          useraddressid: this.data.address.id
        })
        this.getData()
      })
    },
    getData(type) {
      if (this.data.list[this.data.chooseIndex].name != '快递送货'){
        app.ajax({
          url: `tuanExpress/${wx.getStorageSync('area').uid || 0}`
        }).then(res => {
          console.log(res.data)
          this.triggerEvent('tuanexpress', { tuan_express_fee: res.data.tuan_express_fee })
        })
      }
    },
    /**
     * 获取地址id
    */
    getaddress(data) {
      if (this.data.list.length != 0 && this.data.list[this.data.chooseIndex].name == '快递送货'){
        let modelData
        let id = data.detail.id
        if (data.detail.hasOwnProperty('province')) {
          modelData = [
            { name: '姓名', data: data.detail.name || this.data.user_name },
            { name: '电话', data: data.detail.phone || this.data.user_phone },
            { name: '收货地址', data: data.detail.province + data.detail.city + data.detail.area + data.detail.address }
          ]
        } else {
          modelData = [
            { name: '姓名', data: data.detail.name || this.data.user_name },
            { name: '电话', data: data.detail.phone || this.data.user_phone },
            { name: '收货地址', data: data.detail.address }
          ]
        }
        this.triggerEvent('changeAddress', {
          address: modelData, 
          user_contact_id: data.detail.id,
          useraddressid: data.detail.id
        })
      }
    },
    /**
     * 修改姓名
     */
    changeName (e) {
      this.setData({
        name: e.detail.value
      })
      this.triggerEvent('changename', { data: e.detail.value })
    },
    /**
     * 修改手机号
     */
    changePhone(e) {
      this.triggerEvent('changephone', { data: e.detail.value })
    },
    /**
     * 获取手机号
     **/
    getPhone(e) {
      getApp().ajax({
        url: 'shopUserPhone',
        data: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          session_key: this.data.session
        }
      }).then(res => {
        this.triggerEvent('changephone', { data: JSON.parse(res.data).phoneNumber})
      })
    },
    /**
     * 获取收货地址
     */
    getAddressList () {
      app.ajax({
        url: 'shopContact'
      }).then(res => {
        this.setData({
          address: res.data[0]
        })
        this.getExpress()
      }).catch(err => {
        this.getExpress()
      })
    },
    /**
     * 初始化确认信息
     */
    initaddressInfo(e){
      let modelData
      if(e == '到点自提'){
        modelData = [
          { name: '姓名', data: wx.getStorageSync('area').realname},
          //{ name: '电话', data: this.data.address.phone },
          { name: '收货地址', data: wx.getStorageSync('area').area_name }
        ]
      }else{
        modelData = [
          { name: '姓名', data: this.data.address.name },
          { name: '电话', data: this.data.address.phone },
          { name: '收货地址', data: this.data.address.loction_name }
        ]
      }
      return modelData
    }
  }
})
