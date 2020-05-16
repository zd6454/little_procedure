// pages/spot_detail_map/index.js
const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0.0,
    longitude: 0.0,
    // 下面代码会在对应位置生成箭头
    markers: [{
      latitude: 0.0,
      longitude: 0.0,
      name: ''
    }],
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { spot_id } = options;
    console.log(spot_id);
    this.getSpotDetail(spot_id);
    this.setData({
      SpotId: spot_id,
    })
  },

  getSpotDetail(spot_id) {
    db.collection("spots").doc(spot_id).get({
      success: res => {
        console.log(res.data);
        this.setData({
          latitude: res.data.spot_latitude,
          longitude: res.data.spot_longitude,
          markers: [{
            latitude: res.data.spot_latitude,
            longitude: res.data.spot_latitude,
            name: res.data.spot_name,
          }],
        });
      }
    })
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

  }
})