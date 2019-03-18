// miniprogram/pages/my/index.js
import {
  $wuxToast
} from '../../plugins/wux/index'

const app = getApp();

Component({
  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  pageLifetimes: {
    show() {
      let hasContactInfo = false;

      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        });
      } else if (this.data.canIUse) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            console.log('res', res);
            // 可以将 res 发送给后台解码出 unionId
            app.globalData.userInfo = res.userInfo;

            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (app.userInfoReadyCallback) {
              app.userInfoReadyCallback(res);
            }
          }
        });
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            console.log(res);
            app.globalData.userInfo = res.userInfo;
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            });
          }
        });
      }

      if (this.data.userInfo.username && this.data.userInfo.phone_number && this.data.userInfo.address && this.data.userInfo.address_detail) {
        hasContactInfo = true;
      }

      app.globalData.hasIssueForMine = !this.data.hasUserInfo || !hasContactInfo;

      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2,
          'list[2].dot': app.globalData.hasIssueForMine
        });
      }
    }
  },

  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    modifyProfile() {
      wx.navigateTo({
        url: 'profile/index',
      })
    },
    getUserInfo() {
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        });
      } else if (this.data.canIUse) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            app.globalData.userInfo = res.userInfo;

            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (app.userInfoReadyCallback) {
              app.userInfoReadyCallback(res);
            }
          },
          fail: () => {
            $wuxToast().show({
              type: 'forbidden',
              duration: 1500,
              color: '#fff',
              text: '授权失败',
              success: () => console.log('授权失败')
            });
          }
        });
      }
    }
  }
});