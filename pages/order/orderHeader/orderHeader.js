// pages/order/orderHeader/orderHeader.js
Component({
  /**
   * 组件的属性列表
   * headIndex 头部下表
   */
  properties: {
    headIndex:{
      type: String,
      default: '0',
      observer (val) {
        this.setData({
          flag: val
        })
      }
    }
  },

  /**
   * 组件的初始数据
   * menu 菜单数组
   * menu.name 菜单名称
   * menu.id 菜单id
   * flag 选中的菜单下标,用于附加选中class
  **/
  data: {
    menu:[
      {name:'全部',id:8},
      {name:'待付款',id:0},
      {name:'待发货',id:1},
      {name:'待收货',id:3},
      {name:'待评价',id:6},
    ],
    flag:0
  },
  /**
   * 组件的方法列表
   * id 菜单所属id,传到父组件里去请求对应的列表
  **/
  methods: {
    changemenu(data){
      let id = data.currentTarget.dataset.id;
      let index = data.currentTarget.dataset.index;
      this.setData({
        flag:index
      })
      this.triggerEvent('postId',{id:id})
    }
  }
})
