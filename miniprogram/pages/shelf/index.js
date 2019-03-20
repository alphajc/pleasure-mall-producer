// pages/shelf/index.js
import {
  renderShelf
} from '../../utils/storage';
import {
  getInventoriesRefresh
} from '../../utils/db-cache';
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
    history: {},
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    showPopup: false,
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
    hideModal() {
      this.setData({
        showPopup: false
      });
    },
    edit(e) {
      const { id, inventory } = e.currentTarget.dataset;
      this.data.history = {
        inventory: inventory.inventory,
        price: inventory.price,
        mini_sales: inventory.mini_sales,
        commit_time: inventory.commit_time
      };
      this.setData({
        inventory, 
        showPopup: true
      });
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
                getInventoriesRefresh(app.db).then(()=>{
                  wx.showToast({
                    title: '下架成功',
                  });
                  self.setData({
                    inventories: self.data.inventories,
                    withoutInventories: self.data.inventories.filter(ivt => ivt.dropped !== true).length === 0
                  });
                });
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    },
    submit(e) {
      const { id } = e.currentTarget.dataset;
      const self = this;
      const data = e.detail.value;
      const _ = app.db.command;
      const ivtd = app.db.collection("inventories").doc(id);
      ivtd.update({
        data: {
          ...data,
          commit_time: new Date(),
          history: _.push([this.data.history])
        }
      }).then(res => {
        console.log(res);
        getInventoriesRefresh(app.db).then(()=>renderShelf(self));
        self.setData({
          showPopup: false
        });
        wx.showToast({
          title: '修改成功',
        })
      }).catch(console.error);
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