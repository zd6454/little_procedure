
// pages/hahha/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pictures: [
      {
        src: "../../images/huangheluo.jpg",
        src_big: "https://ae01.alicdn.com/kf/Hfc876dcff3cb43e09be9435614561fb9j.jpg",
        pid: 0
      },
      {
        src: "../../images/donghu.jpg",
        src_big: "https://ae01.alicdn.com/kf/H931493f5ae5c4606bf9bf88c37f1ee1ci.jpg",
        pid: 1
      },
      {
        src: "../../images/bowuguan.jpg",
        src_big: "https://ae01.alicdn.com/kf/H5f374207056b4614ace4bc9984c6d713P.jpg",
        pid: 2
      },
      {
        src: "../../images/wuda.jpg",
        src_big: "https://ae01.alicdn.com/kf/Heef5fdfb6d4f4813b2fa6e321022f6feJ.jpg",
        pid: 3
      }
    ],
    tabs: [
      {
        id: 0,
        value: "导览",
        isActive: true
      },
      {
        id: 1,
        value: "景点",
        isActive: false
      },
      {
        id: 2,
        value: "美食",
        isActive: false
      }
    ],
    markers: [],
    includepoints: [],
    timer: '',
    countDownNum: 0,//用来计时  以改变图标
    activity: [0, 1, 2, 3],
    secenList: [],
    foodList: [],
    searchList: [],
    value: ''//通过搜索获得的数据
  },

  // 景点接口要的参数
  QueryParams: {
    keyword: "景点",
    boundary: "region(武汉)",
    page_index: 1,
    page_size: 20,    // 页容量
    key: 'SB4BZ-NURKK-NFMJ6-A63LK-MXYIE-SEFZI'
  },
  // 美食接口要的参数
  QueryFoods: {
    keyword: "美食",
    boundary: "region(武汉)",
    page_index: 1,
    page_size: 20,    // 页容量
    key: 'SB4BZ-NURKK-NFMJ6-A63LK-MXYIE-SEFZI'
  },
  // 搜索
  SearchParams: {
    keyword: "景点",
    boundary: "region(武汉)",
    page_index: 1,
    page_size: 1,    // 页容量
    key: 'SB4BZ-NURKK-NFMJ6-A63LK-MXYIE-SEFZI'
  },

  totalPage: 1,
  totalPage1: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      includepoints: [
        {
          latitude: 30.550317,
          longitude: 114.304043,
        },
        {
          latitude: 30.557869,
          longitude: 114.438005,
        },
        {
          latitude: 30.617735,
          longitude: 114.245081, 
        },
        {
          latitude: 30.544872,
          longitude: 114.365818,
        }
      ]

    })
    this.setData({
      search: this.search.bind(this)
    })
    this.countDown();
    this.getList();
    this.getFood();
  },

  // 获取景点数据
  getList() {
    wx.request({
      url: 'https://apis.map.qq.com/ws/place/v1/search',
      data: this.QueryParams,
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        const total = res.data.count;//获取总条数
        this.totalPage = Math.ceil(total / this.QueryParams.page_size);
        this.setData({
          secenList: [...this.data.secenList, ...res.data.data]
        })
      },
      fail: function (err) { console.log(err) },
    })
  },

  //获取美食数据
  getFood() {
    wx.request({
      url: 'https://apis.map.qq.com/ws/place/v1/search',
      data: this.QueryFoods,
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        const total = res.data.count;//获取总条数
        this.totalPage1 = Math.ceil(total / this.QueryFoods.page_size);
        this.setData({
          foodList: [...this.data.foodList, ...res.data.data]
        })
      },
      fail: function (err) { console.log(err) },
    })
  },
  // 搜索
  getSearch() {
    //景点
    if (this.data.tabs[1].isActive){
      this.SearchParams.keyword ="景点"+ this.data.value;
      wx.request({
        url: 'https://apis.map.qq.com/ws/place/v1/search',
        data: this.SearchParams,
        method: 'GET',
        dataType: 'json',
        success: (res) => {
          console.log(res)
          this.setData({
            secenList: res.data.data
          })
        },
        fail: function (err) {
          console.log(err)
        },
      })
    }
    //美食
    if (this.data.tabs[2].isActive) {
      this.SearchParams.keyword = "美食" + this.data.value;
      wx.request({
        url: 'https://apis.map.qq.com/ws/place/v1/search',
        data: this.SearchParams,
        method: 'GET',
        dataType: 'json',
        success: (res) => {
          console.log(res)
          this.setData({
            foodList: res.data.data
          })
        },
        fail: function (err) {
          console.log(err)
        },
      })
    }
   
   
  },

  // 滚动条触底事件
  onReachBottom() {
    // 还有没有下一页数据
    if (this.QueryParams.page_index >= this.totalPage) {
      // 没有下一页数据
      // console.log("没有下一页数据");
      wx.showToast({ title: '没有下一页数据' });

    } else {
      // 还有下一页
      // console.log("有下一页数据");
      this.QueryParams.page_index++;
      this.getList();
    }
    // 还有没有下一页数据
    if (this.QueryFoods.page_index >= this.totalPage1) {
      // 没有下一页数据
      // console.log("没有下一页数据");
      wx.showToast({ title: '没有下一页数据' });

    } else {
      // 还有下一页
      // console.log("有下一页数据");
      this.QueryFoods.page_index++;
      this.getFood();
    }
  },

  // 下拉刷新事件
  onPullDownRefresh() {
    // console.log('我就想看看这个方法触发了没有');
    // 重置数组
    this.setData({
      secenList: [],
      foodList: []
    })
    // 重置页码
    this.QueryParams.page_index = 1;
    this.QueryFoods.page_index = 1;
    this.totalPage = 1;
    this.totalPage1 = 1;

    // 发送请求
    this.getList();
    this.getFood();
    wx.stopPullDownRefresh();
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
      this.getSearch();
    }
  },

  //点击放大图片
  handlePreviewImage(e) {
    console.log(e);
    // 1.先构造要预览的图片数组
    const urls = this.data.pictures.map(v => v.src_big);
    // console.log(urls);
    // 2.接收传递过来的图片
    const current = e.currentTarget.dataset.url;

    wx.previewImage({
      current: current,
      urls: urls
    });
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

  // 地图闪烁
  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum;
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        if (countDownNum % 7 == 0) {
          that.setData({
            markers: [
              {
                id: 2738900478225601695,
                latitude: 30.550317,
                longitude: 114.309043,
                iconPath: "../../icons/huanghelou.png",
                width: 30,
                height: 30,
                callout: {
                  content: "黄鹤楼",
                  color: 'grey',
                  fontSize: 17,
                  bgcolor: '#dd5145',
                  display: 'ALWAYS'
                }
              },
              {
                id: 1762485786450392429,
                latitude: 30.557869,
                longitude: 114.420005,
                iconPath: "../../icons/donghupng.png",
                width: 30,
                height: 30,
                callout: {
                  content: "东湖",
                  color: 'grey',
                  bgColor: '#c0e6b3',
                  fontSize: 17,
                  display: 'ALWAYS'
                }
              },
              {
                id: 12248476031736664809,
                latitude: 30.617735,
                longitude: 114.263081, 
                iconPath: "../../icons/blank.png",
                width: 30,
                height: 30,
                callout: {
                  content: "武汉博物馆",
                  color: 'blue',
                  fontSize: 17,
                  borderWidth: 1,
                  borderColor: '#ffc700',
                  display: 'ALWAYS'
                }
              },
              {
                id: 14728278092434237534,
                latitude: 30.534872,
                longitude: 114.365818,
                iconPath: "../../icons/blank.png",
                width: 30,
                height: 30,
                callout: {
                  content: "武汉大学",
                  color: 'blue',
                  fontSize: 17,
                  borderWidth: 1,
                  borderColor: '##ffc700',
                  display: 'ALWAYS'
                },
              }
            ]
          })
        }
        else if (countDownNum % 5 == 1) {
          that.setData({
            markers: [
              {
                id: 2738900478225601695,
                latitude: 30.550317,
                longitude: 114.309043,
                iconPath: "../../icons/blank.png",
                width: 30,
                height: 30,
                callout: {
                  content: "欢迎",
                  color: 'blue',
                  fontSize: 17,
                  borderWidth: 1,
                  borderColor: '#00aaaa',
                  display: 'ALWAYS'
                }
              },
              {
                id: 1762485786450392429,
                latitude: 30.557869,
                longitude: 114.420005,
                iconPath: "../../icons/blank.png",
                width: 30,
                height: 30,
                callout: {
                  content: "欢迎",
                  color: 'blue',
                  fontSize: 17,
                  borderWidth: 1,
                  borderColor: '#00aaaa',
                  display: 'ALWAYS'
                }
              },
              {
                id: 12248476031736664809,
                latitude: 30.617735,
                longitude: 114.263081, 
                iconPath: "../../icons/bowuguan.png",
                width: 30,
                height: 30,
                callout: {
                  content: "武汉博物馆",
                  color: 'grey',
                  bgColor: 'yellow',
                  fontSize: 17,
                  display: 'ALWAYS'
                },
              },
              {
                id: 14728278092434237534,
                latitude: 30.534872,
                longitude: 114.365818,
                iconPath: "../../icons/blank.png",
                width: 30,
                height: 30,
                callout: {
                  content: "欢迎",
                  color: 'blue',
                  fontSize: 17,
                  borderWidth: 1,
                  borderColor: '#00aaaa',
                  display: 'ALWAYS'
                },
              }
            ]
          })
        }
        else if (countDownNum % 3 == 0) {
          that.setData({
            markers: [
              {
                id: 2738900478225601695,
                latitude: 30.550317,
                longitude: 114.309043,
                iconPath: "../../icons/blank.png",
                width: 30,
                height: 30,
                callout: {
                  content: "欢迎",
                  color: 'blue',
                  fontSize: 17,
                  borderWidth: 1,
                  borderColor: '#00aaaa',
                  display: 'ALWAYS'
                }
              },
              {
                id: 1762485786450392429,
                latitude: 30.557869,
                longitude: 114.420005,
                iconPath: "../../icons/blank.png",
                width: 30,
                height: 30,
                callout: {
                  content: "欢迎",
                  color: 'blue',
                  fontSize: 17,
                  borderWidth: 1,
                  borderColor: '#00aaaa',
                  display: 'ALWAYS'
                }
              },
              {
                id: 12248476031736664809,
                latitude: 30.617735,
                longitude: 114.263081, 
                iconPath: "../../icons/blank.png",
                width: 30,
                height: 30,
                callout: {
                  content: "欢迎",
                  color: 'blue',
                  fontSize: 17,
                  borderWidth: 1,
                  borderColor: '#00aaaa',
                  display: 'ALWAYS'
                }
              },
              {
                id: 14728278092434237534,
                latitude: 30.534872,
                longitude: 114.365818,
                iconPath: "../../icons/wuda.png",
                width: 30,
                height: 30,
                callout: {
                  content: "武汉大学",
                  color: 'grey',
                  bgColor: '#ffc700',
                  fontSize: 17,
                  display: 'ALWAYS'
                },
              }

            ]
          })
        } else if (countDownNum % 2 == 0) {
          that.setData({
            markers: [
              {
                id: 2738900478225601695,
                latitude: 30.550317,
                longitude: 114.309043,
                iconPath: "../../icons/huanghelou.png",
                width: 30,
                height: 30,
                callout: {
                  content: "黄鹤楼",
                  color: 'grey',
                  fontSize: 17,
                  bgcolor: '#dd5145',
                  display: 'ALWAYS'
                }
              },
              {
                id: 1762485786450392429,
                latitude: 30.557869,
                longitude: 114.420005,
                iconPath: "../../icons/blank.png",
                width: 30,
                height: 30,
                callout: {
                  content: "欢迎",
                  color: 'blue',
                  fontSize: 17,
                  borderWidth: 1,
                  borderColor: '#00aaaa',
                  display: 'ALWAYS'
                }
              },
              {
                id: 12248476031736664809,
                latitude: 30.617735,
                longitude: 114.263081, 
                iconPath: "../../icons/blank.png",
                width: 30,
                height: 30,
                callout: {
                  content: "欢迎",
                  color: 'blue',
                  fontSize: 17,
                  borderWidth: 1,
                  borderColor: '#00aaaa',
                  display: 'ALWAYS'
                }
              },
              {
                id: 14728278092434237534,
                latitude: 30.534872,
                longitude: 114.365818,
                iconPath: "../../icons/blank.png",
                width: 30,
                height: 30,
                callout: {
                  content: "欢迎",
                  color: 'blue',
                  fontSize: 17,
                  borderWidth: 1,
                  borderColor: '#00aaaa',
                  display: 'ALWAYS'
                },
              }

            ]
          })
        }
        countDownNum++;
        that.setData({
          countDownNum: countDownNum,
        })
      }, 700)
    })
  },
  // 点击地图切换到具体景点
  markertap: function (e) {
    console.log(e);
    if (e.markerId === 2738900478225601500){
      wx.navigateTo({
        url: '/pages/spot_detail/index?id=2738900478225601695',
      })
    }
    else if (e.markerId === 14728278092434237000) {
      wx.navigateTo({
        url: '/pages/spot_detail/index?id=14728278092434237534',
      })
    }
    else if (e.markerId === 1762485786450392300) {
      wx.navigateTo({
        url: '/pages/spot_detail/index?id=1762485786450392429',
      })
    }
    else if (e.markerId === 12248476031736664000) {
      wx.navigateTo({
        url: '/pages/spot_detail/index?id=12248476031736664809',
      })
    }
    
  },

})
