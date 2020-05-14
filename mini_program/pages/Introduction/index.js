// pages/Introduction/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "攻略",
        isActive: true
      },
      {
        id: 1,
        value: "游记",
        isActive: false
      }
    ],
    list:[
      {
        index:0,
        user_image:"../../icons/bowuguan.png",
        user:"1111"
      },
      {
        index: 1,
        user_image: "../../icons/wuda.png",
        user: "1111"
      },
      {
        index: 2,
        user_image: "../../icons/bowuguan.png",
        user: "1111"
      },
      {
        index: 3,
        user_image: "../../icons/wuda.png",
        user: "1111"
      }
    ]
  },
  //搜索框文本内容显示
  inputBind: function (event) {
    this.setData({
      value: event.detail.value
    })
    console.log(this.data.value)
  },

  // 确定键或者是点击搜素图标执行
  search: function () {
    if (!this.data.value) {
      wx.showToast({
        title: '未找到该搜索内容',
        icon: 'none'
      })
    } else {
      // this.getSearch();
    }
  },

  // 标题点击事件  从子组件传递过来
  handleTabsItemChange(e) {
    // console.log(e);
    // 1.获取被点击的标题
    const { index } = e.detail;
    // 2.修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3.赋值到data中
    this.setData({
      tabs
    })
  },

})