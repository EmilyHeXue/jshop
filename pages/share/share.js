// pages/share/share.js
let canvas
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:'',
    background: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '分享海报',
    })
    app.setTheme()
    wx.showLoading({
      title: '图片合成中',
    })
    if (options.type==1){
      this.shareIndex()
    }else{
      this.shareGoodsDetails()
    }
    return false
    wx.showLoading({
      title: '图片生成中',
      icon: 'none'
    })
    this.getgoodData(options.id)
  },
  onShow(){
    this.setData({
      background: wx.getStorageSync('background')
    })
  },
  shareIndex(){
    getApp().ajax({
      url: 'shopPosters',
      data: {
        key: wx.getStorageSync('shopkey'),
        scene: `leader_id=${wx.getStorageSync('area_id') || 0},id=${wx.getStorageSync('user').id}`
      }
    }).then(res => {
      this.setData({
        img: res.data
      })
      wx.hideLoading()
    })
  }, 
  shareGoodsDetails() {
    getApp().ajax({
      url: 'shopDetailPosters',
      data: {
        key: wx.getStorageSync('shopkey'),
        goods_id: this.options.id,
        price:this.options.price,
        scene: `u_id=${wx.getStorageSync('user').id},l_id=${wx.getStorageSync('area_id')},id=${this.options.id}`
      }
    }).then(res => {
      this.setData({
        img: res.data
      })
      wx.hideLoading()
    })
  },
  getgoodData(id){
    app.ajax({
      url: 'shopGoodsCode',
      data: {
        path: `pages/goodsItem/goodsItem/goodsItem`,
        id: id
      }
    }).then(res => {
      canvas = new ctx(wx.createCanvasContext('banner'), res.data)
    })
  },
  save(){
    console.log()
    wx.getImageInfo({
      src: this.data.img,
      success: res => {
        console.log(res.path)
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: res => {
            console.log(res)
            wx.showToast({
              title: '图片保存完毕',
              icon: 'none'
            })
          },
          fail: err => {
            wx.showToast({
              title: '图片保存失败',
              icon: 'none'
            })
          }
        })
      }
    })
    return false
    wx.saveFile({
      tempFilePath: this.data.img,
      success: res => {
        
      }
    })
  }
})

class ctx{
  constructor(ctx, data, that){
    this.ctx = ctx //canvas上下文
    this.width = wx.getSystemInfoSync().screenWidth //适用于图片的宽度
    this.qrcode = data.url
    this.pic_url = data.pic_urls[0]
    this.price = `￥${data.price}`
    this.getname(data.name)
    this.savepng = ''
  }
  draw(that){ //绘制图像
    this.ctx.setFillStyle('#ffffff')
    this.ctx.fillRect(0, 0, 750, 1050)
    
    console.log('二维码绘制完毕')
    
    console.log('banner图绘制完毕')
    this.drawName()
    console.log('商品名绘制完毕')
    this.drawPrice()
    console.log('商品价格绘制完毕')
    this.drawBorder()
    console.log('框绘制完毕')
    this.drawBtn()
    console.log('按钮绘制完毕')
    this.drawImage(this.qrcode, this.pic_url)
  }
  getname(text){ //绘制名称
    if(text.length > 14){
      this.name = text.slice(0, 14) + '…'
    }else if(text.length === 14){
      this.name = text.slice(0, 14)
    }else{
      this.name = text
    }
  }
  drawImage(qrcode, pic_url){
    wx.downloadFile({//下载图片至本地
      url: qrcode,
      success: res => {
        this.ctx.drawImage(res.tempFilePath, this.width * 0.65, this.width * 1.05, this.width * 0.3, this.width * 0.3) //绘制图片
        wx.downloadFile({
          url: pic_url,
          success: re => {
            this.ctx.drawImage(re.tempFilePath, 0, 0, this.width, this.width)
            this.ctx.draw(false, res => {
              setTimeout(res => {
                wx.canvasToTempFilePath({
                  canvasId: 'banner',
                  destWidth: 750,
                  destHeight: 1050,
                  fileType: 'jpg',
                  success: res => {
                    console.log('图像导出成功', res)
                    this.savepng = res.tempFilePath
                    wx.hideLoading()
                  }
                }, this)
              }, 500)
            })
          }
        })
      }
    })
  }
  drawName(){ //绘制商品名称
    this.ctx.setFillStyle('#555555')
    this.ctx.setFontSize(this.width * 0.04)
    this.ctx.fillText(this.name, this.width * 0.076, this.width * 1.1)//文本内容, x, y
  }

  drawPrice(){ //绘制价格
    this.ctx.setFontSize(this.width * 0.04)
    this.ctx.setFillStyle('red')
    this.ctx.fillText(this.price, this.width * 0.072, this.width * 1.2)//文本内容, x, y
  }

  drawBtn(){ //绘制长按二维码抢购
    this.ctx.setFontSize(this.width * 0.04)
    this.ctx.setTextBaseline('middle')
    this.ctx.setFillStyle('red')
    let width = (this.width * 0.4 - this.width * 0.072 - this.ctx.measureText('长按二维码抢购').width) /2
    this.ctx.fillText('长按二维码抢购', this.width * 0.072 + width, this.width * 1.3 + this.width * 0.015)
  }

  drawBorder() {//绘制方框
    this.ctx.setStrokeStyle('red')
    
    //绘制border-top
    this.ctx.moveTo(this.width * 0.072, this.width * 1.3 - this.width * 0.04)
    this.ctx.lineTo(this.width * 0.4, this.width * 1.3 - this.width * 0.04)
    //绘制border-left
    this.ctx.moveTo(this.width * 0.072, this.width * 1.3 - this.width * 0.04)
    this.ctx.lineTo(this.width * 0.072, this.width * 1.3 + this.width * 0.06)
    //绘制border-bottom
    this.ctx.moveTo(this.width * 0.072, this.width * 1.3 + this.width * 0.06)
    this.ctx.lineTo(this.width * 0.4, this.width * 1.3 + this.width * 0.06)
    //绘制border-right
    this.ctx.moveTo(this.width * 0.4, this.width * 1.3 - this.width * 0.04)
    this.ctx.lineTo(this.width * 0.4, this.width * 1.3 + this.width * 0.06)
    this.ctx.stroke()

  }
  save(){
    console.log(this.savepng)
    wx.saveFile({
      tempFilePath: this.savepng,
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: res.savedFilePath,
          success: res => {
            console.log(res)
            wx.showToast({
              title: '图片保存完毕',
              icon: 'none'
            })
          },
          fail: err => {
            wx.showToast({
              title: '图片保存失败',
              icon: 'none'
            })
          }
        })
      }
    })
  }
}