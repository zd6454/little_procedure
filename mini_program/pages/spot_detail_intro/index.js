const db = wx.cloud.database();
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detaillist: [{ name: "简介", desc: "intro_intro" }, { name: "开放时间", desc: "intro_time" }, { name: "门票", desc: "intro_ticket" }, { name: "注意事项", desc: "intro_notice" }, { name: "交通攻略", desc: "intro_trans" },],
    navActive: 0,
    scrollLeft: 0, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const { spot_id } = options;
    console.log(spot_id);
    this.getSpotDetail(spot_id);
    this.setData({
      SpotId: spot_id,
    })

    var that = this;
    //设置列表高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          // height:1140
          height: res.windowHeight * 2 - 60,
        })
      },
    });

  },

  getSpotDetail(spot_id) {
    db.collection("spots").doc(spot_id).get({
      success: res => {
        console.log(res.data);
        //设置detaillist数据
        var temp0 = "detaillist[" + 0 + "].desc";
        var temp1 = "detaillist[" + 1 + "].desc";
        var temp2 = "detaillist[" + 2 + "].desc";
        var temp3 = "detaillist[" + 3 + "].desc";
        var temp4 = "detaillist[" + 4 + "].desc";
        this.setData({
          [temp0]: res.data.spot_detail_intro,
          [temp1]: res.data.spot_detail_time,
          [temp2]: res.data.spot_detail_ticket,
          [temp3]: res.data.spot_detail_notice,
          [temp4]: res.data.spot_detail_bus,
        });
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  tap: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    this.setData({
      toView: id,
      navActive: index
    });
  },

  //首先要获取部分内容距离顶部的高度，滑动的时候监听高度是否到达对应位置；

  // 获取商品列表，生成高度集合


  // 页面滑动到相应位置 对应导航提示
  scroll: function (e) {
    console.log(e);
    var that = this;
    var height = 0;
    var number = 0
    var hightArr = [];
    for (var i = 0; i < that.data.detaillist.length; i++) { //这里的detaillist指对应商品集合
      //获取元素所在位置
      wx.createSelectorQuery().select('#de' + i).boundingClientRect(function (rect) {
        number = rect.height + number;
        hightArr.push(number);
        that.setData({
          hightArr: hightArr
        })
      }).exec();
      console.log(that.data.hightArr);
    };
    console.log(e.detail.scrollTop);
    var scrollTop = e.detail.scrollTop;
    var scrollArr = that.data.hightArr;
    for (var i = 0; i < scrollArr.length; i++) {
      if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
        if (0 != this.data.lastActive) {
          this.setData({
            navActive: 0,
            lastActive: 0
          })
        }
      } else if (scrollTop >= scrollArr[i - 1] && scrollTop <= scrollArr[i]) {
        if (i != this.data.lastActive) {
          this.setData({
            navActive: i,
            lastActive: i
          })
        }
      }

    }
  },
})