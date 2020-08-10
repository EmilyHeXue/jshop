// pages/goodsItem/groupRecommended/groupRecommended.js
import { countdown } from '../../../utils/util.js'
let inter
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsid: {
      type: Number,
      observer(val){
        this.getData(val)
      }
    },
    interFlag: {
      type: Boolean,
      observer (val) {
        if(val){
          clearInterval(inter)
        }else {
          this.getData(this.data.goodsid)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: [],
    expire_time: [],
    total: 0,
    background: wx.getStorageSync('background')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData(id){
      getApp().ajax({
        url: `groupList/${id}`,
        data: {
          type: 2
        },
        noLogin: true
      }).then(res => {
        let list = []
        for (let i of res.data.list) {
          list.push(countdown(i.expire_time))
        }
        this.setData({
          data: res.data.list,
          total: res.data.total,
          expire_time: list
        })
        
        inter = setInterval(()=>{
          let arr = []
          for (let i of res.data.list) {
            arr.push(countdown(i.expire_time))
          }
          this.setData({
            expire_time: arr
          })
        },1000)
        
      })
    },
    go(e){
      console.log(e.currentTarget.dataset)
      this.triggerEvent('show', { status: 'buy', tuanNum: e.currentTarget.dataset.num, submit_type: 0 });
      this.triggerEvent('setTuanId', { groupid: e.currentTarget.dataset.id });
    }
  }
})
