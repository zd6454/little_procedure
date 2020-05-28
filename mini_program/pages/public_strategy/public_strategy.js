// pages/public_strategy/public_strategy.js
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var amapFile = require('../../lib/amap-wx.js');
var qqmapsdk=new QQMapWX({key: 'QO5BZ-VD6R4-M4AUD-D36UT-VGBVS-6HBZV' });  
var myAmap=new amapFile.AMapWX({key:"d761d2b7544fb04ddf783a0196fab4d3"});
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //标签部分
   travel_date:"",//日期
   travle_fees:" ",//费用
   travel_type:["美食","建筑","动物园","美术馆","博物馆","名胜古迹","自然风光","地域特色","特色商圈"],
   typeselectids:[],//类型
   //景点部分
    index:0,
    spot:"",//缓存景点
    vehicle:"",//缓存交通工具
    playcontent:"",//缓存游玩描述
   spots:[],//景点数组
   spotloa:[],//坐标集
   vehicles:[],//交通工具数组
   playcontents:[],//游玩描述
   location:"",//用户所在地
   mapimagesrc:"",//地图
   changeitem:"",
   userinfo:{},
   time:"",
  },
  //地址转换成坐标
changetoloa:function(e){
  let self=this;
  var local="";
  qqmapsdk.geocoder({
    address:e,
    success:function(res){
        var res=res.result;
        local=res.location.lng+","+res.location.lat;
        self.setData({
          changeitem:local,
        })
        console.log(local);
    },
    fail:function(err){
        console.error(err);
        wx.showModal({
          cancelColor: 'cancelColor',
          title:'景点填写有误，请重新填写',
        })
        self.deletearray();
    }
  })
},
  //获取用户信息
getlocation:function(){
  var self=this;
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
//日期设置
  dateset:function(e){
    let self=this;
    self.setData({
      travel_date:e.detail.value,
    })
  },
  //费用设置
  feeset:function(e){
    let self=this;
    console.log(e);
    self.setData({
      travle_fees:e.detail.value,
    })
  },
  //删除旅游类型
  deleteitem:function(e){
    let self=this;
    var type=self.data.typeselectids;
    wx.showToast({
      title: '删除了',
      content:"是否删除该类型",
      success:function(res){
        type.splice(e.target.dataset.index,1);
        self.setData({
          typeselectids:type,
        });
      },
      fail:function(err){
        console.log(err);
      }
    })
  },
  //添加旅游类型
  additem:function(e){
  let self=this;
  var index=e.target.dataset.index;
  var obj=self.data.travel_type[index];
  if(self.data.typeselectids.indexOf(obj)==-1){
    wx.showToast({
      title: '添加成功',
      success:function(err){
      self.data.typeselectids.push(obj);
      var data=self.data.typeselectids;
      self.setData({
        typeselectids:data,
     })
      },
    fail:function(err){
    console.log(err);
    }
    })
  }
  else{
    wx.showToast({
      title: '已添加',
    })
  }
  },
  //获取景点
  spotset:function(e){
    let self=this;
    var obj=e.detail.value;
    self.setData({
      spot:obj,
    })
  },
  //获取交通
  vehicleset:function(e){
    let self=this;
    var obj=e.detail.value;
    self.setData({
      vehicle:obj,
    })
  },
  //获取游玩描述
  contentset:function(e){
    let self=this;
    var obj=e.detail.value;
    self.setData({
      playcontent:obj,
    })
  }, 
  //放大图片
  checkmap:function(e){
  var imageurl=this.data.mapimagesrc;
  const idx = e.target.dataset.idx
  wx.previewImage({
    urls: [imageurl],
    current:'',
    success:function(res){
      console.log(res)
    },
    fail:function(res){
      console.log(res);
    }
  })
  },
  //上一站
  lastplay:function(){
    let self=this;
    let index= self.data.index;
    index=index-1;
    if(index<0){
      wx.showModal({
        title:"已到达第一站"
      })
    }else{
     self.setData({
       spot:self.data.spots[index],
       vehicle:self.data.vehicles[index],
       playcontent:self.data.playcontents[index],
       index:index,
     })
    }
  },
  //下一站
  nextplay:function(){
     let self=this;
     let spot=self.data.spot;
     let vehicle=self.data.vehicle;
     let playcontent=self.data.playcontent;
     let index =self.data.index;
     self.changetoloa(spot);
     if(typeof spot == "undefined" || spot == null ||spot == ""||
     typeof vehicle == "undefined" || vehicle == null ||vehicle == ""||
     typeof playcontent == "undefined" ||playcontent == null ||playcontent == ""
     ){
      wx.showModal({
        title:"有数据未填写",
      })
     }else{
      wx.showToast({
        title: '填充完成',
        success:function(){
        if(index<=self.data.spots.length-1){
          self.lastnextplay();
        }else{
          setTimeout(function(){
            self.addarray();
          },1000)
        }
        }
      }) 
     }; 
  },
  //上一站的下一站，修改数组
  lastnextplay:function(){
  let self=this;
  let index=self.data.index;
  let spot=self.data.spot;
  let vehicle=self.data.vehicle;
  let playcontent=self.data.playcontent;
  self.changetoloa(spot);
  self.data.spotloa.splice(index,1,self.data.changeitem);
  self.data.spots.splice(index,1,spot);
  self.data.vehicles.splice(index,1,vehicle);
  self.data.playcontents.splice(index,1,playcontent);
  var spots=self.data.spots;
  var vehicles=self.data.vehicles;
  var playcontents=self.data.playcontents;
  var spotloa=self.data.spotloa;
  var play= playcontents[index+1];
  var vs= vehicles[index+1];
  var sp = spots[index+1];
  self.setData({
    spots:spots,
    spotloa:spotloa,
    vehicles:vehicles, 
    playcontents:playcontents,
    spot:typeof sp=='undefined'?'':sp,
    vehicle:typeof vs=='undefined'?'':vs,
    playcontent:typeof play=='undefined'?'':play,
    index:index+1,
  })
  },
  //删除最新添加进数组的东西
  deletearray:function(){
    let self=this;
    let spot=self.data.spot;
    let vehicle=self.data.vehicle;
    let playcontent=self.data.playcontent;
    var index=self.data.index;
    self.data.spotloa.pop();
    self.data.spots.pop();
    self.data.vehicles.pop();
    self.data.playcontents.pop();
    var spots=self.data.spots;
    var vehicles=self.data.vehicles;
    var playcontents=self.data.playcontents;
    var spotloa=self.data.spotloa;
    self.setData({
      spots:spots,
      spotloa:spotloa,
      vehicles:vehicles, 
      playcontents:playcontents,
      index:index-1,
      spot:"",
      vehicle:"",
      playcontent:"",
    })
  },
  //添加进数组
  addarray:function(){
  let self=this;
  let spot=self.data.spot;
  let vehicle=self.data.vehicle;
  let playcontent=self.data.playcontent;
  var index=self.data.index;
  self.data.spotloa.push(self.data.changeitem);
  self.data.spots.push(spot);
  self.data.vehicles.push(vehicle);
  self.data.playcontents.push(playcontent);
  index=index+1;
  var spots=self.data.spots;
  var vehicles=self.data.vehicles;
  var playcontents=self.data.playcontents;
  var spotloa=self.data.spotloa;
  self.setData({
    spots:spots,
    spotloa:spotloa,
    vehicles:vehicles, 
    playcontents:playcontents,
    index:index,
    spot:"",
    vehicle:"",
    playcontent:"",
  })
  setTimeout(function(){
    self.getmapimage();
  },1000);
  },
  //获取地图
 getmapimage:function(){
   let self=this;
   wx.getSystemInfo({
     complete: (res) => {
       var height=res.windowHeight;
       var width=res.windowWidth;
       var size= 1.2*width+"*"+height;
       myAmap.getStaticmap({
         location:'114.304695,30.593309',
         zoom:10,
         size:size,
         scale:2,
         markers: this.setmarks(),
        //  labels:this.setlabel(),
         success:function(e){
          self.setData({
            mapimagesrc:e.url,
          })
         },
         fail:function(info){
          wx.showModal({title:info.errMsg});
         }
       })
     },
   })
 },
 //
 getstaticmap:function(){
   var base='https://apis.map.qq.com/ws/staticmap/v2/?';
   var size='375*603';
   var key='QO5BZ-VD6R4-M4AUD-D36UT-VGBVS-6HBZV';
  wx.request({
    url: 'url',
  })
 },
//转化地点
 setspots:function(){
  let self=this;
  var changespot="10,0x0000ff,1,,:";
  var name=self.data.spots;
  self.data.spotloa.forEach(function(item,index){
    if(index==self.data.spotloa-1){
      changespot=changespot+item;
    }else
    changespot=changespot+item+";";
  })
  console.log(changespot);
 },
 //转化路标
 setmarks:function(){
  let self=this;
  var markers="large,0xEC606B,A:";
  var name=self.data.spots;
  self.data.spotloa.forEach(function(item,index){
    console.log(item,index);
    if(index==self.data.spotloa.length-1){
      markers=markers+item;
    }else{
       markers=markers+item+";";
    }
  })
  console.log(markers);
  return markers;
 },
 //转化label
 setlabel:function(){
  let self=this;
  var labels="";
  var name=self.data.spots;
  self.data.spotloa.forEach(function(item,index){
    if(index==self.data.spotloa-1){
      labels=labels+name[index]+",2,0,16,0xFFFFFF,0x0xEC606B:"+item;
    }
    labels=labels+name[index]+",2,0,16,0xFFFFFF,0x0xEC606B:"+item+";";
  })
  console.log(labels);
  return labels;
 },
   //获取用户信息
   onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
  },
 //确认发布
 comfirm:function(){
  let self =this;
  const db=wx.cloud.database();
  var time = util.formatTime(new Date());
  wx.getSetting({
    success (res) {
      console.log(res.authSetting)
      wx.getUserInfo({
        success:function(e){
        self.setData({
          userinfo:e.userInfo,
          time:time,
        });
        db.collection('stategies').add({
        data:{
          userInfo:self.data.userinfo,
          likeamount:0,//初始点赞数
          goodamount:0,//初始收藏数
          commentamount:0,//初始评论数
          time:time,//
          travel_date:self.data.travel_date,//时间
          travle_fees:self.data.travle_fees,//费用
          travel_type:self.data.travel_type,//所有类型
          typeselectids:self.data.typeselectids,//类型id
          spots:self.data.spots,//景点集合
          spotloa:self.data.spotloa,//景点经纬度
          vehicles:self.data.vehicles,//交通集合
          playcontents:self.data.playcontents,//游玩描述集合
          imageurl:self.data.mapimagesrc,
        },
        success:function(e){
          console.log(e);
          wx.showToast({
            title: '发布游记成功',
          });
        },
        fail:function(e){
        console.log(e);
        wx.showModal({
          title:"发布失败，请检查网络"
        })
        }
        })
        },
        fail:function(err){
          console.log(err);
          wx.showModal({
            title:"需要获取您的信息",
          })
        }
      })
    },
    fail:function(err){
    wx.showModal({
      cancelColor: 'cancelColor',
      title:"要获取您的信息"
    })
    }
  })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlocation();
  },

})