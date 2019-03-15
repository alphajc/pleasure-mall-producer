// miniprogram/pages/market/index.js
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
      // limit默认为20，所以此处默认取出20个分类
      app.db.classes.get()
      .then(res=>{
        let classes = res.data.map(c=>c.name);

        // 默认支持50个种类
        app.db.goods
        .limit(50)
        .get()
        .then(res=>{
          let goods={},imgs={};
          wx.cloud.getTempFileURL({
            fileList: res.data.map(g => g.pic),
            success: r => {
              // fileList 是一个有如下结构的对象数组
              // [{
              //    fileID: 'cloud://xxx.png', // 文件 ID
              //    tempFileURL: '', // 临时文件网络链接
              //    maxAge: 120 * 60 * 1000, // 有效期
              // }]
              console.log('fileList:', r.fileList)
              r.fileList.forEach(f => imgs[f.fileID] = f.tempFileURL);
              console.log('imgs:',imgs);
              res.data.forEach(g=>{
                if(!goods[g['class']]) {
                  goods[g['class']] = []
                }
                goods[g['class']].push(Object.assign(g, {img: imgs[g.pic]}, {commit_time: g.commit_time.getTime()}));
              });
              console.log('goods:', goods);
              this.setData({
                classes,
                goods
              });
            },
            fail: console.error
          });
        });
        classes.forEach(c=>{

        });
      });
      console.log('market attached.');
    },
    detached() {
      console.log('market detached.');
    }
  }
})