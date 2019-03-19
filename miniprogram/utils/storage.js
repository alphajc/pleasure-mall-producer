import {
  getInventories,
  getGoods
  } from './db-cache'

const renderShelf = (context) => {
  getInventories().then(() => {
    wx.getStorage({
      key: 'inventories',
      success(res) {
        const inventories = res.data; //.filter(ivt => ivt.dropped !== true); // 过滤掉标记为删除的数据
        context.setData({
          inventories: inventories.map(ivt => ({
            inventory: ivt.inventory,
            price: ivt.price,
            level: ivt.level,
            dropped: ivt.dropped
          }))
        });
        context.setData({
          loadProgress: 30
        });
        getGoods(() => {
          wx.getStorage({
            key: 'goods',
            success(res) {
              const goods = res.data;
              context.setData({
                loadProgress: 50
              });
              wx.getStorage({
                key: 'goodsImgs',
                success(res) {
                  const imgs = res.data;
                  context.setData({
                    loadProgress: 70
                  });
                  context.setData({
                    inventories: inventories.map(ivt => {
                      const found = goods.find(item => item._id === ivt.gid);

                      context.setData({
                        loadProgress: context.data.loadProgress + 20 / inventories.length
                      });

                      return {
                        inventory: ivt.inventory,
                        price: ivt.price,
                        level: ivt.level,
                        id: ivt._id,
                        name: found.name,
                        img: imgs[found.pic],
                        dropped: ivt.dropped
                      };
                    }),
                    loadProgress: 100,
                    loading: false
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

module.exports = {
  renderShelf
}