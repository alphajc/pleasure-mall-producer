//app.js

import {
  getClassesRefresh,
  getGoodsRefresh,
  getInventoriesRefresh
} from './utils/db-cache'

App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      // 连接腾讯云
      wx.cloud.init({
        traceUser: true,
        env: {
          database: "test-39237a",
          storage: "test-39237a",
          functions: "test-39237a"
        }
      });
      this.db = wx.cloud.database();

      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          getInventoriesRefresh(this.db);
          if (!this.globalData.openid) {
            wx.cloud.callFunction({
              name: 'login',
              data: {},
              success: res => {
                this.globalData.unionid = res.result.unionid;
                this.globalData.openid = res.result.openid;
                this.db.collection("producers")
                  .doc(res.result.openid)
                  .get()
                  .then(res => this.globalData.userInfo = Object.assign(this.globalData.userInfo, res.data))
                  .catch(e => {
                    console.log(e);
                    this.globalData.hasIssueForMine = true;
                  });
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '获取 openid 失败，请检查是否有部署 login 云函数',
                });
                console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err);
              }
            });
          } else {
            const callback = function() {
              console.group('数据库文档');
              console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html');
              console.groupEnd();
            };
          }
        }
      });

      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo;

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res);
                }
              }
            });
          }
        }
      });
      
      getClassesRefresh();
      getGoodsRefresh();
    }
  },
  globalData: {
    userInfo: {},
    hasIssueForMine: false,
    hasIssueForShelf: false,
    hasIssueForMarket: false
  }
});