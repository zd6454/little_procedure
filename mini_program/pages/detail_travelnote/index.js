// pages/detail_travelnote/index.js
const DB = wx.cloud.database().collection("travelnotes");
const util = require('../../utils/util.js');
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    travelnotes:[],
    note_id:"",

    key: 0,
    comment_user: {},//当前评论用户
    comment_user_list: {},//数据库评论记录
    comment: "",//当前评论
    time: "",//当前时间
    loading: true,
    inputValue: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const note_id = options._id;//获取从页面传过来的id
    this.setData({
      note_id,
    })
    
    console.log(this.data.note_id);
    DB.get({
      success: res => {
        this.setData({
          travelnotes: res.data,
        })
        console.log("查询成功", this.data.travelnotes);
      },
      file(res) {
        console.log("查询失败", res);
      }
    })   

    //评论查询数据库
    this.onQuery();
  },

  onADD: function (e, contenxt) {
    var time = util.formatTime(new Date());//获取当前时间
    db.collection('comment').add({
      data: {
        note_id: this.data.note_id,
        user: e.nickName,//评论者
        user_image: e.avatarUrl,//评论者的头像
        user_context: contenxt.comment,//评论的内容
        time: time,
        key:1,
      },
      success: res => {
        this.setData({
          key: 1
        })
        console.log(res)
        wx.showToast({
          title: '新增记录成功',
        })
        // if (getCurrentPages().length != 0) {
          //刷新当前页面的数据
          this.onQuery();
          // const _id=this.data.note_id;
          // getCurrentPages()[getCurrentPages().length - 1].onLoad(_id)
        // }
      },
      fail: (res) => {
        wx.showToast({
          title: '新增记录失败',
        })
        console.log(res)
      }
    })
  },
  //数据库查询
  onQuery: function () {

    db.collection('comment').where({
      note_id: this.data.note_id,
    }).get({
      success: res => {
        console.log(res);
        this.setData({
          comment_user_list: res.data,
          loading: false,
          key: 1,
        })
        console.log("数据库查询成功", res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
        })
        console.error('数据库查询失败', err)
      }
    })
  },
  //获取用户信息
  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
  },
  //确定评论
  submitForm(e) {
    let self = this
    var time = util.formatTime(new Date());
    const contenxt = e.detail.value;//获取输入的评论信息
    console.log(contenxt)
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
        wx.getUserInfo({
          success: function (res) {
            console.log(res.userInfo)
            self.setData({
              comment: contenxt,
              comment_user: res.userInfo,
              time: time,
              inputValue: "",
            })
            self.onADD(res.userInfo, contenxt);
          }
        })
      }
    })

  },
})