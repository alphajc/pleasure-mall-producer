// miniprogram/pages/market/commodity/index.js
import { getInventoriesRefresh } from '../../../utils/db-cache'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    inventory: {},
    tabSelected: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const self = this;
    wx.getStorage({
      key: options.id,
      success(res) {
        console.log(app.globalData);
        self.setData({
          name: res.data.name,
          img: res.data.img,
          features: res.data.features,
          notes: res.data.notes,
          qualities: res.data.qualities,
          address: app.globalData.userInfo.address.join('') + app.globalData.userInfo.address_detail
        });
        self.data.inventory.gid = res.data._id;
        self.data.inventory.origin = app.globalData.userInfo.address.join('');
        wx.removeStorage({
          key: options.id,
          success: console.log
        });
      },
      fail() {

      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onClickIcon() {
    wx.switchTab({
      url: '/pages/shelf/index'
    });
    // wx.navigateBack({
    //   delta: 1,
    //   success: () => {

    //   }
    // });
  },
  hideModal() {
    this.setData({
      showPopup: false
    });
  },
  onClickButton() {
    this.setData({
      showPopup: true
    });
  },
  onMiniSalesBlur(e) {
    console.log(e)
    this.setData({
      'inventory.mini_sales': e.detail.value
    });
  },
  onPriceBlur(e) {
    this.setData({
      'inventory.price': e.detail.value
    });
  },
  onInventoryBlur(e) {
    this.setData({
      'inventory.inventory': e.detail.value
    });
  },
  onLevelChange(e) {
    this.setData({
      'inventory.level': e.detail.value
    });
  },
  submit() {
    const self = this;
    const ivtc = app.db.collection("inventories");
    // 默认用openid，所以此处不加入过滤条件
    ivtc.where({
        gid: self.data.inventory.gid,
        level: self.data.inventory.level
      })
      .get({
        success(res) {
          console.log('submit get success:', res);
          const inventories = res.data.filter(item => item.dropped !== true);
          if (inventories.length === 0) {
            ivtc.add({
                data: {
                  ...self.data.inventory,
                  commit_time: new Date()
                }
              })
              .then(res => 
                getInventoriesRefresh(app.db)
                .then(() => 
                {
                  try {
                    wx.setStorageSync('result', {
                      result: '成功',
                      label: '您的' + self.data.inventory.level + '级别的' + self.data.name + '已经成功上架'
                    });
                    wx.navigateTo({
                      url: '../result/index'
                    });
                  } catch (e) {
                    console.error(e);
                  }
                })
              );
          } else {
            try {
              wx.setStorageSync('result', {
                result: '失败',
                icon: {
                  type: 'warn',
                  color: 'red'
                },
                label: '您的已经存在' + self.data.inventory.level + '级别的' + self.data.name + '，请前往货架进行修改'
              });
              wx.navigateTo({
                url: '../result/index'
              });
            } catch (e) {
              console.error(e);
            }
          }
        },
        fail: console.log
      });
  },
  tabSelect(e) {
    this.setData({
      tabSelected: e.target.dataset.id
    });
  }
})