const app = getApp();

Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
        pagePath: "/pages/market/index",
        icon: "home-o",
        text: "市场",
        dot: app.globalData.hasIssueForMarket || false
      }, {
        pagePath: "/pages/shelf/index",
        icon: "shop-o",
        text: "货架",
        dot: app.globalData.hasIssueForShelf || false
      },
      {
        pagePath: "/pages/my/index",
        icon: "manager-o",
        text: "我的",
        dot: app.globalData.hasIssueForMine || false
      }
    ]
  },
  lifetimes: {
    created() {
      // console.log('tabbar created');
    },
    attached() {
      this.setData({
        'list[0].dot': app.globalData.hasIssueForMarket || false,
        'list[1].dot': app.globalData.hasIssueForShelf || false,
        'list[2].dot': app.globalData.hasIssueForMine || false,
      });
      // console.log('tabbar attached');
    },
    detached() {
      // console.log('tabbar detached');
    }
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({
        url
      });
      this.setData({
        selected: data.index,
        'list[0].dot': app.globalData.hasIssueForMarket || false,
        'list[1].dot': app.globalData.hasIssueForShelf || false,
        'list[2].dot': app.globalData.hasIssueForMine || false,
      });
    }
  }
})