// miniprogram/pages/market/index.js
import {
  getClasses,
  getGoods
} from '../../utils/db-cache'
const app = getApp();
const appData = app.globalData;

Component({
  data: {
    loading: true,
    loadProgress: 0,
    classes: [],
    TabCur: 0,
    VerticalNavTop: 0
  },
  methods: {
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
      })
    },
    selectGoods(e) {
      console.log(appData.userInfo);
      if (appData.userInfo.address &&
        appData.userInfo.address.length > 0 &&
        appData.userInfo.address_detail) {
        wx.setStorage({
          key: e.currentTarget.dataset.commodity._id,
          data: e.currentTarget.dataset.commodity,
          success: res => {
            wx.navigateTo({
              url: 'commodity/index?id=' + e.currentTarget.dataset.commodity._id,
            });
          },
          fail: console.log
        });
      } else {
        wx.showModal({
          title: '个人信息缺失',
          content: '缺少个人信息，无法上架商品，需要前往添加吗？',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../my/profile/index',
              });
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }

    }
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  },
  lifetimes: {
    attached() {
      const self = this;
      getClasses(() => {
        wx.getStorage({
          key: 'classes',
          success(res) {
            const classes = res.data;
            self.setData({
              classes,
              loadProgress: 10
            });
            getGoods(() => {
              wx.getStorage({
                key: 'goods',
                success(res) {
                  const goods = res.data;
                  self.setData({
                    loadProgress: 40
                  });
                  wx.getStorage({
                    key: 'goodsImgs',
                    success(res) {
                      const imgs = res.data;
                      const goodsByClass = {};
                      goods.forEach(g => {
                        self.setData({
                          loadProgress: self.data.loadProgress + (40 / goods.length)
                        });
                        if (!goodsByClass[g['class']]) {
                          goodsByClass[g['class']] = [];
                        }
                        goodsByClass[g['class']].push({
                          ...g,
                          img: imgs[g.pic]
                        });
                      });
                      self.setData({
                        goods: goodsByClass,
                        loadProgress: 100,
                        loading: false
                      });
                    },
                  })
                },
              });
            });
          },
          fail: console.error
        });
      });
    },
    detached() {
      // console.log('market detached.');
    }
  }
})