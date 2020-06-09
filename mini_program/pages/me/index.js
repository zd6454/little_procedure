var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var qqmapsdk=new QQMapWX({
  key: 'QO5BZ-VD6R4-M4AUD-D36UT-VGBVS-6HBZV' // 必填
});  
const util = require('../../utils/util.js');
const db = wx.cloud.database()
const DB = wx.cloud.database().collection("travelnotes");
const DB1 = wx.cloud.database().collection("stategies");
const DB2 = wx.cloud.database().collection("system_strategy");
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
    cratedAt:"",
    userinfo:{},
    menuList: ['点亮', '发布', '收藏','清单'],
    menuIndex: 0,//当前选择菜单key(对应menuList[key]菜单内容)
    ifShowTopMenu: false,
    ifShowInputbox: false,
    inputVal:"",
    list:[],
    userInfo: [],
    tabs: [
      {
        id: 0,
        value: "平台攻略",
        isActive: true
      },
      {
        id: 1,
        value: "游客攻略",
        isActive: false
      },
      {
        id: 2,
        value: "游记",
        isActive: false
      }
    ],
    list_travelnotes:[],
    list_strategy:[],
    system_strategy:[],
    collect_travelnotes:0,
    collect_strategy:0,
    collect_strategy_sys:0,
    user:[],
    
    dataList: [{
      id: 'money',
      name: '证件&银行卡&现金',
      open: true,
      pages: [{
        id: 0,
        name: '身份证',
        confirm: false,
      }, {
        id: 1,
        name: '车票（机票）',
        confirm: false,
      }, {
        id: 2,
        name: '市民卡（公交卡）',
        confirm: false,
      }, {
        id: 3,
        name: '护照（出国）',
        confirm: false,
      }, {
        id: 4,
        name: '带大于预算150%的现金',
        confirm: false,
      }, {
        id: 5,
        name: '信用卡、借记卡',
        confirm: false,
      }]
    }, {
      id: 'electronic',
      name: '电子产品',
      open: true,
      pages: [{
        id: 0,
        name: '手机、耳机（耳机包）',
        confirm: false,
      }, {
        id: 1,
        name: '相机、存储卡、相机充电器',
        confirm: false,
      }]
    }, {
      id: 'bag',
      name: '行李箱&包',
      open: true,
      pages: [{
        id: 0,
        name: '行李箱',
        confirm: false,
      }, {
        id: 1,
        name: '双肩包',
        confirm: false,
      }, {
        id: 2,
        name: '日常小包',
        confirm: false,
      }]
    }, {
      id: 'washing',
      name: '洗漱用品',
      open: true,
      pages: [{
        id: 0,
        name: '牙刷、牙膏、毛巾、洗发水、护发素、沐浴露',
        confirm: false,
      }, {
        id: 1,
        name: '洗面奶、爽肤水、乳、喷雾、体乳、润唇膏',
        confirm: false,
      }, {
        id: 2,
        name: '防晒霜(夏)、BB霜',
        confirm: false,
      }]
    }, {
      id: 'cloth',
      name: '衣物&杂物',
      open: true,
      pages: [{
        id: 0,
        name: '睡衣、内衣、内裤',
        confirm: false,
      }, {
        id: 1,
        name: '衣服、裤子(按天数)',
        confirm: false,
      }, {
        id: 2,
        name: '袜子、鞋子(穿一双)',
        confirm: false,
      }]
    }, {
      id: 'medicine',
      name: '药品',
      open: true,
      pages: [{
        id: 0,
        name: '创可贴、晕车药、个人常备药',
        confirm: false,
      }, {
        id: 1,
        name: '胃药、止泻药',
        confirm: false,
      }, {
        id: 2,
        name: '零食',
        confirm: false,
      }]
    }] 
  },

  onLoad(){
    this.getopenId()
    let self=this;
    // this.getuseropenid();
    setTimeout(function(){
      self.getlights();
    },2000)
    this.init();
    this.init1();
  },

  onShow(){
    const userinfo=wx.getStorageSync("userinfo");
    this.setData({userinfo});

    const db = wx.cloud.database()
    // 根据openid查询用户
    db.collection('users').where({
      _openid: this.data.userinfo.openid
    }).get({
      success: res => {
        console.log(res.data);    
        console.log('[数据库] [查询记录] 成功: ', res)
        if(res.data.length==0){
            db.collection('users').add({
              data: {
                nickname: this.data.userinfo.nickName,
                gender: this.data.userinfo.gender,
                language: this.data.userinfo.language,
                city: this.data.userinfo.city,
                province: this.data.userinfo.province,
                country: this.data.userinfo.country,
                avatarUrl: this.data.userinfo.avatarUrl,
                list:this.data.dataList,
              },
              success: res => {
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                this.setData({
                  'userinfo.userId': res._id,
                })
              },
              fail: err => {
                console.error('[数据库] [新增记录] 失败：', err)
              }
            })
          }
        },
        fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
        },
        })
  },

  onReady(){
    const db = wx.cloud.database()
    db.collection('users').where({
      _openid: this.data.userinfo.openid
    }).get({
      success: res => {
        console.log(res.data[0].list);
        console.log('[数据库2] [查询记录] 成功: ', res)
        this.setData({
          list: res.data[0].list
        })
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      },
    })
  },

  onHide(){
    const db = wx.cloud.database()
    db.collection('users').where({
      _openid: this.data.userinfo.openid
    }).updata({
      data:{
        list:db.command.set(this.data.list)
      },
      success(res){
        console.log(res.data);
      }
    })
  },

// 定义调用云函数获取openid
getopenId(){
  let page = this;
  wx.cloud.callFunction({
    name:'getopenId',
    complete:res=>{
      console.log('openid--',res.result.openid)
      var openid = res.result.openid
      page.setData({
        'userinfo.openid':openid,
         openid:openid
      })
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
    }
  },

  //登录
  handleGetUserInfo(e) {
    console.log(e);
    const { userInfo } = e.detail;
    lang: "zh_CN",
    wx.setStorageSync("userinfo", userInfo);
    wx.navigateTo({
      url: '../me/index'
    })
  },
  
 //确认已准备
  confirmPrep(e){
    const id=e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        console.log(list[i].pages[index]);
        list[i].pages[index].confirm =!list[i].pages[index].confirm
      }
    }
    this.setData({
      list
    })
  },
  
  /**
   * 收缩核心代码
   */
  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        list[i].open = !list[i].open
      } 
    }

    /**
     * key和value名称一样时，可以省略
     *
     * list:list=>list
     */
    this.setData({
      list
    })
  },

  changeInputVal(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  //添加便签
  addMsg(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        let j = list[i].pages.length;
        list[i].pages.push({
          id:j,
          name: this.data.inputVal,
          confirm:false
        })
      } 
    }
  this.setData({
    list,
    inputVal:"",
  })
},

  addser: function (e) {
    const db = wx.cloud.database()
    db.collection('users').add({
      data: {
        nickname: e.nickName,
        gender:e.gender,
        language:e.language,
        city:e.city,
        country:e.country,
        avatarUrl:e.avatarUrl,
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  //点亮功能
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

  //收藏
  // 标题点击事件  从子组件传递过来  标签
  handleTabsItemChange(e) {
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
    var collect_strategy_sys=0;
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
              value: "平台攻略*"+this.data.collect_strategy_sys,
              isActive: true
            },
            {
              id: 1,
              value: "游客攻略*"+this.data.collect_strategy,
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

    //游客攻略
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
            value: "平台攻略*"+this.data.collect_strategy_sys,
            isActive: true
          },
          {
            id: 1,
            value: "游客攻略*" + collect_strategy,
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

      //平台攻略
      DB2.get({
        success: res => {
          res.data.forEach(v => {
            console.log(v.good.length);
            if (v.good.length != 0) {
              v.good.forEach(u => {
                if (u === this.data.user.nickName) {
                  collect_strategy_sys = collect_strategy_sys + 1;
                }
              })
            }
          })
          // console.log("查询成功", res.data);
          this.setData({
            system_strategy: res.data,
            collect_strategy_sys: collect_strategy_sys,
            tabs: [
            {
              id: 0,
              value: "平台攻略*"+collect_strategy_sys,
              isActive: true
            },
            {
              id: 1,
              value: "游客攻略*" + this.data.collect_strategy,
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
    this.init1();
  },
  //下拉刷新
  onPullDownRefresh() {
    this.init();
    this.init1();
    wx.stopPullDownRefresh();
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
                        value: "平台攻略*"+that.data.collect_strategy_sys,
                        isActive: false
                      },
                      {
                        id: 1,
                        value: "游客攻略*" + that.data.collect_strategy,
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

  //长按移除  游客攻略
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
                        value: "平台攻略*"+that.data.collect_strategy_sys,
                        isActive: false
                      },
                      {
                        id: 1,
                        value: "游客攻略*" + collect_strategy,
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

  
  //长按移除  游客攻略
  longPress_good_sys(e) {
    console.log(e);
    const system_id = e.currentTarget.dataset.index
    var system_strategy = this.data.system_strategy
    var good;
    var goodamount = e.currentTarget.dataset.goodamount
    var that = this;
    var collect_strategy_sys = this.data.collect_strategy_sys

    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        system_strategy.forEach(v => {
          // console.log(list_strategy)
          if (system_id === v._id) {
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
                      v.good.splice(i, 1);
                      console.log(v.good)
                      v.goodamount = v.goodamount - 1
                      good = v.good
                      console.log(good)
                      goodamount = v.goodamount
                      collect_strategy_sys = collect_strategy_sys-1
                      break;
                    }
                  }
                  that.setData({
                    system_strategy: system_strategy,
                    collect_strategy_sys: collect_strategy_sys,
                    tabs: [
                      {
                        id: 0,
                        value: "平台攻略*"+collect_strategy_sys,
                        isActive: false
                      },
                      {
                        id: 1,
                        value: "游客攻略*" +that.data.collect_strategy,
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

                  DB2.doc(system_id).update({
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

  // 标题点击事件  从子组件传递过来  标签
  handletabs1ItemChange(e) {
    // console.log(e);
    // 1.获取被点击的标题
    const { index } = e.detail;
    // 2.修改原数组
    let { tabs1 } = this.data;
    tabs1.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3.赋值到data中
    this.setData({
      tabs1
    })
  },

  //初始化
  init1() {
    var release_travelnotes = 0;
    var release_strategy = 0;

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
        console.log("查询成功", res.data);
        res.data.forEach(v => {
          // console.log(v.good.length);
          if (v.userInfo.nickName === this.data.user.nickName) {
                release_travelnotes = release_travelnotes + 1;
                // console.log("4444444444444444")
          }
        })
        this.setData({
          list_travelnotes: res.data,
          release_travelnotes: release_travelnotes,
          tabs1: [
            {
              id: 0,
              value: "游客攻略*"+this.data.release_strategy,
              isActive: true
            },
            {
              id: 1,
              value: "游记*" + release_travelnotes,
              isActive: false
            },
          ],
        })
        console.log("bbbbbbbbbbbbbbbbbb",this.data.release_travelnotes);
      },
      file(res) {
        console.log("查询失败", res);
      }
    })

    //游客攻略
    DB1.get({
      success: res => {
        // console.log("查询成功", res.data);
        res.data.forEach(v => {
          // console.log(v.good.length);
          if (v.userInfo.nickName === this.data.user.nickName) {
            release_strategy = release_strategy + 1;
            // console.log("4444444444444444")
          }
        })
        console.log(this.data.release_travelnotes)
        this.setData({
          list_strategy: res.data,
          release_strategy: release_strategy,
          tabs1: [
            {
              id: 0,
              value: "游客攻略*" + release_strategy,
              isActive: true
            },
            {
              id: 1,
              value: "游记*" + this.data.release_travelnotes,
              isActive: false
            },
          ],
        })
      },
      file(res) {
        console.log("查询失败", res);
      }
    })

   
  },

    //长按删除
    longPress_record(e) {
      console.log(e);
      const note_id = e.currentTarget.dataset.index
      var list_travelnotes = this.data.list_travelnotes
      var release_travelnotes = this.data.release_travelnotes
      var that = this;
  
      wx.getUserInfo({
        success: function (res) {
          console.log(res);
          list_travelnotes.forEach(v => {
            if (res.userInfo.nickName === v.userInfo.nickName) {//发布的人可删除
              wx.showModal({
                title: '提示',
                content: '是否确定删除',
                success(t) {
                  if (t.confirm) {
                    console.log('用户点击确定');
                    //从数据库中删除
                    DB.doc(note_id).remove({
                      success: function (ms) {
                        // var commentamount
                        //从数组中删除
                        list_travelnotes.splice(note_id, 1);
                        release_travelnotes=release_travelnotes-1
                        that.setData({
                          release_travelnotes: release_travelnotes,
                          list_travelnotes: list_travelnotes,
                          tabs1: [
                            {
                              id: 0,
                              value: "游客攻略*" + that.data.release_strategy,
                              isActive: false
                            },
                            {
                              id: 1,
                              value: "游记*" +release_travelnotes,
                              isActive: true
                            },
                           
                          ],
                        })
                        wx.showToast({
                          title: '删除成功',
                        })
                      },
                      fail: function (ms) {
                        wx.showToast({
                          title: '删除失败',
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
    //长按删除  游客攻略
    longPress_record_str(e) {
      console.log(e);
      const strategy_id = e.currentTarget.dataset.index
      var list_strategy = this.data.list_strategy
      var release_strategy = this.data.release_strategy
      var that = this;
  
      wx.getUserInfo({
        success: function (res) {
          console.log(res);
          list_strategy.forEach(v => {
            if (res.userInfo.nickName === v.userInfo.nickName) {//发布的人可删除
              wx.showModal({
                title: '提示',
                content: '是否确定删除',
                success(t) {
                  if (t.confirm) {
                    console.log('用户点击确定');
                    //从数据库中删除
                    DB1.doc(strategy_id).remove({
                      success: function (ms) {
                        release_strategy = release_strategy-1
                        // var commentamount
                        //从数组中删除
                        list_strategy.splice(strategy_id, 1);
                        that.setData({
                          release_strategy: release_strategy,
                          list_strategy: list_strategy,
                          tabs1: [
                            {
                              id: 0,
                              value: "游客攻略*" + release_strategy,
                              isActive: true
                            },
                            {
                              id: 1,
                              value: "游记*" + that.data.release_travelnotes,
                              isActive: false
                            }
                          ],
                        })
                        wx.showToast({
                          title: '删除成功',
                        })
                      },
                      fail: function (ms) {
                        wx.showToast({
                          title: '删除失败',
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
})