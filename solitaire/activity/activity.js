//获取应用实例
const app = getApp()
Page({
  data: {
    background: '',
    comment: [],
    page: 1,
    order_list: [],
    count: 0,
    allNum: 0,
    allPrice: 0,
    id: 0,
    userInfo: {},
    uploadImg:  [],
    commentText: '',
    commentFlag: true
  },
  /**
   * 修改数量
   * @param {*} e 
   * @param {string} type 判断是否加减的状态
   * @param {string} index 商品数组下标
   */
  btnAdd(e){
    let data = this.data.goods
    try{
      let type = e.currentTarget.dataset.type
      let index = e.currentTarget.dataset.index
      if(type == 'add'){
        data[index].number += 1
      }else{
        if(data[index].number != 1){
          data[index].number -= 1
        }
      }
    }catch(err){}
    console.log(data[0].price, data[0].number)
    this.setData({
      goods: data,
      allNum: data.map(e => e.number).reduce((pre, cur, index) => {
        return Number(pre) + Number(cur)
      }),
      allPrice:  data.map(e => e.stock[this.data.goodsIndex[e.id]].price * e.number).reduce((pre, cur, index) => {
        return Number(pre) + Number(cur)
      })
    })
  },



  // 加载
  onLoad(options){
    wx.setNavigationBarTitle({title: '页面标题'});
    getApp().setTheme()
    this.setData({
      background: wx.getStorageSync('background')
    })
    wx.setNavigationBarTitle({
      title: '群接龙',
    })
    if (this.options.hasOwnProperty('user_id')) {
      wx.setStorageSync('shareInfo', { sharePeople_id: this.options.user_id, leader_id: this.options.leader_id })
    }
  },
  // 初次渲染完成
  onReady(){},
  // 显示
  onShow(){
    this.getActivityDetails()
    this.shopSolitaireOrder()
    this.shopSolitaireComment()
  },
  // 隐藏
  onHide(){},
  // 卸载
  onUnload(){},
  // 下拉
  onPullDownRefresh(){
    this.init()
  },
  // 上拉触底
  onReachBottom(){
    this.shopSolitaireOrder()
  },
  // 右上角分享
  onShareAppMessage(){
    return {
      title: `${wx.getStorageSync('user').nickname}邀请你参加接龙咯`,
      path: `/solitaire/activity/activity?id=${this.options.id}&user_id=${wx.getStorageSync('user').id}&leader_id=${wx.getStorageSync('area_id')}`,
      imageUrl: this.data.shareimg
    }
  },
  /**
   * 初始化数据(用于下拉刷新)
   */
  init(){
    this.setData({
      comment: [],
      page: 1,
      order_list: [],
      count: 0
    })
  },
  /**
   * 获取活动详情
   */
  getActivityDetails(){
    getApp().ajax({
      url: `shopSolitaire/${this.options.id}`
    }).then(res => {
      console.log(res)
      this.setData({
        ...res.data,
        areaInfo: wx.getStorageSync('area'),
        goods: res.data.goods.map(i => {
          return {...i, number: 1}
        }),
        allNum: res.data.goods.length,
        allPrice: res.data.goods.map(e => e.stock[0].price).reduce((pre, cur, index) => {
          return Number(pre) + Number(cur)
        }),
        goodsIndex: Object.fromEntries(res.data.goods.map(i => {
          return [i.id, 0]
        })),
        id: this.options.id,
        userid: wx.getStorageSync('user').id,
        userInfo: wx.getStorageSync('user'),
        min_price: res.data.goods.map(e => [...e.stock]).flat().sort((e,i) => {
          return e - i
        })[0].price
      })
      this.drawShareImage()
    })
  },
  /**
   * 获取接龙评论列表
   */
  shopSolitaireComment () {
    getApp().ajax({
      url: 'shopSolitaireComment',
      data: {
        solitaire_id: this.options.id,
        limit: 2,
        page: 1
      }
    }).then(res => {
      this.setData({
        comment: res.data
      })
    })
  },
  /**
   * 接龙列表查询
   */
  shopSolitaireOrder() {
    getApp().ajax({
      url: `shopSolitaireOrder/${this.options.id}`,
      data: {
        limit: 10,
        page: this.data.page
      }
    }).then(res => {
      console.log(res)
      this.setData({
        order_list: [...this.data.order_list, ...res.data],
        page: this.data.page + 1,
        count: res.count
      })
    })
  },
  /**
   * 切换规格节点
   */
  changeindex (e){
    console.log(e.currentTarget.dataset)
    let goodsid = e.currentTarget.dataset.goodsid
    let stockindex = e.currentTarget.dataset.stockindex
    let goodsIndex = this.data.goodsIndex
    goodsIndex[goodsid] = stockindex
    console.log(goodsIndex)
    this.setData({
      goodsIndex
    })
    this.btnAdd()
  },
  /**
   * 拨打团长电话
   */
  call() {
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('area').phone,
    })
  },
  /**
   * 页面跳转
   * @param {*} e
   */
  go(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /**
   * 购买
   */
  tobuy () {
    console.log(this.data.goodsIndex,this.data.goods)
    let data = [{
      supplier_id: this.data.goods[0].supplier_id,
      supplier_name: this.data.goods[0].supplier_id == 0 ? wx.getStorageSync('shopInfo').name : this.data.goods[0].supplier_name,
      solitaire_id: this.options.id,
      list:this.data.goods.map(e => {
        console.log( e.stock[this.data.goodsIndex[e.id]])
        return {
          goods_id: e.id,
          goods_name: e.name,
          price: e.stock[this.data.goodsIndex[e.id]].price,
          number: e.number,
          weight: e.weight,
          total_price: e.stock[this.data.goodsIndex[e.id]].price * e.number,
          property1_name: e.stock[this.data.goodsIndex[e.id]].property1_name,
          property2_name: e.stock[this.data.goodsIndex[e.id]].property2_name,
          pic_url: e.pic_urls,
          stock_id: e.stock[this.data.goodsIndex[e.id]].stock_id,
          service_goods_is_ship: e.service_goods_is_ship,//服务商品
          type: e.type
        }
      })
    }]
    console.log(data)
    wx.setStorageSync('shopcartData', data)
    wx.navigateTo({
      url: `/pages/createOrder/createOrder/createOrder?solitaire=${this.options.id}`,
    })
  },
  /**
   * 图片上传
   */
  uploadFile(){
    wx.chooseImage({
      complete: (res) => {
        //将要上传的图片放入数组内进行上传
        let arr = res.tempFilePaths.map(i => this.commentImageUpload(i))
        Promise.all(arr).then(response => {
          console.log(response)
          this.setData({
            uploadImg: response
          })
        })
      },
    })
  },
  /**
   * 评论图片上传
   * @param {String} url 图片链接
   */
  commentImageUpload(url){
    return new Promise(reslove => {
      wx.uploadFile({
        url: `${wx.getStorageSync('url')}shopGoodsCommentUploads`,
        filePath: url,
        header:{
          'Access-Token': wx.getStorageSync("jwt")
        },
        name: 'pic_url',
        success: res => {
          reslove(JSON.parse(res.data).data)
        }
      })
    })
  },
  /**
   * 填写评论
   */
  writecomment(e) {
    this.setData({
      commentText: e.detail.value
    })
  },
  /**
   * 提交评论
   */
  postComment() {
    let data = {
      solitaire_id: this.options.id,
      content: this.data.commentText,
      pic_urls: this.data.uploadImg
    }
    console.log(data)
    if(data.content != ''){
      getApp().ajax({
        url: 'shopSolitaireComment',
        data,
        method: 'post'
      }).then(res => {
        console.log(res)
        this.setData({
          commentFlag: true
        })
        this.shopSolitaireComment()
      })
    }else{
      wx.showToast({
        title: '请填写评论',
        icon: 'none'
      })
    }
  },
  showCommentLayer(){
    this.setData({
      commentFlag: false
    })
  },
  /**
   * 预览图片
   */
  preImage(e){
    wx.previewImage({
      urls: this.data.pic_urls,
      current: e.currentTarget.dataset.pic
    })
  },
  /**
   * 绘制分享图片
   */
  drawShareImage () {
    let query = wx.createSelectorQuery()
    query.select('#shareimg').fields({node: true}).exec(async (res) => {
      let canvas = res[0].node
      let ctx = canvas.getContext('2d')
      let dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = 375
      canvas.height = 302
      
      //绘制按钮样式
      ctx.beginPath() 
      ctx.fillStyle = this.data.background
      ctx.fillRect(0,0,375,302)
      ctx.closePath()

      //绘制按钮样式
      ctx.beginPath() 
      ctx.fillStyle = '#ffffff'
      ctx.arc(10, 136, 10, Math.PI, Math.PI*1.5)
      ctx.arc(365, 136, 10, Math.PI*1.5, 0)
      ctx.lineTo(375, 302)
      ctx.lineTo(0, 302)
      ctx.lineTo(0, 136)
      ctx.fill()
      ctx.closePath()
      ctx.save() // 保存画布

      ctx.beginPath() 
      ctx.arc(188, 35, 25, Math.PI, Math.PI*4)
      ctx.clip()
      await this.drawimgtocanvas(canvas, ctx, this.data.userInfo.avatar, {x: 163, y: 10, width: 50, height: 50})
      ctx.closePath()
      ctx.restore() //还原画布

      //绘制分享标题
      ctx.textAlign = 'center'
      ctx.font = '18px sans-serif'
      let warplen = 18
      let titlelength = (this.data.areaInfo.area_name.length +3) / warplen
      if((this.data.areaInfo.area_name.length +3) % warplen != 0){
        titlelength = Number.parseInt(titlelength) + 1
      }
      for(let i = 0; i < titlelength; i++){
        ctx.fillText(`${this.data.areaInfo.area_name}的团购接龙`.substr(i*warplen,i*warplen+warplen), 372/2, 85 + i*20)
      }
      ctx.textAlign = 'left'
      ctx.font = 'bold 20px sans-serif'
      ctx.fillStyle = '#101010'
      ctx.fillText(this.data.name.slice(0,13), 27, 160)

      ctx.fillStyle = 'red'
      ctx.font = 'bold 13px sans-serif'
      ctx.fillText('起', 346, 160)


      

      ctx.textAlign = 'right'
      ctx.font = 'bold 24px sans-serif'
      ctx.fillText(this.data.min_price, 375 - 29, 160)
      ctx.font = 'bold 20px sans-serif'
      ctx.fillText('￥', 375 - 29 - (this.data.min_price.length - 1) * 15.5, 160)

      //绘制商品图片
      let imgarr = [...this.data.goods].slice(0,3)
      for(let i in imgarr){
        await this.drawimgtocanvas(canvas, ctx, imgarr[i].pic_urls, {x: 21 + i * 115, y: 188, width: 103, height: 103})
      }

      //绘制按钮
      ctx.save() 
      ctx.beginPath() 
      ctx.globalAlpha = '0.8'
      ctx.fillStyle = this.data.background
      ctx.arc(144, 234, 20, Math.PI*2.5, Math.PI*1.5)
      ctx.arc(232, 234, 20, Math.PI*1.5, Math.PI*2.5)
      ctx.lineTo(144,254)
      ctx.fill()
      ctx.closePath()
      ctx.restore()

      ctx.font = 'bold 18px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ffffff'
      ctx.fillText('我要接龙', 375 / 2, 241)

      wx.canvasToTempFilePath({
        canvas: canvas,
        width: canvas.width,
        height: canvas.height,
        destHeight: 302 * dpr,
        destWidth: 375*dpr,
        x: 0,
        y: 0,
        quality: 0,
        success: res => {
          setTimeout(() => {
            wx.uploadFile({
              url: `${wx.getStorageSync('url')}uploads`,
              filePath: res.tempFilePath,
              header:{
                'Access-Token': wx.getStorageSync("jwt")
              },
              name: 'pic_url',
              success: res => {
                let data = JSON.parse(res.data)
                if (data.status == 200){
                  this.setData({
                    shareimg: data.data
                  })
                }
              }
            })
          }, 200)
        }
      })
    })
  },
  /**
   * 同步下载图片
   * @param {*} canvas canvas节点
   * @param {*} ctx canvas对象
   * @param {*} src 图片地址
   * @param {*} data 坐标数据
   */
  async drawimgtocanvas (canvas, ctx, src, data) {
    return new Promise(reslove => {
      let img = canvas.createImage()
      img.src= src
      img.onload = (res) => {
        ctx.drawImage(img, data.x,data.y,data.width,data.height)
        reslove(`绘制 ${src} 完毕`)
      }
    })
  }
})