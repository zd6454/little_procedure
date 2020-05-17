// pages/moredetail/moredetail.js
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var qqmapsdk;
const createRecycleContext = require('../../miniprogram_npm/miniprogram-recycle-view/index')
Page({
  /**
   * 页面的初始数据
   */

  data: {
    Context:Object,
    inputShowed: false,
    inputVal: "",
    loading:"true",
    rows:[],
    params:{
      boundary:'nearby(30.547983,114.337861,1000)',
      keyword:'酒店',
      page_size:60,
    },
    tabs:{
        id:1,
        name:"行程亮点",
        isactive:false
      }
},

getdatas(params){
const URL='https://apis.map.qq.com/ws/place/v1/search?boundary=';
const keyword='&keyword=';
const page_size='&page_size=';
const end='&page_index=1&orderby=_distance&key=QO5BZ-VD6R4-M4AUD-D36UT-VGBVS-6HBZV';
  let self = this;
  var datas=[];
  console.log(URL+params.boundary+keyword+params.keyword+page_size+params.page_size+end);
  wx.request({
    url: URL+params.boundary+keyword+params.keyword+page_size+params.page_size+end,
    // url:'https://apis.map.qq.com/ws/place/v1/search?boundary=nearby(39.908491,116.374328,1000)&keyword=KFC&page_size=50&page_index=1&orderby=_distance&key=QO5BZ-VD6R4-M4AUD-D36UT-VGBVS-6HBZV',
    method:'GET',
success:function(res){
  console.log(res)
  datas=res.data.data;
  // self.Context.append(datas);
self.setData({
  rows:res.data.data,
  loading:false
})
},
fail:function(res){
  console.log(res)
}
  })
},

/**
   * 生命周期函数--监听页面加载
   */
onLoad:function () {
  const {params}=this.data;
    this.setData({
        search: this.search.bind(this)
    })
    //  this.getdatas(params);
    
},

search: function (value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([{text: '搜索结果', value: 1}, {text: '搜索结果2', value: 2}])
        }, 200)
    })
},
selectResult: function (e) {
    console.log('select result', e.detail)
},


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const {params}=this.data;
    // this.getdatas(params)
    var self=this;
    self.Context = createRecycleContext({
      id: "recycleId",
      dataKey: 'recycleList',
      page: this,
      itemSize: { // 这个参数也可以直接传下面定义的this.itemSizeFunc函数
        width: 162,
        height: 182
      }
    })
    this.getdatas(params);
  },
  itemSizeFunc: function (item, idx) {
    return {
        width: 162,
        height: 182
    }
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

  }
})