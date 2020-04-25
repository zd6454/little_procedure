// pages/comment/comment.js
const util = require('../../utils/util.js');
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key:0,
    reccive_menter:{},
    comment_user:{},//当前评论用户
    comment_user_list:{},//数据库评论记录
    comment:"",//当前评论
    time:"",//当前时间
    loading:true,
    inputValue:"",
  },

//添加评论进入数据库
  onADD:function(e,contenxt){
    var time = util.formatTime(new Date());//获取当前时间
    db.collection('comment').add({
      data:{ 
        city:this.data.reccive_menter.city,//城市
        scenic:this.data.reccive_menter.scenary,//具体景点
        type:parseInt(this.data.reccive_menter.catelorgy),//根据具体景点穿过来的服务不同而不同
        detail_id:1,
        user:e.nickName,//评论者
        user_image:e.avatarUrl,//评论者的头像
        user_context:contenxt.comment,//评论的内容
        time:time,
      },
    success:res=>{
      this.setData({
        key:1
      })
      console.log(res)
      wx.showToast({
        title: '新增记录成功',
      })
      if (getCurrentPages().length != 0) {
        //刷新当前页面的数据
        getCurrentPages()[getCurrentPages().length - 1].onLoad()
      }
    },
    fail:(res)=>{
      wx.showToast({
        title: '新增记录失败',
      })
      console.log(res)
    }
    })
  },
  //数据库查询
  onQuery:function(){

   db.collection('comment').where({
    city:this.data.reccive_menter.city,//城市
    scenic:this.data.reccive_menter.scenary,//具体景点
    type:parseInt(this.data.reccive_menter.catelorgy),
    // detail_id:1,
   }).get({
     success:res=>{
       console.log(res);
       this.setData({
           comment_user_list:res.data,
           loading:false,
           key:1,
       })
       console.log("数据库查询成功",res)
     },
     fail:err=>{
       wx.showToast({
         icon:'none',
         title: '查询记录失败',
       })
       console.error('数据库查询失败',err)
     }
   })
  },
  //获取用户信息
  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
  },
  //确定评论
  submitForm(e) {
    let self=this
    var time = util.formatTime(new Date());
    const contenxt=e.detail.value;//获取输入的评论信息
    console.log(contenxt)
    wx.getSetting({
      success (res) {
        console.log(res.authSetting)
        wx.getUserInfo({
          success: function(res) {
            console.log(res.userInfo)
              self.setData({
                  comment:contenxt,
                  comment_user:res.userInfo,
                  time:time,
                  inputValue:"",
              })

               self.onADD(res.userInfo,contenxt);
          }
        })
      }
    })
   
  },

  onLoad: function (options) {
    console.log(options);
    if(this.data.key==0)
    this.setData({
      reccive_menter:options
    })
    this.onQuery();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})