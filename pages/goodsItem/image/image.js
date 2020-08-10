// pages/goodsItem/image/image.js
import { countdownDay } from '../../../utils/util.js'
let inter
Component({
  /**
   * 组件的属性列表
   * banner 伦比他
   * price 价格
   * goodsName 商品名称
  **/
  properties: {
    /**
     * 商品数据
     * @author kang
     * date 2020/4/28
     */
    data: {
      type: Object,
      observer(val) {
        if (val.is_flash_sale == 1){
          this.setData({
            countdown: countdownDay(val.end_time)
          })
          inter = setInterval(() => {
            this.setData({
              countdown: countdownDay(val.end_time)
            })
          }, 1000)
        }
      }
    },
    /**
     * 清除计时器开关
     * @author kang
     * date 2020/4/28
     */
    interFlag: {
      type: Boolean,
      observer (e) {
        if(e){
          clearInterval(inter)
        }
      }
    }
  },
  lifetimes: {
    attached () {
      this.setData({
        is_open: wx.getStorageSync('Config').is_stock
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shareFlag: false,
    is_open: false,
    autoplay: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goCart () {
      wx.navigateTo({
        url: '/pages/shopCart/shopCart/shopCart',
      })
    },
    showShare(){
      this.triggerEvent('showShare')
    },
    toshare(){
      wx.navigateTo({
        url: `/pages/share/share?id=${this.data.data.goodsid}`,
      })
    },
    move(){
      return false
    },
    /**
     * 修改轮播图自动滚动
     */
    changeswiper () {
      this.setData({
        autoplay: false
      })
    }
  }
})
