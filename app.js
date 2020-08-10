//app.js
import {requrl} from './config.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    wx.setStorageSync('url', `${requrl}`)
    wx.setStorageSync('shopkey', wx.getExtConfigSync().key || 'ccvWPn')
    wx.setStorageSync('Config', {})
    this.merchantPlugin()
    this.is_update()
    this.getSubscribeTemplateId()
  },
  globalData: {
    userInfo: null,
    status: false,
    showFlag: true,
    partner_id: 0,
    openAdvertisement: true
  },
  /**
   * 获取订阅消息id
   */
  getSubscribeTemplateId () {
    this.ajax({
      url: 'SubscribeTemplateId',
      data: {
        key: wx.getStorageSync('shopkey')
      }
    }).then(res => {
      let arr = {}
      for( let i in res.data){
        arr[i] = res.data[i][1]
      }
      wx.setStorageSync('SubscribeTemplateId', arr)
    })
  },
  /**
   * 获取sessionkey
   */
  login(){
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          this.ajax({
            url: 'shopLogin',
            data: {
              code: res.code,
              key: wx.getStorageSync('shopkey'),
              type: 'miniprogram'
            }
          }).then(res => {
            wx.setStorageSync('session_key', res.data.session_key);
            wx.setStorageSync('openid', res.data.openid);
            this.getUserInFo()
            reject()
          }).catch(err => {
            if(err.status ===203){
              wx.setStorageSync('jwt', err.data)
              this.getUserInFo()
              resolve(err.data)
            }
          })
        }
      })
    })
  },

  /**
   * 获取用户信息
   */
  getUserInFo () {
    wx.request({
      url: wx.getStorageSync('url') + 'shopUserInfo',
      method: 'get',
      header: {
        "Access-Token": wx.getStorageSync('jwt')
      },
      success: res => {
        console.log(res)
        if (res.data.status == 200) {
          wx.setStorageSync('avatar', res.data.data.avatar)
          wx.setStorageSync('union_id', res.data.data.union_id)
          wx.setStorage({
            key: 'user',
            data: res.data.data,
          })
          if(wx.getStorageSync('shareInfo')){
            if(res.data.data.leader_uid != 0 && res.data.data.leader_uid != wx.getStorageSync('shareInfo').leader_id){
              wx.showModal({
                title: '提醒',
                content: '您是否要重新绑定团长',
                success: mes => {
                  if(mes.confirm){
                    this.changeLeader(wx.getStorageSync('shareInfo').leader_id)
                  }else{
                    wx.removeStorage({key: 'shareInfo'})
                  }
                }
              })
            }else if(res.data.leader_uid == 0){
              getApp().bindGroup()
            }
          }
        }
      }
    })
  },

  /**
   * 获取主题配色
   */
  getColor () { 
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${wx.getStorageSync('url')}shopTheme`,
        data:{
          key: wx.getStorageSync('shopkey')
        },
        success: res => {
          resolve(res.data.data)
        }
      })
    })
  },

  /**
   * 设置主题色
   */
  setTheme () {
    wx.setNavigationBarColor({
      frontColor: wx.getStorageSync('nabigationFontColor'),
      backgroundColor: wx.getStorageSync('background')
    })
  },

  /**
   * 提交表单推送码
   */
  postFormIds () {
    if (wx.getStorageSync('FormIds').length != 0){
      wx.request({
        url: `${wx.getStorageSync('url')}form`,
        method: 'post',
        header:{
          'Access-Token': wx.getStorageSync('jwt'),
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          formid: JSON.stringify(wx.getStorageSync('FormIds'))
        },
        success: res => {
          if (res.data.status == 200) {
            wx.setStorageSync('FormIds', [])
          }
        }
      })
    }
  },

  /**店铺设置 */
  merchantPlugin(){
    return new Promise((reslove, reject) => {
      wx.request({
        url: `${wx.getStorageSync('url')}shopPlugin`,
        method: 'get',
        data: {
          key: wx.getStorageSync('shopkey')
        },
        success: res => {
          wx.setNavigationBarTitle({
            title: res.data.data.name,
          })
          let data = {
            user_vip: res.data.data.user_vip,
            pay_info: this.is_open(res.data.data.pay_info),
            score_shop: this.is_open(res.data.data.score_shop),
            leader_level: this.is_open(res.data.data.leader_level),
            my_mini_info: this.is_open(res.data.data.my_mini_info),
            good_phenosphere: this.is_open(res.data.data.good_phenosphere),
            balance_pay: this.is_open(res.data.data.balance_pay),
            shansong: this.is_open(res.data.data.shansong),
            is_stock: this.is_open(res.data.data.is_stock),
            group_buying: this.is_open(res.data.data.group_buying),
            sign_in: this.is_open(res.data.data.sign_in),
            is_info_bottom: this.is_open(res.data.data.is_info_bottom),
            is_info_header: this.is_open(res.data.data.is_info_header),
            is_merchant_info: this.is_open(res.data.data.is_merchant_info),
            estimated_service_time_info: res.data.data.estimated_service_time_info.length != 0 ? JSON.parse(res.data.data.estimated_service_time_info) : { is_estimated: 0},
            default_pic_url: res.data.data.default_pic_url,
            reduction_info: JSON.parse(res.data.data.reduction_info),
            store_payment: this.is_open(JSON.parse(res.data.data.store_payment).isopen)
          }
          wx.setStorageSync('Config', data)
          wx.setStorageSync('shopName', res.data.data.name)
          wx.setStorageSync('shopAvatar', res.data.data.pic_url)
          reslove(data)
        }
      })
    })
  },
  /**
   * 判断
   */
  is_open(e){
    return e == 0 ? false : true
  },
  /**
   * 添加表单id
   */
  addFormId (formid) {
    let json = [...new Set([...wx.getStorageSync('FormIds'), formid])]
    wx.setStorageSync('FormIds', json)
  },

  /**
   * ajax封装
   */
  ajax({data={},method='get',url='', noLogin=false}){
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${wx.getStorageSync('url')}${url}`,
        data:data,
        method: method,
        header:{
          'Access-Token': wx.getStorageSync('jwt') || '',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          wx.hideLoading()
          if (res.data.status === 200 || res.data.status === '200'  || res.data.status === 201 || res.data.status === '201'){
            resolve(res.data)
          } else if (res.data.status === 204 || res.data.status === '204'){
            reject({ status: 204, message: res.data.message})
          } else if (res.data.status === 500 || res.data.status === '500'){
            try{
              if (!res.data.data.hasOwnProperty('errcode')) {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
            }catch(err) {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
            
            reject({ status: 500, message: res.data.message , data: res.data.data})
          } else if (res.data.status === 1001 || res.data.status === '1001'){
            if(noLogin){
              reject({ status: 205, message: '未登录' })
            }else{
              wx.navigateTo({
                url: '/pages/login2/login2',
              })
            }
          } else if ( res.data.status === 203 || res.data.status === '203'){
            reject({ status: 203,  data: res.data.data })
          }
        }
      })
    })
  },

  /**
   * 绑定用户信息
   * @params number|string tuan_id - 团长id
   * @params number|string sharePeople_id - 推荐人id
   */
  bindGroup() {
    wx.request({ //新用户绑定团长
      url: `${wx.getStorageSync('url')}shopTuanUserLeader`,
      data: {
        id: wx.getStorageSync('shareInfo').leader_id
      },
      method: 'post',
      header: {
        'Access-Token': wx.getStorageSync('jwt'),
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if(res.data.data == 200){
          wx.clearStorageSync('shareInfo')
        }
      }
    })
    wx.request({ //绑定推荐人, 用于分销
      url: `${wx.getStorageSync('url')}shopTuanUserLast/${wx.getStorageSync('shareInfo').leader_id || 0}`,
      data: {
        id: wx.getStorageSync('shareInfo').sharePeople_id
      },
      method: 'put',
      header: {
        'Access-Token': wx.getStorageSync('jwt'),
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  },
  /**是否更新版本 */
  is_update () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  /**
   * 提交订阅消息
   */
  postSubscribeMessage(data){
    console.log(data)
    let empData = []
    for(let i in data){
      if(data[i] == 'accept'){
        empData.push(i)
      }
    }
    if(empData.length != 0){
      this.ajax({
        url: 'SubscribeMessage',
        data:{
          template_id: empData
        },
        method: 'post'
      })
    }
  },
  /**
   * 修改已绑定团长
   * @param {String} leader_id
   */
  changeLeader(leader_id){
    this.ajax({
      url: 'shopTuanUserLeader/' + leader_id,
      method: 'put'
    })
  }
})