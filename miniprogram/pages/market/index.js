// miniprogram/pages/market/index.js
Component({
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
      console.log('market attached.');
    },
    detached() {
      console.log('market detached.');
    }
  }
})