// pages/user/index.js
const DB = wx.cloud.database().collection("travelnotes");
const DB1 = wx.cloud.database().collection("stategies");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // userInfo: [],
    tabs1: [
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
        value: "游记",
        isActive: false
      }
    ],
    list_travelnotes: [],
    release_travelnotes:0,
    list_strategy:[],
    release_strategy:0,
    user: [],
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
              value: "景点",
              isActive: true
            },
            {
              id: 1,
              value: "攻略*"+this.data.release_strategy,
              isActive: false
            },
            {
              id: 2,
              value: "游记*" + release_travelnotes,
              isActive: false
            }
          ],
        })
        console.log("bbbbbbbbbbbbbbbbbb",this.data.release_travelnotes);
      },
      file(res) {
        console.log("查询失败", res);
      }
    })

    //攻略
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
              value: "景点",
              isActive: true
            },
            {
              id: 1,
              value: "攻略*" + release_strategy,
              isActive: false
            },
            {
              id: 2,
              value: "游记*" + this.data.release_travelnotes,
              isActive: false
            }
          ],
        })
       
      },
      file(res) {
        console.log("查询失败", res);
      }
    })


  },


  //返回到页面时刷新
  onShow: function () {
    this.init1();
  },
  //下拉刷新
  onPullDownRefresh() {
    this.init1();
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
                            value: "景点",
                            isActive: false
                          },
                          {
                            id: 1,
                            value: "攻略*" + that.data.release_strategy,
                            isActive: false
                          },
                          {
                            id: 2,
                            value: "游记*" +release_travelnotes,
                            isActive: true
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
  //长按删除  攻略
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
                            value: "景点",
                            isActive: false
                          },
                          {
                            id: 1,
                            value: "攻略*" + release_strategy,
                            isActive: true
                          },
                          {
                            id: 2,
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