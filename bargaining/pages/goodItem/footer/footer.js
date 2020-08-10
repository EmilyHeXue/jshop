// bargaining/pages/goodItem/footer/footer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      observer(val){
        if (val.bargain_end_time){
          if (new Date().getTime() < Number(val.bargain_end_time * 1000)){
            this.setData({
              timeout: true
            })
          }
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timeout: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toBuy(e) {
      this.triggerEvent('showLayer',{isBuy: e.currentTarget.dataset.flag, flag: true})
    }
  }
})
