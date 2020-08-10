// pages/group/creategroup/creategroup.js
const json = require("../../data/json")
const{list} = require("../../data/json.js");
let timine
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu:['地下城与勇士','英雄连门','假面骑士 zi-o','假面骑士 ooo','梦比优斯奥特曼'],
    avatar: '',
    nick_name: '',
    sex:['男','女','保密'],
    sexIndex:0,
    name: '',
    phone: '',
    showPhome: false,
    area:'',
    latitude:'',
    longitude:'',
    address:'',
    addr: '', 
    vercode:'',
    banner_pic_url:'',
    remark:'', 
    is_self: 1,
    phoneFlag: false,
    time:60,
    uid:0,
    edit: false,
    leader_name: '',
	addRes:'',   //选择地址
	multiArray: [],
	multiIndex: [0,0,0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
	
    this.setData({
      avatar: wx.getStorageSync('user').avatar,
      nick_name: wx.getStorageSync('user').nickname,
      leader_name: wx.getStorageSync('leader_name') 
    })
    if(options.id){
      this.getTuanInfo()
      this.setData({
        edit: true
      })
    }
    this.getUserInfo()
    getApp().postFormIds()
    getApp().setTheme()
    wx.setNavigationBarTitle({
      title: `申请${wx.getStorageSync('leader_name')}`,
    })
  },
  getUserInfo(){
    getApp().ajax({
      url: 'shopUserInfo'
    }).then(res => {
      this.setData({
        avatar: res.data.avatar,
        nick_name: res.data.nickname
      })
      this.getTuanConfig()
    })
  },
  show(){
    this.setData({
      is_seif: !this.data.is_seif
    })
  },
  getTuanInfo(){
    getApp().ajax({
      url: 'tuanLeader'
    }).then(res => {
      console.log(res)
      this.setData({
        name: res.data.realname,
        phone: res.data.phone,
        address: `${res.data.provice_name},${res.data.city_name},${res.data.area_names}`,
        is_self: res.data.is_self == 1 ? true:false,
        flag: res.data.is_self == 1 ? true : false,
        province_code: res.data.province_code,
        area_code: res.data.area_code,
        province_code: res.data.province_code,
        city_code:res.data.city_code,
        latitude: res.data.latitude,
        longitude: res.data.longitude,
        area: res.data.area_name,
        remark: res.data.remarks,
        addr: res.data.addr,
        uid: res.data.uid,
      })
    }).catch(res => {
    })
  },
  getTuanConfig(){
    wx.request({
      url: `${wx.getStorageSync('url')}shopTuanConfig`,
      data:{
        key: wx.getStorageSync('shopkey')
      },
      method: 'get',
      header: {
        'Access-Token': wx.getStorageSync('jwt')
      },
      success: res => {
        console.log(res)
        wx.setStorageSync('leader_name', res.data.data.leader_name) //团长名词
        this.setData({
          banner_pic_url: res.data.data.banner_pic_url
        })
      }
    })
  },
  //点击确定
  bindMultiPickerChange: function (e) {
	  console.log('picker发送选择改变，携带值为', e.detail.value)
	  this.setData({
		multiIndex: e.detail.value
	  })
	let l1 = this.data.multiArray[0][this.data.multiIndex[0]].name;
	let l2 = this.data.multiArray[1].length > 0 ?("，" + this.data.multiArray[1][this.data.multiIndex[1]].name):"";
	let l3 = this.data.multiArray[2].length > 0 ?("，" + this.data.multiArray[2][this.data.multiIndex[2]].name):"";
	this.setData({
		addRes: l1+l2+l3
	})
	console.log(this.data.addRes)

	let code2;
	if(this.data.multiArray[2][this.data.multiIndex[2]]){
		code2 = this.data.multiArray[2][this.data.multiIndex[2]].code
	}else{
		code2 = ''
	}
	console.log(this.data.multiArray[0][this.data.multiIndex[0]].code,this.data.multiArray[1][this.data.multiIndex[1]].code,code2)
	this.setData({
	  province_code: this.data.multiArray[0][this.data.multiIndex[0]].code,
	  city_code: this.data.multiArray[1][this.data.multiIndex[1]].code,
	  area_code: code2,
	  address: e.detail.value
	})
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
  //提交数据
  panduan (e) {
    getApp().addFormId(e.detail.formId)
    let data = e.detail.value
    data.is_self = this.data.is_self
    console.log(data)
    for(let i in data){
      console.log(i)
      if(data[i] === '' && i != 'remarks'){
        wx.showToast({
          title: '有参数未填',
          icon: 'none'
        })
        return false
      } 
    }
    console.log(this.options)
    if(this.options.id){
      this.putData(data)
    }else{
      this.postData(data)
    }
  },
  postData(data){
    console.log('didid')
    if (wx.getStorageSync('SubscribeTemplateId')['check']){
      wx.requestSubscribeMessage({
        tmplIds: [wx.getStorageSync('SubscribeTemplateId')['check']],
        success: res => {
          getApp().postSubscribeMessage(res) //提交订阅消息
          this.postajax(data)
        },
        fail: err => { // 模板id失效
          console.log(err)
          this.postajax(data)
        }
      })
    }else {
      this.postajax(data)
    }
    
  },
  postajax (data){
    getApp().ajax({
      url: 'shopTuanUser',
      data: data,
      method: 'post'
    }).then(res => {
      wx.showToast({
        title: '申请提交完毕,请等待商家审核',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/index/index/index',
        })
      }, 1000)
    }).catch(err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  putData(data){
    getApp().ajax({
      url: `updateTuanLeader`,
      data: data,
      method: 'put'
    }).then(res => {
      wx.showToast({
        title: '资料修改完毕',
        icon: 'none'
      })
      wx.navigateBack()
    }).catch(err => {
      wx.showToast({
        title: err.message,
        icon: 'none'
      })
    })
  },
  chooseSex(e){
    console.log(e)
    this.setData({
      sexIndex: e.detail.value
    })
  },
  chooseAddress(e){
    console.log(e.detail)
    this.setData({
      province_code: e.detail.code[0],
      city_code: e.detail.code[1],
      area_code: e.detail.code[2],
      address: e.detail.value
    })
  },
  chooseArea(e){
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        this.setData({
          area: res.name,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
    })
  }, 
  writePhone (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //获取验证码
  getVercode(){
    console.log(this.data.phone)
    if ("" == this.data.phone){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false
    }
    if (!/^[1][0-9][0-9]{9}$/.test(this.data.phone)){
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      })
      return false
    }
    wx.request({
      url: `${wx.getStorageSync('url')}sms`,
      data:{
        phone: this.data.phone
      },
      header: {
        'Access-Token': wx.getStorageSync('jwt')
      },
      success: res=>{
        console.log(res)
        if(res.data.status == 200){
          this.setData({
            phoneFlag: true
          })
          timine = setInterval(() => {
            this.setData({
              time: this.data.time - 1
            })
            if (this.data.time == 0) {
              clearInterval(timine)
              this.setData({
                time: 60,
                phoneFlag: false
              })
            }
          }, 1000)
        }
      }
    })
  }
})