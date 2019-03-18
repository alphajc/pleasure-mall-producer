// miniprogram/pages/my/profile/profile.js
import area from './area';
import {
  $wuxToast
} from '../../../plugins/wux/index'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    areaList: area
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
    if (app.globalData.userInfo) {
      this.setData({
        'userInfo.username': app.globalData.userInfo.username || '',
        'userInfo.phone_number': app.globalData.userInfo.phone_number || '',
        'userInfo.address': app.globalData.userInfo.address || '',
        'userInfo.address_code': app.globalData.userInfo.address_code || '511402', // 设置默认地址为四川省眉山市东坡区
        'userInfo.address_detail': app.globalData.userInfo.address_detail || ''
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
  onCloseAddress() {
    this.setData({
      showPopup: false
    });
  },
  onAddressTap() {
    this.setData({
      showPopup: true
    });
  },
  confirmAddress(e) {
    this.setData({
      'userInfo.address_code': e.detail.values[2].code,
      'userInfo.address': e.detail.values.map(value => value.name).join(''),
      showPopup: false
    });
  },
  formSubmit(e) {
    let userCol = app.db.producers;
    let userDoc = app.db.producers.doc(app.globalData.openid);

    // 手动将数据反向绑定
    Object.assign(this.data.userInfo, e.detail.value);

    Object.assign(app.globalData.userInfo, this.data.userInfo);

    // 写入数据库
    userDoc.get()
      .then(res => {
        userDoc.update({
            // data 传入需要局部更新的数据
            data: {
              ...this.data.userInfo
            }
          })
          .then(res => {
            $wuxToast().show({
              type: 'success',
              duration: 1500,
              color: '#fff',
              text: '保存成功',
              success: console.log
            });
          })
          .catch(e => {
            console.log(this.data.userInfo);
            console.error(e);
            $wuxToast().error({
              duration: 1500,
              color: '#fff',
              text: '保存失败'
            });
          })
      })
      .catch(e => {
        app.db.producers.add({
            // data 字段表示需新增的 JSON 数据
            data: {
              _id: app.globalData.openid,
              register_time: new Date(),
              ...app.globalData.userInfo
            }
          })
          .then(res => {
            $wuxToast().show({
              type: 'success',
              duration: 1500,
              color: '#fff',
              text: '保存成功',
              success: console.log
            });
          })
          .catch(e => {
            console.error(e);
            $wuxToast().error({
              duration: 1500,
              color: '#fff',
              text: '保存失败'
            });
          });
      });

    // 返回
    // wx.navigateBack({
    //   delta: 1
    // });
  }
})