// pages/light/light.js
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var qqmapsdk=new QQMapWX({
  key: 'QO5BZ-VD6R4-M4AUD-D36UT-VGBVS-6HBZV' // 必填
});  
const util = require('../../utils/util.js');
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   openid:"",
   light:"",
   arraylight:"",
   time:"",
   lightimage:"",
   userinfo:[],
   cratedAt:"",
  },

    //选择图片
  chooseImage(e) {
      let self=this;
        wx.chooseImage({
          sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
          sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
          success: res => {
            const oneimage = res.tempFilePaths.length>1?res.tempFilePaths[0]:res.tempFilePaths[0];
            // 限制1张照片
            this.setData({
              lightimage:oneimage,
            })
            setTimeout(function(){
             self.upload();
            },200)
            setTimeout(function(){
              self.addlightimage(e);
            },2000)   
          }
        })
      },
  //获取所有点亮数据
  getlights:function(){
    let self=this;
    let info='';
    wx.getSetting({
      success:res=>{
       wx.getUserInfo({
         success:res=>{
          self.setData({
            userinfo:res.userInfo,
          });
         },
         fail:err=>{
           console.log(err);
         wx.showToast({
           title: '获取用户信息失败',
         })
         },
         complete: (res) => {},
       })
      }
      })
   db.collection("lights").where({
    _openid: self.data.openid,
   }).orderBy("cratedAt",'desc').get({
     success:res=>{
     self.setData({
       arraylight:res.data,
     })
     },
     fail:err=>{
       console.log(err);
     }
   })
  },
  //获取地址信息
  getlocation(){
    var self=this;
    var time = util.formatDate(new Date());
    var cratedAt = util.formatTime(new Date());
    wx.getLocation({
      type: 'gcj02',
      altitude: 'altitude',
      success(res){
        qqmapsdk.reverseGeocoder({
          location:{
            latitude:res.latitude,
            longitude:res.longitude
          },
          success:function(e){
            console.log(e,2);
            self.setData({
              light:e.result.formatted_addresses.recommend,
              time:time,
              cratedAt:cratedAt,
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
  //点亮
  lighting:function(){
    let self=this;
   db.collection("lights").add({
     data:{
      spot:self.data.light,
      time:self.data.time,
      cratedAt:self.data.cratedAt,
      lightimage:self.data.lightimage,
      userInfo:self.data.userInfo,
     },
     success:function(res){
      if (getCurrentPages().length != 0) {
        //刷新当前页面的数据
        getCurrentPages()[getCurrentPages().length - 1].onLoad()
      } 
     }
   })
  },
  //查看图片
  checkimage:function(e){
    let self=this;
    const index = e.target.dataset.index
    console.log(e);
     let imageurl=self.data.arraylight[index].lightimage;
    wx.previewImage({
      urls: [imageurl],
      current:imageurl,
      success:function(res){
        console.log(res)
      },
      fail:function(res){
        console.log(res);
      }
    })
  },
  //添加图片
  addlightimage:function(e){
  let self=this;
  console.log(e);
   var index=e.currentTarget.dataset.index;
   console.log(self.data.arraylight[index]);
   db.collection("lights").doc(self.data.arraylight[index]._id).update({
     data:{
        lightimage:self.data.lightimage,
     },
     success:res=>{
       wx.showToast({
         title: '添加成功',
       })
       self.getlights();
       console.log(res);
     },
     fail:err=>{
       console.log(err);
      wx.showToast({
        title: '添加失败',
      })
     }
   })
  },
  //上传图片
  upload:function(){
    let self=this;
    wx.showToast({
      icon: 'loading',
      title:"处理中",
    });
        wx.cloud.uploadFile({
          cloudPath: 'lights_images/' + new Date().getTime(),
          filePath:self.data.lightimage,
          success:res=>{
            console.log('上传成功', res.fileID);
            self.setData({
              lightimage:res.fileID,
            })
          },
          fail:err=>{
            wx.showToast({
              title: '上传失败',
            })
            console.log("shi",err)
          }
        })
  },
  //添加新的点亮
  addlight:function(){
    let self=this;
   self.getlocation();
   setTimeout(function(){
      self.lighting();

   },1000)
  },
    //获取用户信息
    ongetUserInfo: function (e) {
      console.log(e.detail.errMsg)
    },
    //获取用户openid
    getuseropenid(){
       let self=this;
       wx.cloud.callFunction({
         name:'getuseropenid',
         complete:res=>{
           console.log(res)
           console.log('获取的id：',res.result.openid)
           var openid=res.result.openid;
           self.setData({
             openid:openid
           })
         }
       })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this;
   this.getuseropenid();
   setTimeout(function(){
     self.getlights();
   },1000)
  
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
    // let self=this;
    // this.getuseropenid();
    // setTimeout(function(){
    //   self.getlights();
    // },1000)
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