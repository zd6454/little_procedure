// pages/spot_detail/index.js
const db=wx.cloud.database();
const _=db.command;

var QQMapWX = require('../../util/qqmap-wx-jssdk.js')//腾讯地图 api下载
var qqmapsdk;

var scrollTopH; //获取顶部高度，用于设置浮动顶部的菜单（不同尺寸手机，高度不同）
var touchLRnum = 100; //列表区域左右滑动的距离（切换菜单的值）

Page({

  /**
   * 页面的初始数据
   */
  data: {
    SpotObj:{},//spot数据
    SpotId:null,
    SwiperList: [],//轮播图图片
    SpotName:"",
    SpotFamous:"",
    SpotIntroText:"",
    SpotLat:"30",
    SpotLng:"110",

    scrollLeft: 0, //tab标题的滚动条位置
    menuList:['游览推荐','热门攻略','酒店民宿'],
    menuIndex:0,//当前选择菜单key(对应menuList[key]菜单内容)
    ifShowTopMenu:false,

    hotels:[],

    isFold:true,
  },

  todetail:function(e){
    let self=this;
    console.log(e);
    var index= e.currentTarget.dataset.index;
   wx.navigateTo({
     url: '../../pages/show/show',
     events:{

     },
     success:function(res){
       res.eventChannel.emit('accept',{data:self.data.hotels[index]})
     },
     fail:function(err){

     }
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const spot_id=options.id;
    console.log(spot_id);
    this.getSpotDetail(spot_id);
    this.setData({
      SpotId: spot_id,
    })

    var that = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'SCKBZ-7LM33-MZT3A-3RB7V-CJRU7-6FF44'
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
    //获取顶部高度，用于设置浮动顶部的菜单（不同尺寸手机，高度不同）
    //延迟执行是为了防止导航栏以上有些元素未加载成功会影响高度计算（最好是在导航栏以上元素请求加载成功后处执行以下代码）
    setTimeout(function () {
      let query = wx.createSelectorQuery();
      query.select('#top').boundingClientRect()
      query.exec(function (res) {
        scrollTopH = res[0].height;
      })
    }, 1500);

    var _this = this;
    // 调用接口
    qqmapsdk.search({
      keyword: '酒店',  //搜索关键词
      location: {
        latitude: this.data.SpotLat,
        longitude: this.data.SpotLng,
      },      //设置周边搜索中心点
      page_size: 30,
      success: function (res) { //搜索成功后的回调
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: res.data[i].id,
            tel:res.data[i].tel,
            address: res.data[i].address,
            category: res.data[i].category,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            width: 20,
            height: 20,
          })
        }
        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          hotels: mks
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  

//获取景点详情数据
getSpotDetail(spot_id){
  db.collection("spots").doc(spot_id).get({success:res=>{
    console.log(res.data);
    this.setData({
      SpotObj:res.data,
      SwiperList:res.data.spot_image,
      SpotName: res.data.spot_name,
      SpotFamous: res.data.spot_famous,
      SpotIntroText: res.data.spot_intro_text,
      SpotLat: res.data.spot_latitude,
      SpotLng: res.data.spot_longitude,
    });
    console.log(this.data.SpotLat);
    console.log(this.data.SpotLng);
    }
    })  
},

  //选择 切换菜单
  changeTitle: function (e) {
    let chooseNav = e.currentTarget.dataset.type;
    let This = this;
    if (chooseNav != This.data.menuIndex) {
      This.setData({
        menuIndex: chooseNav,
      });

      //This.initFun(); //初始化 / 清空 页面数据
      //This.getListData(); //获取页面列表数据
    }
  },


  //设置顶部固定菜单定位
  //  onPageScroll:function(e){ // 获取滚动条当前位置
  //    console.log(e.scrollTop)
  scrollIn: function (e) {
    let This = this;
    if (e.detail.scrollTop >= scrollTopH) {
      if (!This.data.ifShowTopMenu) {
        This.setData({
          ifShowTopMenu: true
        });
      }
    } else {
      if (This.data.ifShowTopMenu) {
        This.setData({
          ifShowTopMenu: false
        });
      }
    }
  },

  showAll: function (e) {
    this.setData({
      isFold: !this.data.isFold,
    })
  },

  enter_intro:function(e){
    let index=e.currentTarget.dataset.index;
    let spot_id = this.data.SpotId;
    wx.navigateTo({
      url: '../spot_detail_intro/index?spot_id=' + spot_id,
    })
  },

  enter_location: function (e) {
    let spot_id = this.data.SpotId;
    console.log(spot_id);
    wx.navigateTo({
      url: '../spot_detail_map/index?spot_id=' + spot_id,
    })
  },
})