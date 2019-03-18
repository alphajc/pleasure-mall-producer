// miniprogram/pages/market/result/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: {
      type: 'success'
    },
    buttons: [{
      type: 'balanced',
      block: true,
      text: '确定',
    },
    {
      type: 'light',
      block: true,
      text: '返回',
    }],
    label:'',
    result: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    wx.getStorage({
      key: 'result',
      success(res) {
        self.setData(res.data);
      },
      fail() {
        self.setData({
          icon: {
            type: 'warn',
            color: 'red'
          },
          result: '失败',
          label: '页面访问失败'
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onClick(e) {
    console.log(e);
    const { index } = e.detail;

    index === 0 && wx.navigateBack({
      delta: 2
    });

    index === 1 && wx.navigateBack();
  },
})