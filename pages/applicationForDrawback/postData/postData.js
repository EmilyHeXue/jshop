// pages/applicationForDrawback/postData/postData.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderId:{
      type:String
    },
    order_sn:{
      type:String
    },
    status:{
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    array:[
      {value:1,name:'退货退款'},
      {value:2,name:'仅退款'}
    ],
    index:0,
    imgData:[],
    after_remark:'',
    imgbase64:"",
    background: wx.getStorageSync('background')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 监听picker切换
    **/
    bindPickerChange(data){
      console.log(data);
      this.setData({
        index:data.detail.value
      })
    },
    /**
     * 改变文字
    **/
    changeAfterRemark(data){
      this.setData({
        after_remark:data.detail.value
      })
    },
    /**
     * 选择图片
    **/
    chooseImg(){
      let arr = [];
      let imgbase64 = [];
      arr.push(...this.data.imgData);
      imgbase64.push(...this.data.imgbase64);
      wx.chooseImage({
        count:5-this.data.imgData.length,
        sizeType:['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          this.shopAfterUpload(res.tempFilePaths,0)
        }
      })
    },

    /**
     * 上传图片
     */
    shopAfterUpload(tempFilePaths,index) {
      wx.showLoading({
        title: `第${this.data.imgData.length + 1}张图片上传中`,
      })
      wx.uploadFile({
        url: `${wx.getStorageSync('url')}shopAfterUpload`,
        filePath: tempFilePaths[index],
        name: 'pic_url',
        header: {
          'Access-Token': wx.getStorageSync('jwt'),
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          console.log(JSON.parse(res.data))
          wx.hideLoading()
          let arr = this.data.imgData
          arr.push(JSON.parse(res.data))
          this.setData({
            imgData: arr
          })
          if (tempFilePaths.length - 1 > index) {
            return this.shopAfterUpload(tempFilePaths, index + 1)
          } else {
            wx.showToast({
              title: '图片上传完毕',
              icon: 'none'
            })
          }
        }
      })
    },
    /**
     * 提交数据
     * order_sn 订单编号
     * after_remark 备注
     * after_type 退款类型 1:退货退款 2:仅退款
     * after_imgs 图片
    **/
    postReturnOrder(){
      app.ajax({
        url: 'shopOrderAfter',
        method: 'put',
        data: {
          order_sn: this.data.order_sn,
          after_remark: this.data.after_remark,
          after_type: this.data.array[this.data.status].value,
          after_imgs: JSON.stringify(this.data.imgData),
          type: 2
        }
      }).then(res => {
        wx.redirectTo({
          url: '/pages/returnOrder/returnOrder/returnOrder',
        })
      }).catch(res => {
        wx.showToast({
          title: res.message,
        })
      })
    }
  }
})
