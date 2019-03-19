const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    selected: 0,
    list: [{
      pagePath: "/pages/market/index",
      text: "市场",
      iconPath: "/assets/tabbar/market.png",
      selectedIconPath: "/assets/tabbar/market-selected.png"
    }, {
      pagePath: "/pages/shelf/index",
      text: "货架",
      iconPath: "/assets/tabbar/deliver.png",
      selectedIconPath: "/assets/tabbar/deliver-selected.png"
    },
    {
      pagePath: "/pages/my/index",
      text: "我的",
      iconPath: "/assets/tabbar/my.png",
      selectedIconPath: "/assets/tabbar/my-selected.png"
    }]
  },
  lifetimes: {
    created() {
    },
    attached() {
    },
    detached() {
    }
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({
        url
      });
    }
  }
})