// pages/shopCart/header/header.js
Component({
  /**
   * 组件的属性列表
   * show 是否显示删除
  **/
  properties: {
    show:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   * checked 是否全选
  **/
  data: {
    checked:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    change(){
      this.setData({
        checked: !this.data.checked
      })
      this.triggerEvent('checkALl',{flag:this.data.checked})
    },
    showDel(){
      this.triggerEvent('showDel',{flag:false})
    },
    closeDel(){
      this.triggerEvent('showDel',{flag:true})
    }
  }
})
