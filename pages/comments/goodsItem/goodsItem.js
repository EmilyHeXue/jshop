// pages/comments/goods/goodsItem.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type:Array,
      default:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 商品打分
     */
    describe_score (e) {
      let index = e.detail.index
      let describe_score = e.detail.evaluation
      this.triggerEvent('operation', { evaluation: describe_score, index: index, type: 'describe_score' })
    },

    /**
     * 物流服务
     */
    express_score (e) {
      let index = e.detail.index
      let express_score = e.detail.evaluation
      this.triggerEvent('operation', { evaluation: express_score, index: index, type: 'express_score' })
    },

    /**
     * 服务态度
     */
    service_score (e) {
      let index = e.detail.index
      let service_score = e.detail.evaluation
      this.triggerEvent('operation', { evaluation: service_score, index: index, type: 'service_score' })
    },

    /**
     * 选择图片
     */
    chooseImg (e) {
      let index = e.currentTarget.dataset.index
      wx.chooseImage({
        count: 5 - this.data.data[index].pics_url.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          let tempFilePaths = res.tempFilePaths;
          console.log(res.tempFilePaths)
          let arr = [];
          arr.push(...this.data.data[index].pics_url);
          for (let i of tempFilePaths) {
            arr.push(i)
          }
          this.data.data[index].pics_url = arr;
          this.uploadimg(tempFilePaths, 0, index)
        }
      })
    },

    /**
     * 填写文字
     */
    write (e) {
      console.log(e.detail.value)
      let index = e.currentTarget.dataset.index
      let value = e.detail.value
      this.triggerEvent('operation', { evaluation: value, index: index, type: 'content' })
    },
    /**
     * 上传文件
     */
    uploadimg (arr,imgindex,index){
      console.log(arr,imgindex,index)
      wx.showLoading({
        title: '图片上传中',
      })
      wx.uploadFile({
        url: `${wx.getStorageSync('url')}shopGoodsCommentUploads`,
        filePath: arr[imgindex],
        header:{
          'Access-Token': wx.getStorageSync("jwt")
        },
        name: 'pic_url',
        success: res => {
          wx.hideLoading()
          let data = JSON.parse(res.data)
          if (data.status == 200){
            this.triggerEvent('img',{pics_url:data.data,index: index})
            if (arr.length - 1 > imgindex) {
              return this.uploadimg(arr, ++imgindex, index)
            }
          }
        }
      })
    },

    /**
     * 删除上传的文件
     */
    delImg (e) {
      let index = e.currentTarget.dataset.index
      let imgindex = e.currentTarget.dataset.imgindex
      this.triggerEvent('delImg',{index: index, imgindex: imgindex})
    }
  }
})
