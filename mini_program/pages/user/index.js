// pages/user/index.js
const DB = wx.cloud.database().collection("travelnotes");
const DB1 = wx.cloud.database().collection("stategies");
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
    userInfo: [],
    tabs: [
      {
        id: 0,
        value: "景点",
        isActive: true
      },
      {
        id: 1,
        value: "攻略",
        isActive: false
      },
      {
        id: 2,
        value: "",
        isActive: false
      }
    ],
    list_travelnotes:[],
    list_strategy:[],
    collect_travelnotes:0,
    collect_strategy:0,
    user:[],
  },

  // 标题点击事件  从子组件传递过来  标签
  handleTabsItemChange(e) {
    // console.log(e);
    // 1.获取被点击的标题
    const { index } = e.detail;
    // 2.修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3.赋值到data中
    this.setData({
      tabs
    })
  },
 
  //初始化
  init() {
    var collect_travelnotes = 0;
    var collect_strategy = 0;
    //获取用户信息
    const that = this;
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          user: res.userInfo,//获取到用户信息
        })
      }
    })
    //游记
    DB.get({
      success: res => {
        console.log(res.data);
        // console.log("查询成功", res.data);
        res.data.forEach(v=>{
          console.log(v.good.length);
          if(v.good.length!=0){
            v.good.forEach(u => {
              if (u === this.data.user.nickName) {
                collect_travelnotes = collect_travelnotes + 1;
              }
            })
          }
        })
        this.setData({
          list_travelnotes: res.data,
          collect_travelnotes: collect_travelnotes,
          tabs: [
            {
              id: 0,
              value: "景点",
              isActive: true
            },
            {
              id: 1,
              value: "攻略*"+this.data.collect_strategy,
              isActive: false
            },
            {
              id: 2,
              value: "游记*" + collect_travelnotes,
              isActive: false
            }
          ],
        })
        // console.log(this.data.collect_travelnotes);
      },
      file(res) {
        console.log("查询失败", res);
      }
    })

    //攻略
    DB1.get({
      success: res => {
        res.data.forEach(v => {
          console.log(v.good.length);
          if (v.good.length != 0) {
            v.good.forEach(u => {
              if (u === this.data.user.nickName) {
                collect_strategy = collect_strategy + 1;
              }
            })
          }
        })
        // console.log("查询成功", res.data);
        this.setData({
          list_strategy: res.data,
          collect_strategy: collect_strategy,
          tabs: [
          {
            id: 0,
            value: "景点",
            isActive: true
          },
          {
            id: 1,
            value: "攻略*" + collect_strategy,
            isActive: false
          },
          {
            id: 2,
            value: "游记*" + this.data.collect_travelnotes,
            isActive: false
          }
        ],
        })
        console.log(this.data.collect_strategy);
      },
      file(res) {
        console.log("查询失败", res);
      }
    })
  },


  //返回到页面时刷新
  onShow: function () {
    this.init();
  },
  //下拉刷新
  onPullDownRefresh() {
    this.init();
    wx.stopPullDownRefresh();
  },

  onLoad: function () {
    this.init();
    let self=this;
    this.getuseropenid();
    setTimeout(function(){
      self.getlights();
    },1000)
  },

  //长按移除  游记
  longPress_good(e){
    console.log(e);
    const note_id = e.currentTarget.dataset.index
    var list_travelnotes = this.data.list_travelnotes
    var good;
    var goodamount = e.currentTarget.dataset.goodamount
    var that = this;
    var collect_travelnotes = this.data.collect_travelnotes

    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        list_travelnotes.forEach(v => {
          // console.log(list_travelnotes)
          if (note_id === v._id) {
            wx.showModal({
              title: '提示',
              content: '是否确定移除收藏',
              success(t) {
                if (t.confirm) {
                  console.log('用户点击确定',v.good.length);
                  var i=0;
                  for (; i < v.good.length; i++) {
                    console.log("11111111111111")
                    if (v.good[i] === res.userInfo.nickName) {
                      console.log("取消收藏")
                      console.log(v.good)
                      v.good.splice(i, 1);
                      console.log(v.good)
                      v.goodamount = v.goodamount - 1
                      good = v.good
                      console.log(good)
                      goodamount = v.goodamount
                      collect_travelnotes = collect_travelnotes-1
                      break;
                    }
                  }
                  that.setData({
                    list_travelnotes: list_travelnotes,
                    collect_travelnotes:collect_travelnotes,
                     tabs: [
                      {
                        id: 0,
                        value: "景点",
                        isActive: false
                      },
                      {
                        id: 1,
                        value: "攻略*" + that.data.collect_strategy,
                        isActive: false
                      },
                      {
                        id: 2,
                        value: "游记*" + collect_travelnotes,
                        isActive: true
                      }
                    ],
                  })
                  console.log(that.data.list_travelnotes)

                  DB.doc(note_id).update({
                    data: {
                      good: good,
                      goodamount: goodamount,
                    },
                    success(res) {
                      wx.showToast({
                        title: '移除成功',
                      })
                    },
                       fail: function (ms) {
                      wx.showToast({
                        title: '移除失败',
                        icon: "none"
                      })
                    },
                  })
                } else if (t.cancel) {
                  console.log('用户点击取消')
               }
              }
            })
      }
    })
   }
  })
 },

  //长按移除  攻略
  longPress_good_str(e) {
    console.log(e);
    const strategy_id = e.currentTarget.dataset.index
    var list_strategy = this.data.list_strategy
    var good;
    var goodamount = e.currentTarget.dataset.goodamount
    var that = this;
    var collect_strategy = this.data.collect_strategy

    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        list_strategy.forEach(v => {
          // console.log(list_strategy)
          if (strategy_id === v._id) {
            wx.showModal({
              title: '提示',
              content: '是否确定移除收藏',
              success(t) {
                if (t.confirm) {
                  console.log('用户点击确定', v.good.length);
                  var i = 0;
                  for (; i < v.good.length; i++) {
                    // console.log("11111111111111")
                    if (v.good[i] === res.userInfo.nickName) {
                      console.log("取消收藏")
                      console.log(v.good)
                      v.good.splice(i, 1);
                      console.log(v.good)
                      v.goodamount = v.goodamount - 1
                      good = v.good
                      console.log(good)
                      goodamount = v.goodamount
                      collect_strategy = collect_strategy-1
                      break;
                    }
                  }
                  that.setData({
                    list_strategy: list_strategy,
                    collect_strategy: collect_strategy,
                    tabs: [
                      {
                        id: 0,
                        value: "景点",
                        isActive: false
                      },
                      {
                        id: 1,
                        value: "攻略*" + collect_strategy,
                        isActive: true
                      },
                      {
                        id: 2,
                        value: "游记*" + that.data.collect_travelnotes,
                        isActive: false
                      }
                    ],
                  
                  })
                  console.log(that.data.list_travelnotes)

                  DB1.doc(strategy_id).update({
                    data: {
                      good: good,
                      goodamount: goodamount,
                    },
                    success(res) {
                      wx.showToast({
                        title: '移除成功',
                      })
                    },
                    fail: function (ms) {
                      wx.showToast({
                        title: '移除失败',
                        icon: "none"
                      })
                    },
                  })
                } else if (t.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      }
    })
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
    userInfo:self.data.userinfo,
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


})

