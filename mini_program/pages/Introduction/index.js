// pages/Introduction/index.js
const DB = wx.cloud.database().collection("travelnotes");

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
    list: [
      {
        index: 0,
        user_image: "../../images/bowuguan.jpg",
        user: "1111",
        user_text: "gbhnhuhn vdregvdsfdsfcsdbuununuinjknjkn",
        num: 211,
        image: "../../images/wuda.jpg",
      },
      {
        index: 1,
        user_image: "../../images/wuda.jpg",
        user: "1111",
        user_text: "超速二次南湖搜出",
        num: 2,
        image: "../../images/wuda.jpg",

      },
      {
        index: 2,
        user_image: "../../images/bowuguan.jpg",
        user: "1111",
        user_text: "gbcs督促色IC或碾碎凑南湖U护禾谷渔粉挺有缘分",
        num: 2,
        image: "../../images/wuda.jpg",

      },
      {
        index: 3,
        user_image: "../../images/huangheluo.jpg",
        user: "1111",
        user_text: "gbhnhuhnvfdxczdrsvfdfvgedgrtrf5",
        num: 21,
        image: "../../images/wuda.jpg",

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
    likebool:-1,
    // like:[],
    goodbool:-1,
    user:"",//用户名
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

  // 标题点击事件  从子组件传递过来
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
    // const list_travelnotes=this.data.list_travelnotes;
    // //点赞初始化
    // list_travelnotes.forEach(v=>{
        
    // })
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
//喜欢
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

  //收藏
  changehandlegood(e) {
    console.log(e);
    const list_travelnotes = wx.getStorageSync("list_travelnotes");

    let id = e.detail.currentTarget.dataset.id;
    let good = e.detail.currentTarget.dataset.goodamount;
    this.setData({
      goodbool: -this.data.goodbool,
    })
    // console.log(this.data.likebool);
    console.log(good);
    good = good + this.data.goodbool;
    // console.log(good);
    list_travelnotes.forEach(v => {
      if (v._id === id) {
        v.goodamount = good
        v.good = v.good == "../../img/good.png" ? "../../images/goods.png" : "../../img/good.png"

      }
    })

    this.setData({
      list_travelnotes: list_travelnotes,
      // goodbool:-1
    })
    wx.setStorageSync("list_travelnotes", this.data.list_travelnotes);

    DB.doc(id).update({
      data: {
        goodamount: good,
      },
      success(res) {
        console.log(res);
      }
    })
  }
})