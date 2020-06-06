// pages/comment/comment.js
const DB = wx.cloud.database().collection("stategies");
const util = require('../../utils/util.js');
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list_strategy: [],
    strategy_id: "",
    strategy: [],

    key: 0,
    reccive_menter: {},
    comment_user: {},//当前评论用户
    comment_user_list: {},//数据库评论记录
    comment: "",//当前评论
    time: "",//当前时间
    loading: true,
    inputValue: "",
    user:"",

    urls:[],
    tabs_small: [],
    // commentamount:0,
  },

  onLoad: function (options) {
    const strategy_id = options._id;//获取从页面传过来的id
    this.setData({
      strategy_id,
    })

    console.log(this.data.strategy_id);
    DB.get({
      success: res => {
        this.setData({
          list_strategy: res.data,
        })
        this.data.list_strategy.forEach(v => {
          if (v._id === strategy_id) {
            this.setData({
              strategy: v,
            })
          }
        })
        res.data.forEach(v => {
          v.travel_type.forEach(u => {
            if (u.state === 2) {
              this.setData({
                tabs_small: this.data.tabs_small.concat(u.name),
              })
            }
          })
        })
        console.log("查询成功", this.data.list_strategy);
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

  onShareAppMessage() {

  },

  //添加评论进入数据库
  onADD: function (e, contenxt) {
    const strategy_id = this.data.strategy_id
    var list_strategy=this.data.list_strategy
    var time = util.formatTime(new Date());//获取当前时间
    db.collection('comment').add({
      data: {
        strategy_id:this.data.strategy_id,
        user: e.nickName,//评论者
        user_image: e.avatarUrl,//评论者的头像
        user_context: contenxt.comment,//评论的内容
        time: time,
        key:1,
        isTouchMove:false,
        response: [],
        responseamount:0,
      },
      success: res => {
        var commentamount
        list_strategy.forEach(v => {
          if (v._id === strategy_id) {
            v.commentamount = v.commentamount + 1;
            commentamount = v.commentamount;
            console.log(commentamount, "999999999")
          }
        })
        this.setData({
          key: 1,
          list_strategy: list_strategy,
          // commentamount: commentamount
        })
        console.log(res)
        DB.doc(strategy_id).update({
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

    db.collection('comment').where({
      strategy_id: this.data.strategy_id,
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

  //喜欢
  handleIlike(e) {
    console.log(e);
    const list_strategy = this.data.list_strategy;

    let id = e.currentTarget.dataset.id;
    let likeamount = e.currentTarget.dataset.likeamount;//本条id的点赞数

    var like;
    // const that=this;
    list_strategy.forEach(v => {
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
    const list_strategy = this.data.list_strategy;

    let id = e.currentTarget.dataset.id;
    let goodamount = e.currentTarget.dataset.goodamount;//本条id的点赞数

    var good;

    // const that=this;
    list_strategy.forEach(v => {
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
      list_strategy: list_strategy
    })
    console.log(this.data.list_strategy)
    wx.setStorageSync("list_strategy", this.data.list_strategy);

    DB.doc(id).update({
      data: {
        good: good,
        goodamount: goodamount,
      },
      success(res) {
        console.log(res);
      }
    })
  },

  //点击放大图片
  handlePreviewImage(e) {
    console.log(e);
    // console.log("cccccccccccccccccc",this.data.strategy);
    const image_pre = this.data.strategy.imageurl;
    // 1.先构造要预览的图片数组
    // var urls = this.data.strategy.palyimagescloud;
    this.setData({
      urls: this.data.strategy.playimagescloud.concat(image_pre)
    })
    // urls.concat(this.data.strategy.imageurl)

    // console.log(urls);
    // 2.接收传递过来的图片
    const current = e.currentTarget.dataset.url;

    wx.previewImage({
      current: current,
      urls: this.data.urls
    });
  },

  // navig(e){
  //   let _id = e.currentTarget.dataset.id;//本条id的点赞数
  // console.log(_id);
  //   wx.navigateTo({
  //     url: '../../pages/response/index?_id={{_id}}&author=this.data.strategy.userInfo.nickName',
  //   })
  // }
})