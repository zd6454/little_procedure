// pages/user/index.js
const DB = wx.cloud.database().collection("travelnotes");
const DB1 = wx.cloud.database().collection("stategies");
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
})

