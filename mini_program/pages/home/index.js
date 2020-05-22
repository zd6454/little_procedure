// pages/Introduction/index.js
const DB = wx.cloud.database().collection("travelnotes");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list_travelnotes: [],
    likebool: -1

  },

  onLoad: function () {
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
      }
    })

     DB.get({
      success: res => {
        console.log("查询成功", res.data);
        this.setData({
          list_travelnotes: res.data
        })
        console.log("查询成功", this.data.list_travelnotes);
        wx.setStorageSync("list_travelnotes", this.data.list_travelnotes);

      },
      file(res) {
        console.log("查询失败", res);
      }
    })
  },

  //返回到页面时刷新
  onShow: function () {
    const list_travelnotes = wx.getStorageSync("list_travelnotes");
    this.setTravelnotes(list_travelnotes);
  },
  //下拉刷新
  onPullDownRefresh() {
    const list_travelnotes = wx.getStorageSync("list_travelnotes");
    this.setTravelnotes(list_travelnotes);
  },

  setTravelnotes(list_travelnotes){
this.setData({
  list_travelnotes,
})
  },

  //喜欢
  handleIlike(e) {
    console.log(e);
    const list_travelnotes = wx.getStorageSync("list_travelnotes");
   
    // this.data.list_travelnotes.forEach(v => {
    //     console.log(v.likeamount);
    // })
    let id = e.currentTarget.dataset.id;
    let like = e.currentTarget.dataset.likeamount;
    this.setData({
      likebool: -this.data.likebool
    })
    // console.log(this.data.likebool);
    console.log(like);
    like = like + this.data.likebool;
    console.log(like);
    list_travelnotes.forEach(v => {
      if (v._id === id) {
        v.likeamount = like
        // console.log(v.likeamount);
      }
    })
    this.setData({
      list_travelnotes: list_travelnotes
    })
    wx.setStorageSync("list_travelnotes", this.data.list_travelnotes);

    DB.doc(id).update({
      data: {
        likeamount: like,
      },
      success(res) {
        console.log(res);

      }
    })
    // DB.get({
    //   success: res => {
    //     this.setData({
    //       list_travelnotes: res.data
    //     })
    //   },
    //   file(res) {
    //     console.log("查询失败", res);
    //   }
    // })
    // setTimeout(function () {
    // }, 2000);
  }
})