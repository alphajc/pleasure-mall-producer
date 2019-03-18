// pages/shelf/index.js
import {
  getInventories,
  getGoods
} from '../../utils/db-cache'
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    inventories: [],
    msg: {
      title: '您还没有相关的待售商品',
      text: '可以去看看有哪些可以卖的',
      buttons: [{
        text: '随便逛逛',
      }]
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    buttonClicked() {
      wx.switchTab({
        url: '/pages/market/index'
      });
    }
  },

  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
    }
  },

  lifetimes: {
    attached() {
      const self = this;

      getInventories(() => {
        wx.getStorage({
          key: 'inventories',
          success(res) {
            const inventories = res.data.filter(ivt => ivt.dropped !== true); // 过滤掉标记为删除的数据
            getGoods(() => {
              wx.getStorage({
                key: 'goods',
                success(res) {
                  const goods = res.data;
                  wx.getStorage({
                    key: 'goodsImgs',
                    success(res) {
                      const imgs = res.data;

                      self.setData({
                        inventories: inventories.map(ivt => {
                          const found = goods.find(item => item._id === ivt.gid);

                          return {
                            inventory: ivt.inventory,
                            price: ivt.price,
                            level: ivt.level,
                            id: ivt._id,
                            name: found.name,
                            img: imgs[found.pic]
                          };
                        })
                      });
                    }
                  });
                },
              })
            });
          }
        });
      });
    }
  }
})