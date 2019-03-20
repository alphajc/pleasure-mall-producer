// miniprogram/pages/my/profile/profile.js
import {
  upsertProfile
} from '../utils/persist'

const app = getApp();
const appData = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      address: ["四川省", "眉山市", "东坡区"]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const userInfo = appData.userInfo;
    if (Object.keys(userInfo).length !== 0) {
      this.setData({
        'userInfo.username': userInfo.username || '',
        'userInfo.phone_number': userInfo.phone_number || '',
        'userInfo.address': userInfo.address || ["四川省", "眉山市", "东坡区"],
        'userInfo.address_detail': userInfo.address_detail || ''
      });
    }
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
  regionChange(e) {
    console.log(e);
    this.setData({
      'userInfo.address': e.detail.value
    });
  },
  formSubmit(e) {
    // 手动将数据反向绑定
    Object.assign(this.data.userInfo, e.detail.value);

    // 写入数据库
    upsertProfile(appData.openid, this.data.userInfo).then(res => {
        Object.assign(appData.userInfo, this.data.userInfo);
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
      })
      .catch(e => {
        console.log(this.data.userInfo);
        console.error(e);
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        });
      });
  }
})