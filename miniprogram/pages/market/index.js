// miniprogram/pages/market/index.js
import { getClasses, getGoods } from '../../utils/db-cache'
const app = getApp();

Component({
  data: {
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
      try {
        wx.setStorageSync(e.currentTarget.dataset.commodity._id, e.currentTarget.dataset.commodity);
      } catch (e) {
        console.error(e);
      }
      wx.navigateTo({
        url: 'commodity/index?id=' + e.currentTarget.dataset.commodity._id,
      })
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
              classes
            });
            getGoods(() => {
              wx.getStorage({
                key: 'goods',
                success(res) {
                  const goods = res.data;
                  wx.getStorage({
                    key: 'goodsImgs',
                    success(res) {
                      const imgs = res.data;
                      const goodsByClass = {};
                      goods.forEach(g => {
                        if (!goodsByClass[g['class']]) {
                          goodsByClass[g['class']] = [];
                        }
                        goodsByClass[g['class']].push({
                          ...g,
                          img: imgs[g.pic]
                        });
                      });
                      self.setData({
                        goods: goodsByClass
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
      // app.db.classes.get()
      //   .then(res => {
      //     let classes = res.data.map(c => c.name);
      //     this.setData({
      //       classes
      //     });

      //     wx.cloud.callFunction({
      //       name: 'getDocs',
      //       data: {
      //         clt: 'goods',
      //         felter: {}
      //       }
      //     }).then(res => {
      //       const data = res.result.data;
      //       let goods = {}, imgs = {};
      //       // console.log('data', data);
      //       wx.cloud.getTempFileURL({
      //         fileList: data.map(g => g.pic),
      //         success: r => {
      //           // fileList 是一个有如下结构的对象数组
      //           // [{
      //           //    fileID: 'cloud://xxx.png', // 文件 ID
      //           //    tempFileURL: '', // 临时文件网络链接
      //           //    maxAge: 120 * 60 * 1000, // 有效期
      //           // }]
      //           // console.log('fileList:', r.fileList)
      //           r.fileList.forEach(f => imgs[f.fileID] = f.tempFileURL);
      //           // console.log('imgs:', imgs);
      //           data.forEach(g => {
      //             // console.log('g', g);
      //             if (!goods[g['class']]) {
      //               goods[g['class']] = [];
      //             }
      //             goods[g['class']].push({
      //               ...g,
      //               img: imgs[g.pic]
      //             });
      //           });
      //           // console.log('goods:', goods);
      //           this.setData({
      //             goods
      //           });
      //         },
      //         fail: console.error
      //       });
      //     });
      //   });
      // console.log('market attached.');
    },
    detached() {
      // console.log('market detached.');
    }
  }
})