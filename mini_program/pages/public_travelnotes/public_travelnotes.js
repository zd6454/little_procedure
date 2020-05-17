// pages/public_travelnotes/public_travelnotes.js
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var qqmapsdk=new QQMapWX({
  key: 'QO5BZ-VD6R4-M4AUD-D36UT-VGBVS-6HBZV' // 必填
});  
const util = require('../../utils/util.js');
Page({
  onShareAppMessage() {
    return {
      title: 'scroll-view',
      path: 'page/component/pages/scroll-view/scroll-view'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
  travelnote:{
    userinfo:{},
    images:[],
    location:"",
    permission:0,
    content:"",
    likeamount:0,
    goodamount:0,
    commentamount:0,
  },
   images:[],//图片
   location:"添加地点",
   permissionimage:"../../img/permission0.png",
   permission:0, //公开权限
   goodamount:0, //收藏数
    time:"",
   likeamount:0,//点赞数
  commentamount:0, //评论数
  // comment3:{   //是否新建一个集合记录
  //   uers:[{
  //      user_id:"",
  //     user_name:"",
  //     user_comment:""
  //   },{}],
  //   users_amount:Number,
  //   commnet_amount:Number,
  // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取输入框文字
  handleContentInput(e){
    let self=this;
    let content="travelnote.content";
    self.setData({
    [content]:e.detail.value,
    });
  },
  //获取用户信息
  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
  },
  //发布游记
  public_travelnotes(){
    const db=wx.cloud.database();
    var userInfo="travelnote.userinfo";
    var time = util.formatTime(new Date());
    let self=this;
    wx.getSetting({
      success (res) {
        console.log(res.authSetting)
        wx.getUserInfo({
          success: function(res) {
            self.setData({
            [userInfo]:res.userInfo,
            time:time,
            });
            console.log(res.userInfo);
            db.collection('travelnotes').add({
              data:{
               travelnote:self.data.travelnote,
               permission:self.data.permission,
               address:self.data.address,
               userInfo:res.userInfo,
               likeamount:self.data.likeamount,
               goodamount:self.data.goodamount,
               commentamount:self.data.commentamount,
               time:time,
              },
              success:function(suc){
                console.log(suc);
                wx.showToast({
                  title: '发布游记成功',
                });
              },
              fail:function(err){
                console.log(err);
                wx.showToast({
                  title: '发布游记失败',
                });
              }
            })
          },
         fail:function(err){
           console.log("获取用户信息失败");
           wx.showToast({
            title: '发布游记失败',
          });
         }
        })
      }
    })
    
  },
    //删除图片
  deleteimage:function(e){
    var self=this;
    var index=e.currentTarget.dataset.index;
    var images= self.data.images;
    images.splice(index,1);
    let ig="travelnote.images";
    self.setData({
      images:images,
      [ig]:images,
    });
  },
  //点击放大图片
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
  //是否公开
  permissionset(e){
     let self=this;
     const permission=self.data.permissionimage=="../../img/permission0.png"?"../../img/permission1.png":"../../img/permission0.png";
     const weight=self.data.permissionimage=="../../img/permission0.png"?0:1;
      let permission2="travelnote.permission";
       self.setData({
         permissionimage:permission,
         permission:weight,
         [permission2]:weight,
     })
  },
  //获取地址信息
  getlocation(){
    var self=this;
    var location= "travelnote.location";
    wx.getLocation({
      altitude: 'altitude',
      success(res){
        qqmapsdk.reverseGeocoder({
          location:{
            latitude:res.latitude,
            longitude:res.longitude
          },
          success:function(e){
            console.log(e);
            self.setData({
              location:e.result.address,
              [location]:e.result.address,
            })
          },
          fail:function(err){
            console.log(err)
          },
          complete:function(re){
            console.log(re);
          }
        })
        console.log(res);
      }
    })
  },
  //获取添加图片
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        let image="travelnote.images";
        this.setData({
          images:images.length <= 9 ? images : images.slice(0, 9) ,
          [image]:images.length <= 9 ? images : images.slice(0, 9) ,
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