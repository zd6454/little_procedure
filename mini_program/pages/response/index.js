// pages/response/index.js
const DB = wx.cloud.database().collection("comment");
const util = require('../../utils/util.js');
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment_id:"",
    comment_list:[],
    response:[],
    author:"",

    key: 0,
    comment_user: {},//当前评论用户
    comment_user_list: {},//数据库评论记录
    comment: "",//当前评论
    time: "",//当前时间
    loading: true,
    inputValue: "",
    // startX: 0, //开始坐标
    // startY: 0,
    user: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options._id)
    const author = options.author
    const comment_id = options._id;//获取从详情传过来的id 评论的
    this.setData({
      comment_id: comment_id,
      author: author,
    })
    console.log("评论id", this.data.author)

    //从comment数据库中获取到已有的评论
    DB.get({
      success: res => {
        this.setData({
          comment_list: res.data,
        })
        this.data.comment_list.forEach(v => {
          if (v._id === comment_id) {
            this.setData({
              comment: v,//属于自己的评论
            })
          }
        })

        console.log("评论", this.data.comment_list);

        const that = this;
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              user: res.userInfo.nickName,//获取到用户的名字
            })
          }
        })
      },
      file(res) {
        console.log("查询失败", res);
      }
    })   
    this.onQuery();

  },

  //添加评论
  onADD: function (e, contenxt) {
    const comment_id = this.data.comment_id
    var comment_list = this.data.comment_list
    var time = util.formatTime(new Date());//获取当前时间 
    db.collection('response').add({
      data: {
        comment_id: this.data.comment_id,
        user: e.nickName,//评论者
        user_image: e.avatarUrl,//评论者的头像
        user_context: contenxt.comment,//评论的内容
        time: time,
        key: 1,
        isTouchMove: false,//默认隐藏删除
        // response: [],//回复
      },
      success: res => {
        var responseamount
        comment_list.forEach(v => {
          if (v._id === comment_id) {
            v.responseamount = v.responseamount + 1;
            responseamount = v.responseamount;
            console.log(responseamount, "555555555555555555555555555555555")
          }
        })

        this.setData({
          key: 1,
          comment_list: comment_list
        })
        // console.log(travelnotes)

        DB.doc(comment_id).update({
          data: {
            responseamount: responseamount
          },
          success(res) {
            console.log(res);
          }
        })

        wx.showToast({
          title: '新增记录成功',
        })

        this.onQuery();
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
    db.collection('response').where({
      comment_id: this.data.comment_id,
    }).get({
      success: res => {
        console.log(res);
        this.setData({
          comment_user_list: res.data,
          loading: false,
          key: 1,
        })
        console.log("数据库查询成功", this.data.comment_id)
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
    // console.log(contenxt)
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
  //长按效果  删除
  longPress(e) {
    console.log(e);
    this.del(e);
  },
  //删除事件
  del: function (e) {
    console.log(e);
    const comment_id = this.data.comment_id
    var comment_list = this.data.comment_list
    var that = this;

    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        that.data.comment_user_list.forEach(v => {
          if ( res.userInfo.nickName === v.user) {//评论的人和题主可以删评论
            wx.showModal({
              title: '提示',
              content: '是否确定删除',
              success(t) {
                if (t.confirm) {
                  console.log('用户点击确定');
                  //从数据库中删除
                  db.collection('response').doc(e.currentTarget.dataset.index).remove({
                    success: function (ms) {
                      var responseamount
                      //从数组中删除
                      that.data.comment_user_list.splice(e.currentTarget.dataset.index, 1);
                      that.setData({
                        comment_user_list: that.data.comment_user_list
                      })
                      comment_list.forEach(v => {
                        if (v._id === comment_id) {
                          v.responseamount = v.responseamount - 1;
                          responseamount = v.responseamount;
                        }
                      })
                      that.setData({
                        comment_list: comment_list
                      })
                      DB.doc(comment_id).update({
                        data: {
                          responseamount: responseamount
                        },
                        success(res) {
                          console.log(res);

                        }
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
          } else {
            wx.showToast({
              title: '没有删除权限',
              icon: "none"
            })
          }
        })
      }
    })
  }
})