let app = getApp()
Page({
  data: {
    active: 0,
    current: 1,
    page: false,
    createdTime:'',
    continuousTime:'',
    activityName:'',
    activityImg:'',
    activityRemark:'',
    activityId:'',
    avatar:[],
    cumulative:0,
    remarkFlag:false,
    list:[],
    chooseday: new Date().getUTCDate(),
    chooseIndex:'',
    year:'',
    month:'',
    leiji:'',
    lianxu:'',
    isSign: false,
    rankingList:[],
    today: new Date().getUTCDate()
  },
  onShow() {
    console.log('aaaaa', this.options)
    if (this.options.id) {
      console.log('aaaa')
    }
    wx.setNavigationBarTitle({
      title: '签到',
    })
  },
  onLoad(query) {
    const scene = decodeURIComponent(query.scene)
    this.getData()
    getApp().postFormIds()
  },
  /**
   * 打卡与足迹切换
   */
  tab_btn: function (e) {
    this.setData({
      active: e.currentTarget.dataset.index
    })
  },
  /**
   * 榜单切换
   */
  screen_btn: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      current: e.currentTarget.dataset.index
    })
    console.log(index)
    this.shopSignsTotal(index)
  },
  /**
   * 判断是否签到,未签到跳转签到页,签到跳转签到完成页
   */
  goClockIng (e) {
    /*let status = e.currentTarget.dataset.status
    let url = status ? "../clockIned/clockIned" :"../clockIning/clockInging"
    wx.navigateTo({
      url: `${url}?id=${this.data.activityId}`,
    })*/
    getApp().ajax({
      url: 'shopSign',
      method: 'post',
      data: {
        sign_id: this.data.activityId
      }
    }).then(() => {
      wx.showToast({
        title: '签到成功',
      })
      this.getDateList()
      this.getLeiji()
      this.getSignToDay()
      this.shopSignsTotal(1)
    })
  },
  index () {
    wx.redirectTo({
      url: '/pages/index/index/index',
    })
  },
  
  /**
   * 获取签到活动
   * createTime String 活动开始时间
   * continuousTime Number 持续多长时间
   * activityName String 活动名字
   * activityImg String 活动背景图片
   * activityRemark String 活动备注
   * activityId Number 活动id
   */
  getData() {
    app.ajax({
      url: `shopSignIn`,
      data: {
        key: wx.getStorageSync('shopkey')
      }
    }).then(res => {
      let createTime = res.data[0].start_time
      let continuousTime = res.data[0].end_time.split('-')[2] * 1 - createTime.split('-')[2] * 1
      let activityName = res.data[0].name
      let activityImg = res.data[0].pic_url_activity
      let activityRemark = res.data[0].remark
      let activityId = res.data[0].id
      let avatar = res.avatar
      let cumulative = res.number
      this.setData({
        createTime,
        continuousTime,
        activityName,
        activityImg,
        activityRemark,
        activityId,
        avatar,
        cumulative
      })
      
      this.getDateList()
      this.getLeiji()
      this.getSignToDay()
      this.shopSignsTotal(1)
    }).catch(res => {
      if(res.status === 204){
        wx.showToast({
          title: '活动暂未开启',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack({})
        },1000)
      }
    })
  },
  /**
   * 是否显示底部导航栏
  */
  show(e) {
    console.log(e)
    this.setData({
      page: true
    })
  },
  remarkShow () {
    this.setData({
      remarkFlag: !this.data.remarkFlag
    })
  },
  /**
   * 设置日期
   */
  getDateList () {
    let days = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate()
    let xingqi = new Date(new Date().getFullYear(), new Date().getMonth() + 1, -days + 1).getDay()
    let list = []
    for (let i = 0; i < xingqi; i++){
      let data = {}
      list.push(data)
    }
    console.log(list)
    app.ajax({
      url: `shopSign/${this.data.activityId}`
    }).then(res => {
      console.log('请求成功')
      let arr = {}
      for (let i of res.data) {
        arr[i.create_time.split(' ')[0].split('-')[2]] = { pic_url: i.pic_url }
      }
      console.log(arr, res)
      for (let i = 0; i < days; i++) {
        let index = String(i + 1).padStart(2, 0)
        console.log(index)
        let data = {
          day: i + 1,
          status: arr[index] ? true : false,
          pic_url: arr[i + 1] ? arr[i + 1].pic_url : ''
        }
        list.push(data)
      }
      this.setData({
        list,
        chooseIndex: this.data.chooseday + new Date(new Date().getFullYear(), new Date().getMonth() + 1, -days + 1).getDay() - 1,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      })
    }).catch(res => {
      if (res.status == 204) {
        for (let i = 0; i < days; i++) {
          let data = {
            day: i + 1,
            status: false,
            pic_url: ''
          }
          list.push(data)
        }
        this.setData({
          list,
          chooseIndex: this.data.chooseday + new Date(new Date().getFullYear(), new Date().getMonth() + 1, -days + 1).getDay() - 1,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1
        })
      }
    })
  },
  /**
   * 获取累计天数与连续签到天数
   */
  getLeiji(){
    app.ajax({
      url: `shopSigns/${this.data.activityId}`
    }).then(res => {
      this.setData({
        lianxu: res.data.lianxu,
        leiji: res.data.leiji
      })
    })
  },
  /**
   * 切换选中日期
   */
  changeChoose (e){
    let chooseIndex;
    let chooseday;
    try{
      chooseIndex = e.currentTarget.dataset.index
      chooseday = e.currentTarget.dataset.day
    }catch(err){
      console.log('报错', e.index, e.day,e)
      chooseIndex =  e.index
      chooseday = e.day
    }
    this.setData({
      chooseIndex,
      chooseday
    })
  },
  /**
   * 查询今日是否已签到
   */
  getSignToDay () {
    let isSign = false
    app.ajax({
      url: `shopSignToDay/${this.data.activityId}`
    }).then(res => {
      console.log('查询今天是否签到', res.data)
      isSign = true
      this.setData({
        isSign: isSign
      })
    }).catch(res => {
      this.setData({
        isSign: isSign
      })
    })
  },
  /**
   * 补签
   */
  retroactive () {
    let date = {
      index: this.data.chooseIndex,
      day: this.data.chooseday
    }
    let time = `${new Date().getFullYear()}-${new Date().getUTCMonth() + 1}-${this.data.chooseday}`
    app.ajax({
      url: `shopSignsRepair/${this.data.activityId}`,
      method: 'post',
      data: {
        time: time
      }
    }).then(res => {
      let data = res.data
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success: res => {
          console.log(res)
          wx.showToast({
            title: '补签成功',
            icon: 'none'
          })
          this.getDateList()
          this.changeChoose(date)
        }
      })
    })
  },
  /**
   * 获取排行榜名单
   */
  shopSignsTotal(index){
    wx.showLoading({
      title: '',
    })
    app.ajax({
      url: `shopSignsTotal/${this.data.activityId}`
    }).then(res => {
      let arr = []
      wx.hideLoading()
      for (let i in res.data) {
        console.log(i)
        arr.push(i)
      }
      this.setData({
        rankingList: res.data[arr[index]]
      })
    })
    
  }
})