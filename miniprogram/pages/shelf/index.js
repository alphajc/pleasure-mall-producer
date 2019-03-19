// pages/shelf/index.js
import {
  renderShelf
} from '../../utils/storage'
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
    loading: true,
    loadProgress: 0,
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
    },
    modify(e) {
      console.log(e);
    },
    delete(e) {
      const self = this;
      const ivtc = app.db.collection("inventories");
      const { id, index } = e.currentTarget.dataset;
      console.log('id', id);
      console.log('index', index);
      wx.showModal({
        title: '确认',
        content: '确认要下架该商品吗？',
        success(res) {
          if (res.confirm) {
            ivtc.doc(id).update({
              data: {
                dropped: true
              },
              success() {
                self.data.inventories[index].dropped = true;
                console.log('self.data.inventories', self.data.inventories);
                self.setData({
                  inventories: self.data.inventories
                });
                wx.showToast({
                  title: '下架成功',
                });
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    }
  },

  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        });
      }
      
      renderShelf(this);
    }
  },

  lifetimes: {
    attached() {
      renderShelf(this);
    }
  }
})