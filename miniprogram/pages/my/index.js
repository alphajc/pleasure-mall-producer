// miniprogram/pages/my/index.js
import {upsertProfile} from './utils/persist';

const app = getApp();
const appData = app.globalData;

Component({
  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {
      address: []
    },
    hasAvatar: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  pageLifetimes: {
    show() {
      if (Object.keys(appData.userInfo).keys !== 0) {
        let hasAvatar = false;
        if (appData.userInfo.avatarUrl) {
          hasAvatar = true;
        }
        this.setData({
          userInfo: appData.userInfo,
          hasAvatar
        });
      } else if (this.data.canIUse) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            console.log('res', res);
            Object.assign(appData.userInfo, res.userInfo);

            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (app.userInfoReadyCallback) {
              app.userInfoReadyCallback(res);
            }
          }
        });
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: appData.userInfo,
            hasAvatar: true
          });
        };
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            console.log(res);
            Object.assign(appData.userInfo, res.userInfo);
            this.setData({
              userInfo: appData.userInfo,
              hasAvatar: true
            });
          }
        });
      }

      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
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
      });
    },
    getUserInfo() {
      wx.getUserInfo({
        success: res => {
          // 可以将 res 发送给后台解码出 unionId
          upsertProfile(appData.openid, res.userInfo)
          .then(console.log)
          .catch(console.log);
          Object.assign(appData.userInfo, res.userInfo);

          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (app.userInfoReadyCallback) {
            app.userInfoReadyCallback(res);
          }
        },
        fail: () => {
          wx.showToast({
            title: '授权失败',
            icon: 'none',
            duration: 2000
          })
        }
      });

      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: appData.userInfo,
          hasAvatar: true
        });
      };
    }
  }
});
