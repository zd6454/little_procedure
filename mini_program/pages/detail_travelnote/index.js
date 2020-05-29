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
    note:[],

    key: 0,
    comment_user: {},//当前评论用户
    comment_user_list: {},//数据库评论记录
    comment: "",//当前评论
    time: "",//当前时间
    loading: true,
    inputValue: "",
    startX: 0, //开始坐标
    startY: 0,
    user:"",
    like_true:false
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
        this.data.travelnotes.forEach(v=>{
          if (v._id === note_id){
            this.setData({
              note:v,
            })
          }
        })
        console.log("查询成功", this.data.travelnotes);
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

    //评论查询数据库
    this.onQuery();
  },

  onShareAppMessage(){

  },

  onADD: function (e, contenxt) {
    const note_id=this.data.note_id
    var travelnotes = this.data.travelnotes
    var time = util.formatTime(new Date());//获取当前时间 
    db.collection('comment').add({
      data: {
        note_id: this.data.note_id,
        user: e.nickName,//评论者
        user_image: e.avatarUrl,//评论者的头像
        user_context: contenxt.comment,//评论的内容
        time: time,
        key:1,
        isTouchMove:false//默认隐藏删除
      },
      success: res => {
        var commentamount
        travelnotes.forEach(v => {
          if (v._id === note_id) {
            v.commentamount=v.commentamount+1;
            commentamount = v.commentamount;
            console.log(commentamount,"555555555555555555555555555555555")
          }
        })

        this.setData({
          key: 1,
          travelnotes: travelnotes
        })
        console.log(travelnotes)

        DB.doc(note_id).update({
          data: {
            commentamount: commentamount
          },
          success(res) {
            console.log(res);
          }
        })

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


  // //手指触摸动作开始 记录起点X坐标
  // touchstart: function (e) {
  //   //开始触摸时 重置所有删除
  //   this.data.comment_user_list.forEach(function (v, i) {
  //     if (v.isTouchMove)//只操作为true的
  //       v.isTouchMove = false;
  //   })

  //   this.setData({
  //     startX: e.changedTouches[0].clientX,
  //     startY: e.changedTouches[0].clientY,
  //     comment_user_list: this.data.comment_user_list
  //   })
  // },

  // //滑动事件处理
  // touchmove: function (e) {
  //   var that = this,
  //     index = e.currentTarget.dataset.index,//当前索引
  //     startX = that.data.startX,//开始X坐标
  //     startY = that.data.startY,//开始Y坐标
  //     touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
  //     touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
  //     //获取滑动角度
  //     angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
  //     that.data.comment_user_list.forEach(function (v, i) {
  //        v.isTouchMove = false
  //     //滑动超过30度角 return
  //     if (Math.abs(angle) > 30) return;
  //     if (i == index) {
  //       if (touchMoveX > startX) //右滑
  //         v.isTouchMove = false
  //       else //左滑
  //         v.isTouchMove = true
  //     }
  //   })

  //   //更新数据
  //   that.setData({
  //     comment_user_list: that.data.comment_user_list
  //   })
  // },

  // /**
  // * 计算滑动角度
  // * @param {Object} start 起点坐标
  // * @param {Object} end 终点坐标
  // */

  // angle: function (start, end) {
  //   var _X = end.X - start.X,
  //     _Y = end.Y - start.Y
  //   //返回角度 /Math.atan()返回数字的反正切值
  //   return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  // },


  //删除事件
  del: function (e) {
    console.log(e);
    const note_id=this.data.note_id
    var travelnotes = this.data.travelnotes
    var that = this;

    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        that.data.comment_user_list.forEach(v=>{
          if (res.userInfo.nickName === v.user || res.userInfo.nickName === that.data.travelnotes.userInfo.nickName){//评论的人和题主可以删评论
            wx.showModal({
              title: '提示',
              content: '是否确定删除',
              success(t) {
                if (t.confirm) {
                  console.log('用户点击确定');
                  //从数据库中删除
                  db.collection('comment').doc(e.currentTarget.dataset.index).remove({
                    success: function (ms) {
                      var commentamount
                      //从数组中删除
                      that.data.comment_user_list.splice(e.currentTarget.dataset.index, 1);
                      that.setData({
                        comment_user_list: that.data.comment_user_list
                      })
                      travelnotes.forEach(v => {
                        if (v._id === note_id) {
                          v.commentamount = v.commentamount - 1;
                          commentamount = v.commentamount;
                        }
                      })
                       that.setData({
                        travelnotes: travelnotes
                      })
                      DB.doc(note_id).update({
                        data: {
                          commentamount: commentamount 
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
                        icon:"none"
                      })
                    },
                  })
                } else if (t.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }else{
            wx.showToast({
              title: '没有删除权限',
              icon: "none"
            })
          }
        })
      }
    })
  },


  //点击放大图片
  handlePreviewImage(e) {
    console.log(e);
    console.log(this.data.note);
    // 1.先构造要预览的图片数组
    const urls = this.data.note.travelnote.images;
   
    // console.log(urls);
    // 2.接收传递过来的图片
    const current = e.currentTarget.dataset.url;

    wx.previewImage({
      current: current,
      urls: urls
    });
  },

  //长按效果  删除
  longPress(e){
    console.log(e);
    this.del(e);
  },
  //喜欢
  handleIlike(e) {
    console.log(e);
    // const list_travelnotes = wx.getStorageSync("list_travelnotes");
    const travelnotes = this.data.travelnotes;

    let id = e.currentTarget.dataset.id;
    let likeamount = e.currentTarget.dataset.likeamount;//本条id的点赞数

    var like;

    // const that=this;
    travelnotes.forEach(v => {
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
      travelnotes: travelnotes
    })
    console.log(this.data.travelnotes)
    wx.setStorageSync("travelnotes", this.data.travelnotes);

    DB.doc(id).update({
      data: {
        like: like,
        likeamount: likeamount,
      },
      success(res) {
        console.log(res);
      }
    })
  },

  //收藏
  handlegood(e) {
    console.log(e);
    const travelnotes = this.data.travelnotes;

    let id = e.currentTarget.dataset.id;
    let goodamount = e.currentTarget.dataset.goodamount;//本条id的点赞数

    var good;

    // const that=this;
    travelnotes.forEach(v => {
      ;
      if (v._id === id) {//找到相关id的记录
        if (v.good.length === 0) { //目前没有人点过赞
          // 没有人点过赞 那么点击时则需要将点击的用户名添加到good数组中  证明此人点赞了
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
      travelnotes: travelnotes
    })
    console.log(this.data.travelnotes)
    wx.setStorageSync("travelnotes", this.data.travelnotes);

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