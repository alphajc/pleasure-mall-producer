Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/commodities/index",
      icon: "home-o",
      text: "市场",
      dot: false
    }, {
      pagePath: "/pages/my/index",
      icon: "manager-o",
      text: "我的",
      dot: true
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})