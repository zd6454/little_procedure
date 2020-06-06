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
   travel_date:1,//日期
   travle_leastfee:" ",//最小费用
   travle_mosttfee:"",//最大费用
   travel_type:[{"name":"美食","state":0},{"name":"建筑","state":0},
   {"name":"动物园","state":0},{"name":"美术馆","state":0},{"name":"博物馆","state":0},
   {"name":"名胜古迹","state":0},{"name":"自然风光","state":0},{"name":"地域特色","state":0},
   {"name":"特色商圈","state":0},{"name":"主题公园","state":0},{"name":"赤色之旅","state":0},
   {"name":"现代气息","state":0}],
   selectvehicles:[{"name":"步行","state":0},{"name":"公交","state":0},{"name":'驾车',"state":0},{"name":'骑行',"state":0},{"name":'地铁',"state":0},{"name":'火车',"state":0}],
   typeselectids:[],//类型
   typeid:0,
   //景点部分
    index:0,
    all:[],
    spot:"",//缓存景点
    vehicle:[],//缓存交通工具
    playcontent:"",//缓存游玩描述
   spots:[],//景点数组
   spotloa:[],//坐标集
   vehicles:[],//交通工具数组
   playcontents:[],//游玩描述
   playimages:[],
   playimagescloud:[],//
   playimage:"",
   location:"",//用户所在地
   mapimagesrc:"",//地图
   changeitem:"",
   userinfo:{},
   time:"",
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
//-日期设置
  subdate:function(){
    let self=this;
    self.setData({
      travel_date:self.data.travel_date==0?0:self.data.travel_date-1,
    })
  },
  //+日期设置
  adddate:function(){
    let self=this;
    self.setData({
      travel_date:self.data.travel_date+1,
    })
  },
  //最小费用设置
  leastprice:function(e){
    let self=this;
    console.log(e);
    self.setData({
      travle_leastfee:e.detail.value,
    })
  },
 //最大费用设置
 mostprice:function(e){
  let self=this;
  console.log(e);
  self.setData({
    travle_mostfee:e.detail.value,
  })
 },

  //添加旅游类型
  additem:function(e){
  let self=this;
  var index=e.target.dataset.index;
  var obj=self.data.travel_type[index].name;
   var sek=self.data.travel_type[index].state;
   self.data.travel_type[index].state=sek==0?2:0;
  var state=self.data.travel_type;
      self.setData({
        travel_type:state,
     })
  },
  //获取景点
  spotset:function(e){
    let self=this;
    var obj=e.detail.value;
    self.setData({
      spot:obj,
    })
  },
  //检查是否已经有了
  deletevehicle:function(index){
    let self=this;
    var arr=self.data.vehicle;
    var ppl=self.data.selectvehicles;
    arr.forEach(function(item,index2){
       if(item.name==ppl[index].name){
          self.data.vehicle.splice(index2,1);
       }
    })
     var vehicle= self.data.vehicle;
     self.setData({
       vehicle:vehicle,
     })
  },
  //获取交通
  vehicleset:function(e){
    let self=this;
    var index=e.currentTarget.dataset.index;
    var sek=this.data.selectvehicles[index].state;
    this.data.selectvehicles[index].state=sek==0?2:0;
    var state=this.data.selectvehicles;
      if(sek==0){
        self.data.vehicle.push( self.data.selectvehicles[index])
      }else{
        this.deletevehicle(index);
      }
        self.setData({
          selectvehicles:state,
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
  var imageurl=this.data.playimage;
  const idx = e.target.dataset.idx
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
  checkmap2:function(e){
    var imageurl=this.data.mapimagesrc;
    const idx = e.target.dataset.idx
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
            playimage:oneimage,
          })
        }
      })
    },
    //删除照片
    deleteimage:function(e){
     var self=this;
     self.setData({
       playimage:"",
     })
    },
    //合并数组
    intoone:function(){
     let self=this;
     var all=[];
     self.data.spots.forEach(function(item,index){
        var one=[];
        var t1=new Object();
        t1.spot=item;
        var t2=[];
        self.data.vehicles[index].forEach(function(item1,index1){
             t2.push(item1.name);
        })
        one.push(t2);
        t1.content=self.data.playcontents[index];
        one.push(t1)
        all.push(one);
     })
     self.setData({
       all:all,
     })
    },
    //上传图片
    upload(){
      let self=this;
      wx.showToast({
        icon: 'loading',
        title:"处理中",
      });
      this.intoone();
      if(Array.isArray(self.data.playimages)){
        this.comfirm();
        return ;
      }else{
         const promiseArr=[];
      for(let i=0;i<self.data.playimages.length;i++){
        let filePath=self.data.playimages[i];
        let suffix=/\.[^\.]+$/.exec(filePath)[0];
        console.log(filePath,1);
        promiseArr.push(new Promise((resolve,reject)=>{
          wx.cloud.uploadFile({
            cloudPath: 'strategies_images/' + new Date().getTime() + suffix,
            filePath:filePath,
            success:res=>{
              console.log('上传成功', res.fileID);
              self.setData({
                playimagescloud:self.data. playimagescloud.concat(res.fileID),
              })
              resolve();
            },
            fail:err=>{
              wx.showToast({
                title: '上传失败',
              })
              console.log("shi",err)
            }
          })
        }))
      }
      Promise.all(promiseArr).then(res=>{
       self.comfirm();
      })
      }  
    },
  //检测上一个
  changevehicle:function(){
    let self=this;
    let showarr=self.data.selectvehicles;
    let currentarr=self.data.vehicle;
    showarr.forEach(function(item1,index){
        currentarr.forEach(function(item2){
         if(item1.name==item2.name){
           self.data.selectvehicles[index].state=2;
         }
        })
    })
     let data= self.data.selectvehicles;
     self.setData({
       selectvehicles:data,
     })
  },
  //上一站
  lastplay:function(){
    let self=this;
    let index= self.data.index;
    index=index-1;
    var chose=[{"name":"步行","state":0},{"name":"公交","state":0},
                {"name":'驾车',"state":0},{"name":'骑行',"state":0},
                {"name":'地铁',"state":0},{"name":'火车',"state":0}];
    if(index<0){
      wx.showModal({
        title:"已到达第一站"
      })
    }else{
      let vehicle=self.data.vehicles[index];
     self.setData({
       spot:self.data.spots[index],
       vehicle:self.data.vehicles[index],
       playcontent:self.data.playcontents[index],
       index:index,
       selectvehicles:chose,
       playimage:self.data.playimages[index],
     })
    this.changevehicle();
    }
  },
  //下一站
  nextplay:function(){
     let self=this;
     let spot=self.data.spot;
     let vehicle=self.data.vehicle;
     let playcontent=self.data.playcontent;
     let index =self.data.index;
     let chose=[{"name":"步行","state":0},{"name":"公交","state":0},
                {"name":'驾车',"state":0},{"name":'骑行',"state":0},
                {"name":'地铁',"state":0},{"name":'火车',"state":0}];
     self.changetoloa(spot);
     if(typeof spot == "undefined" || spot == null ||spot == ""||
     typeof vehicle == "undefined" || vehicle == null ||vehicle == []||
     typeof playcontent == "undefined" ||playcontent == null ||playcontent == ""
     ){
      wx.showModal({
        title:"有数据未填写",
        success:function(){
         self.setData({
         selectvehicles:chose,
         })
        },
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
  let image=self.data.playimage;
  self.changetoloa(spot);
  self.data.spotloa.splice(index,1,self.data.changeitem);
  self.data.spots.splice(index,1,spot);
  self.data.vehicles.splice(index,1,vehicle);
  self.data.playcontents.splice(index,1,playcontent);
  self.data.playimages.splice(index,1,image)
  var spots=self.data.spots;
  var vehicles=self.data.vehicles;
  var playcontents=self.data.playcontents;
  var spotloa=self.data.spotloa;
  var playimages=self.data.playimages;
  var play= playcontents[index+1];
  var vs= vehicles[index+1];
  var sp = spots[index+1];
  var ig= playimages[index+1]
  var chose=[{"name":"步行","state":0},{"name":"公交","state":0},
              {"name":'驾车',"state":0},{"name":'骑行',"state":0},
              {"name":'地铁',"state":0},{"name":'火车',"state":0}];
  self.setData({
    spots:spots,
    spotloa:spotloa,
    vehicles:vehicles, 
    playcontents:playcontents,
    playimages:playimages,
    spot:typeof sp=='undefined'?'':sp,
    vehicle:typeof vs=='undefined'?[]:vs,
    playcontent:typeof play=='undefined'?'':play,
    playimage:typeof ig=='undefined'?'':ig,
    selectvehicles:chose,
    index:index+1,
  })
  this.changevehicle();
  },

  //删除最新添加进数组的东西
  deletearray:function(){
    let self=this;
    var index=self.data.index;
    self.data.spotloa.pop();
    self.data.spots.pop();
    self.data.vehicles.pop();
    self.data.playcontents.pop();
    self.data.playimages.pop();
    var spots=self.data.spots;
    var vehicles=self.data.vehicles;
    var playcontents=self.data.playcontents;
    var spotloa=self.data.spotloa;
    var images=self.data.playimages;
    self.setData({
      spots:spots,
      spotloa:spotloa,
      vehicles:vehicles, 
      playcontents:playcontents,
      playimages:images,
      index:index-1,
      spot:"",
      vehicle:[],
      playcontent:"",
      playimage:"",
    })
  },
  //添加进数组
  addarray:function(){
  let self=this;
  let spot=self.data.spot;
  let vehicle=self.data.vehicle;
  let playcontent=self.data.playcontent;
  var index=self.data.index;
  var image=self.data.playimage;
  self.data.spotloa.push(self.data.changeitem);
  self.data.spots.push(spot);
  self.data.vehicles.push(vehicle);
  self.data.playcontents.push(playcontent);
  self.data.playimages.push(image);
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
    vehicle:[],
    playcontent:"",
    playimage:"",
    selectvehicles:[{"name":"步行","state":0},{"name":"公交","state":0},
                    {"name":'驾车',"state":0},{"name":'骑行',"state":0},
                    {"name":'地铁',"state":0},{"name":'火车',"state":0}],
  })
  setTimeout(function(){
    self.getmapimage();
  },1000);
  },
  //获取地图
 getmapimage:function(){
   let self=this;
   let lot="";
   wx.getSystemInfo({
     complete: (res) => {
       var height=res.windowHeight;
       var width=res.windowWidth;
       var size= 1.2*width+"*"+height;
        lot=self.setmarks();
       myAmap.getStaticmap({
         location:'114.304695,30.593309',
         zoom:10,
         size:size,
         scale:2,
         markers: lot,
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
//  //
//  getstaticmap:function(){
//    var base='https://apis.map.qq.com/ws/staticmap/v2/?';
//    var size='375*603';
//    var key='QO5BZ-VD6R4-M4AUD-D36UT-VGBVS-6HBZV';
//   wx.request({
//     url: 'url',
//   })
//  },
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
      self.deletearray();
        console.error(err);
        wx.showModal({
          title:'景点填写有误，请重新填写',
        })
    }
  })
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
          like:[],
          good:[],
          all:self.data.all,//景点，交通，描述
          travel_date:self.data.travel_date,//时间
          travle_leastfee:self.data.travle_leastfee,//费用
          travle_mostfee:self.data.travle_mostfee,//费用
          travel_type:self.data.travel_type,//所有类型
          spots:self.data.spots,//景点集合
          spotloa:self.data.spotloa,//景点经纬度
          vehicles:self.data.vehicles,//交通集合
          playcontents:self.data.playcontents,//游玩描述集合
          playimagescloud:self.data. playimagescloud,
          imageurl:self.data.mapimagesrc,//地图
          selectvehicles:self.data.selectvehicles,//交通选择
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