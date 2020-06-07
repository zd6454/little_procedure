// pages/Introduction/index.js
const DB = wx.cloud.database().collection("travelnotes");
const DB1 = wx.cloud.database().collection("stategies");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "攻略",
        isActive: true
      },
      {
        id: 1,
        value: "游记",
        isActive: false
      }
    ],

    system_strategy: [
      {
        id: 0,
        image: "../../images/lou.jpg",
        name: "武汉景点一日游",

      },
      {
        id: 0,
        image: "../../images/yinghua.jpg",
        name: "浪漫樱花两日游"
      },
      {
        id: 0,
        image: "../../images/wan.jpg",
        name: "吃喝玩乐周末游",
      }
    ],
    list_travelnotes:[],
    user:"",//用户名
    list_strategy:[],
    tabs_small:[],
  },

  //搜索框文本内容显示
  inputBind: function (event) {
    this.setData({
      value: event.detail.value
    })
    console.log(this.data.value)
  },

  // 确定键或者是点击搜素图标执行
  search: function () {
    if (!this.data.value) {
      wx.showToast({
        title: '未找到该搜索内容',
        icon: 'none'
      })
    } else {
      // this.getSearch();
    }
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
  init(){
    //游记
    DB.get({
      success: res => {
        // console.log("查询成功", res.data);
        this.setData({
          list_travelnotes: res.data,
        })
        console.log("查询成功", res.data.length);
        // wx.setStorageSync("list_travelnotes", this.data.list_travelnotes);
      },
      file(res) {
        console.log("查询失败", res);
      }
    })

    //攻略
    DB1.get({
      success: res => {
        // console.log("查询成功", res.data);
        this.setData({
          list_strategy: res.data,
        })
        res.data.forEach(v=>{
          v.travel_type.forEach(u=>{
            if(u.state===2){
              this.setData({
                tabs_small: this.data.tabs_small.concat(u.name),
              })
            }
          })
        })
        console.log("9", this.data.tabs_small);

      },
      file(res) {
        console.log("查询失败", res);
      }
    })
   
    //获取用户信息
    const that=this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          user:res.userInfo.nickName,//获取到用户的名字
        })
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
  },

  setTravelnotes(list_travelnotes) {
    this.setData({
      list_travelnotes,
    })
  },
//喜欢  游记
  changehandleIlike(e){
    console.log(e);
    // const list_travelnotes = wx.getStorageSync("list_travelnotes");
    const list_travelnotes = this.data.list_travelnotes;

    let id = e.detail.currentTarget.dataset.id;
    let likeamount = e.detail.currentTarget.dataset.likeamount;//本条id的点赞数

    var like;
    // const that=this;
    list_travelnotes.forEach(v => {;
      if (v._id === id) {//找到相关id的记录
        if (v.like.length === 0){ //目前没有人点过赞
        // 没有人点过赞 那么点击时则需要将点击的用户名添加到like数组中  证明此人点赞了
        console.log("没有人")
          v.like=v.like.concat(this.data.user)
          console.log(v.like)
          v.likeamount=v.likeamount+1
          like=v.like
          console.log(like)
          likeamount=likeamount+1
        }else {//有人点过赞 就需要遍历like数组
          var length=v.like.length
          var i=0;
          for(;i<length;i++){
            if(v.like[i]===this.data.user){
              console.log("取消点赞")
              console.log(v.like)
              v.like.splice(i,1);
              console.log(v.like)
              v.likeamount = v.likeamount - 1
              like = v.like
              console.log(like)
              likeamount = v.likeamount
              break;
            }
          }
          console.log(i)
          if(i>=length){//说明不在like队列  即没有点过赞  将其添加到like
          console.log("点赞")
            v.like.push(this.data.user)
            v.likeamount = v.likeamount + 1
            like = v.like
            likeamount = v.likeamount
          }
        }
      }
    })
   
    this.setData({
      list_travelnotes: list_travelnotes
    })
    console.log(this.data.list_travelnotes)
    wx.setStorageSync("list_travelnotes", this.data.list_travelnotes);

    DB.doc(id).update({
      data: {
        like: like,
        likeamount:likeamount,
      },
      success(res) {
        console.log(res);
      }
    })
  },

  //喜欢  攻略
  changehandleIlike1(e) {
    console.log(e);
    // const list_travelnotes = wx.getStorageSync("list_travelnotes");
    const list_strategy = this.data.list_strategy;

    let id = e.detail.currentTarget.dataset.id;
    let likeamount = e.detail.currentTarget.dataset.likeamount;//本条id的点赞数

    var like;
    // const that=this;
    list_strategy.forEach(v => {
      ;
      if (v._id === id) {//找到相关id的记录
        if (v.like.length === 0) { //目前没有人点过赞
          // 没有人点过赞 那么点击时则需要将点击的用户名添加到like数组中  证明此人点赞了
          console.log("没有人")
          v.like = v.like.concat(this.data.user)
          console.log(v.like)
          v.likeamount = v.likeamount + 1
          like = v.like
          console.log(like)
          likeamount = likeamount + 1
        } else {//有人点过赞 就需要遍历like数组
          var length = v.like.length
          var i = 0;
          for (; i < length; i++) {
            if (v.like[i] === this.data.user) {
              console.log("取消点赞")
              console.log(v.like)
              v.like.splice(i, 1);
              console.log(v.like)
              v.likeamount = v.likeamount - 1
              like = v.like
              console.log(like)
              likeamount = v.likeamount
              break;
            }
          }
          console.log(i)
          if (i >= length) {//说明不在like队列  即没有点过赞  将其添加到like
            console.log("点赞")
            v.like.push(this.data.user)
            v.likeamount = v.likeamount + 1
            like = v.like
            likeamount = v.likeamount
          }
        }
      }
    })

    this.setData({
      list_strategy: list_strategy
    })
    console.log(this.data.list_strategy)
    wx.setStorageSync("list_strategy", this.data.list_strategy);

    DB1.doc(id).update({
      data: {
        like: like,
        likeamount: likeamount,
      },
      success(res) {
        console.log(res);
      }
    })
  },

  //收藏  游记
  changehandlegood(e) {
    console.log(e);
    // const list_travelnotes = wx.getStorageSync("list_travelnotes");
    const list_travelnotes = this.data.list_travelnotes;

    let id = e.detail.currentTarget.dataset.id;
    let goodamount = e.detail.currentTarget.dataset.goodamount;//本条id的点赞数

    var good;
    // const that=this;
    list_travelnotes.forEach(v => {
      ;
      if (v._id === id) {//找到相关id的记录
        if (v.good.length === 0) { //目前没有人点过赞
          console.log("没有人")
          v.good = v.good.concat(this.data.user)
          console.log(v.good)
          v.goodamount = v.goodamount + 1
          good = v.good
          console.log(good)
          goodamount = goodamount + 1
        } else {//有人点过赞 就需要遍历good数组
          var length = v.good.length
          var i = 0;
          for (; i < length; i++) {
            if (v.good[i] === this.data.user) {
              console.log("取消点赞")
              console.log(v.good)
              v.good.splice(i, 1);
              console.log(v.good)
              v.goodamount = v.goodamount - 1
              good = v.good
              console.log(good)
              goodamount = v.goodamount
              break;
            }
          }
          console.log(i)
          if (i >= length) {//说明不在good队列  即没有点过赞  将其添加到good
            console.log("点赞")
            v.good.push(this.data.user)
            v.goodamount = v.goodamount + 1
            good = v.good
            goodamount = v.goodamount
          }
        }
      }
    })

    this.setData({
      list_travelnotes: list_travelnotes
    })
    console.log(this.data.list_travelnotes)
    wx.setStorageSync("list_travelnotes", this.data.list_travelnotes);

    DB.doc(id).update({
      data: {
        good: good,
        goodamount: goodamount,
      },
      success(res) {
        console.log(res);
      }
    })
  }
})