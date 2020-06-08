Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    menuList: ['点亮', '发布', '收藏','清单'],
    menuIndex: 0,//当前选择菜单key(对应menuList[key]菜单内容)
    ifShowTopMenu: false,
    ifShowInputbox: false,
    inputVal:"",
    list:[],
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
        'userinfo.openid':openid
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
})