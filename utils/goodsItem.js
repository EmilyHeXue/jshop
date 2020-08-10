const goodsItem = Behavior({
  properties: {
    data: {
      type: Object,
      observer (e) {
        this.setData({
          ...e
        })
      }
    }
  },
  data: {
  },
  attached: function () {
    console.log('properties',this.properties)
    
  },
  methods: {
  }
})
export { goodsItem } 