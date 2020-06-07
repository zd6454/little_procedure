// pages/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:{},
     list_length:0,
  },
  // onDelete:function(){
  //   const db=wx.cloud.database()
  //   db.collection('comment').where({
  //     city:'武汉',//城市
  //   })
  //   .remove({

  //   })
  // },
  onQuery:function(){
    const db=wx.cloud.database()
    db.collection('comment').where({
     city:'武汉',//城市
     scenic:'黄鹤楼',//具体景点
     type:1,
     detail_id:1,
    }).limit(2).get({
      success:res=>{
        console.log(res);
        this.setData({
            list:res.data,
            list_length:res.data.length,
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
    db.collection('comment').where({
      city:'武汉',//城市
      scenic:'黄鹤楼',//具体景点
      type:1,
      detail_id:1,
     }).count({
       success:res=>{
        this.setData({
          list_length:res.total,
      })
         console.log(res);
       },
       fail:err=>{
        wx.showToast({
          icon:'none',
          title: '查询记录失败',
        })
         console.error(err);
       }
     });
   },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
           this.onQuery();
           console.log(options.query)
           const eventChannel=this.getOpenerEventChannel()
           eventChannel.on('accept',function(data){
             console.log(data,"here")
           })
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

 
})