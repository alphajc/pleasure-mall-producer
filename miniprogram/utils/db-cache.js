const getClassesRefresh = (callback) => {
  wx.cloud.callFunction({
    name: 'getDocs',
    data: {
      clt: 'classes',
      felter: {}
    }
  }).then(res => {
    const data = res.result.data.map(c => c.name);
    wx.setStorage({
      key: 'classes',
      data: data,
      success: callback || console.log
    });
  }).catch(console.log);
}

const getClasses = (callback) => {
  wx.getStorageInfo({
    success(res) {
      if (res.keys.indexOf('classes') !== -1) callback();
      else getClassesRefresh(callback);
    }
  });
}

const getGoodsRefresh = (callback) => {
  wx.cloud.callFunction({
    name: 'getDocs',
    data: {
      clt: 'goods',
      felter: {}
    }
  }).then(res => {
    const data = res.result.data;
    try {
      wx.setStorageSync('goods', data)
    } catch (e) {
      console.log(e);
    }
    let goods = {},
      imgs = {};
    wx.cloud.getTempFileURL({
      fileList: data.map(g => g.pic),
      success: r => {
        // fileList 是一个有如下结构的对象数组
        // [{
        //    fileID: 'cloud://xxx.png', // 文件 ID
        //    tempFileURL: '', // 临时文件网络链接
        //    maxAge: 120 * 60 * 1000, // 有效期
        // }]
        // callback('fileList:', r.fileList)
        r.fileList.forEach(f => imgs[f.fileID] = f.tempFileURL);
        wx.setStorage({
          key: 'goodsImgs',
          data: imgs,
          success: callback || console.log
        });
      },
      fail: console.log
    });
  }).catch(console.log);
}

const getGoods = (callback) => {
  wx.getStorageInfo({
    success(res) {
      if (res.keys.indexOf('goods') !== -1 && res.keys.indexOf('goodsImgs') !== -1) callback();
      else getGoodsRefresh(callback);
    }
  });
}

// Promise
const getInventoriesRefresh = (db) => {
  return new Promise((resolve, reject) => {
    db.collection("inventories").get().then(res => {
      wx.setStorage({
        key: 'inventories',
        data: res.data,
        success: resolve,
        fail: reject
      });
    });
  });
}

// Promise
const getInventories = (db) => {
  return new Promise((resolve, reject) => {
    wx.getStorageInfo({
      success(res) {
        if (res.keys.indexOf('inventories') !== -1) resolve();
        else getInventoriesRefresh(db).then(resolve).catch(reject);
      }
    });
  });
}

module.exports = {
  getClasses,
  getGoods,
  getInventories,
  getClassesRefresh,
  getGoodsRefresh,
  getInventoriesRefresh
}