// pages/home/addAddress/addAddress.js
const json = require("../../../data/json")
const{list} = require("../../../data/json.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   * name 姓名
   * phone 手机号
   * address 详细地址
   * province 省
   * city 市
   * area 区
   * street 街道(小程序该项为空)
   * is_default 是否默认
   * status false表示新增,true表示编辑
  **/
  data: {
    name:'',
    phone:'',
    address:'',
    province:'',
    city:'',
    area:'',
    street:'',
    is_default:false,
    status:false,
    postcode: '000000',
    longitude: 0,
    latitude: 0,
    loction_address: '',
    loction_name: '',
    background: '',
    nlp: '',
    multiArray: [],
    multiIndex: [0,0,0],
  },
  /**
   * 跳转到emmmmmmm 收货地址页面
  **/
  go(){
    wx.redirectTo({
      url: '../address/address'
    })  
  },

  /**
   * 设置默认地址
  **/
  changeSwitch(data){
    this.setData({
      is_default:data.detail.value
    })
  },
  /**
   * 提交地址到后台
  **/
  postShopContact(e){
    let data = e.detail.value
    let key = {
      name: '请输入收货人姓名',
      phone: '请输入手机号',
      address: '请填写详细地址',
      loction_address: '请选择所在地'
    }
    console.log(data)
    for(let i in data){
      if(data[i].length === 0){
        wx.showToast({
          title: key[i],
          icon: 'none'
        })
        return false
      }
    }
    data.longitude = this.data.longitude
    data.latitude = this.data.latitude
    data.loction_name = this.data.loction_name
    data.is_default = this.data.is_default ? 1 : 0
    getApp().addFormId(e.detail.formId)
    wx.showToast({
      title:'提交中',
      icon:'loading'
    })
    app.ajax({
      url: this.data.status ? `shopContact/${this.data.id}` : 'shopContact',
      method: this.data.status ? 'put' : 'post',
      data: data
    }).then(res => {
      this.data.status ? wx.navigateBack() : wx.redirectTo({
        url: '../address/address'
      })
    })
  },
  /**
   * 地址选择器
  **/
  bindRegionChange(data){
    this.setData({
      province:data.detail.value[0],
      city:data.detail.value[1],
      area:data.detail.value[2],
      loction_address: data.detail.value[0] + data.detail.value[1] + data.detail.value[2]
    })
  },
  /**
   * 获取信息
  **/
  getData(id){
    wx.request({
      url:wx.getStorageSync('url') + 'shopContact/' + id,
      method:'get',
      header:{
        'Access-Token':wx.getStorageSync('jwt')
      },
      success: res =>{
        this.setData({
          ...res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
  **/
  onLoad: function () {
	this.setData({
		multiArray:list
	})
	var temp = list.data;
	this.setData({
		provinces: temp,
		multiArray: [temp, temp[0].citys, temp[0].citys[0].areas],
		multiIndex: [0, 0, 0]
	})
	console.log(this.data.provinces)
	
    getApp().postFormIds()
    app.setTheme()
    if(this.options.id){
      this.getData(this.options.id);
    }
    wx.setNavigationBarTitle({
      title: '新增收货地址'
    })
    this.setData({
      background: wx.getStorageSync('background')
    })
  },
  //点击确定
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  	let l1 = this.data.multiArray[0][this.data.multiIndex[0]].name;
  	let l2 = this.data.multiArray[1].length > 0 ?(this.data.multiArray[1][this.data.multiIndex[1]].name):"";
  	let l3 = this.data.multiArray[2].length > 0 ?(this.data.multiArray[2][this.data.multiIndex[2]].name):"";
  	this.setData({
  	  loction_address: l1+l2+l3
  	})
	  console.log(this.data.loction_address)
  },
  //滑动
  bindMultiPickerColumnChange: function(e){
      console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      data.multiIndex[e.detail.column] = e.detail.value;
      if (e.detail.column == 0){
        data.multiIndex = [e.detail.value,0,0];
      } else if (e.detail.column == 1){
        data.multiIndex = [data.multiIndex[0], e.detail.value, 0];
      } else if (e.detail.column == 2) {
        data.multiIndex = [data.multiIndex[0], data.multiIndex[1], e.detail.value];
      }
      var temp = this.data.provinces;
      data.multiArray[0] = temp;
      if ((temp[data.multiIndex[0]].citys).length > 0){
        data.multiArray[1] = temp[data.multiIndex[0]].citys;
        var areaArr = (temp[data.multiIndex[0]].citys[data.multiIndex[1]]).areas;
        data.multiArray[2] = areaArr.length > 0 ? areaArr : [];
      }else{
        data.multiArray[1] = [];
        data.multiArray[2] = [];
      }
      //setData更新数据
      this.setData(data);
  },
  /**
   * 选择所在地
   */
  chooseLocal () {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          loction_name: res.name
        })
      },
      fail: res => {
        wx.getSetting({
          complete: (res) => {
            if(!res.authSetting['scope.userLocation']){
              wx.showToast({
                title: '请在右上角设置中开启"使用我的地理位置"',
                icon: 'none'
              })
            }
          },
        })
      }
    })
  },
  /**
   * 填写nlp
   */
  writeNlp (e) {
    this.setData({
      nlp: e.detail.value
    })
  },
  /**
   * 匹配数据
   */
  toaddress () {
    setTimeout(() => {
      console.log(this.data.nlp)
      let str = this.data.nlp
      let phone = this.toAddressData(/\d{11}/.exec(str)) //匹配手机号
      str = str.replace(phone,"")
      let province = this.toAddressData(/(\S)+(省|自治区)/.exec(str)) //匹配省|自治区
      str = str.replace(province,"")
      let city = this.toAddressData(/(\S)+市/.exec(str)) //匹配市
      str = str.replace(city,"")
      let area = this.toAddressData(/(\S)+区/.exec(str)) //匹配市
      str = str.replace(area,"")
      let data = str.split(' ').map(e => [e, e.length]).sort((e, i) => { return i[1] - e[1]} )
      let address, name = ''
      try{
        address = data[0].length == 2 ? data[0][0] : '' //匹配详细地址
        name = data[1].length == 2 ? data[1][0] : '' //匹配姓名
      }catch(err){}
      
      console.log(`手机号-${phone}; 省-${province}; 市-${city}; 区-${area}; 地址-${address}; 姓名-${name}`)
      this.setData({
        name,
        phone,
        address,
        province,
        city,
        area,
        loction_address: province + city + area,
        loction_name: address
      })
    }, 100)
  },
  toAddressData(e) {
    return e == null ?  '' :  e[0]
  }
})