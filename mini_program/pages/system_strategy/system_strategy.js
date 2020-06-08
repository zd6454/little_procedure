// pages/system_strategy/system_strategy.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:[],
  },

  godetail:function(e){
    let self=this;
    console.log(e);
    var index= e.currentTarget.dataset.index;
   wx.navigateTo({
     url: '../../pages/detail_system/index',
     events:{

     },
     success:function(res){
       res.eventChannel.emit('system',{data:self.data.list[index]})
     },
     fail:function(err){
     }
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this;
   db.collection("system_strategy").orderBy("image","asc").get({
     success:function(res){
        self.setData({
          list:res.data,
        })
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