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
    likerecord:"",//记录上一个的id
    goodbool:-1,
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

  
  //返回到页面时刷新
  onShow: function () {
    DB.get({
      success: res => {
        // console.log("查询成功", res.data);
        this.setData({
          list_travelnotes: res.data,
        })
        console.log("查询成功", res.data.length);

        wx.setStorageSync("list_travelnotes", this.data.list_travelnotes);
      },
      file(res) {
        console.log("查询失败", res);
      }
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    DB.get({
      success: res => {
        // console.log("查询成功", res.data);
        this.setData({
          list_travelnotes: res.data,
        })
        console.log("查询成功", res.data.length);

        wx.setStorageSync("list_travelnotes", this.data.list_travelnotes);
      },
      file(res) {
        console.log("查询失败", res);
      }
    })
  },

  setTravelnotes(list_travelnotes) {
    this.setData({
      list_travelnotes,
    })
  },
//喜欢
  changehandleIlike(e){
    console.log(e);
    const list_travelnotes = wx.getStorageSync("list_travelnotes");

    let id = e.detail.currentTarget.dataset.id;
    let like = e.detail.currentTarget.dataset.likeamount;

    wx.getUserInfo({
      success:function(res){
        console.log(res);
        if (!list_travelnotes.like.length){//目前没有人点过赞

        }else{
          list_travelnotes.forEach(v => {
            if (v.userInfo.nickName === res.like.nick && v._id === id) {

            }
          })
        }
        
      }
    })
   
      this.setData({
        likebool: -this.data.likebool,
        likerecord: id,
      })

    // console.log(this.data.likebool);
    console.log(like);
    like = like + this.data.likebool;
    console.log(like);
    list_travelnotes.forEach(v => {
      if (v._id === id) {
        v.likeamount = like
        v.like.src=v.like.src == "../../img/like.png" ? "../../images/likes.png" : "../../img/like.png"
      }
    })
   
    this.setData({
      list_travelnotes: list_travelnotes
    })
    wx.setStorageSync("list_travelnotes", this.data.list_travelnotes);

    DB.doc(id).update({
      data: {
        likeamount: like,
        likebool:-1
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