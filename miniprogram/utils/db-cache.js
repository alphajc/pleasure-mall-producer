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
  }).catch(console.error);
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
      console.error(e);
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
      fail: console.error
    });
  }).catch(console.error);
}

const getGoods = (callback) => {
  wx.getStorageInfo({
    success(res) {
      if (res.keys.indexOf('goods') !== -1 && res.keys.indexOf('goodsImgs') !== -1) callback();
      else getGoodsRefresh(callback);
    }
  });
}

const getInventoriesRefresh = (callback) => {
  wx.cloud.callFunction({
    name: 'getDocs',
    data: {
      clt: 'inventories',
      felter: {}
    }
  }).then(res => {
    const data = res.result.data;
    wx.setStorage({
      key: 'inventories',
      data: data,
      success: callback || console.log
    });
  }).catch(console.error);
}

const getInventories = (callback) => {
  wx.getStorageInfo({
    success(res) {
      if (res.keys.indexOf('inventories') !== -1) callback();
      else getInventoriesRefresh(callback);
    }
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