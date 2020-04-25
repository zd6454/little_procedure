// component/show/show.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Array,
      value:[],
    },
    Data:{
      type:Object,
      value:{
        title:"test",
        price:"100",
        catelorgy:"测试所用",
        hotlevel:"5",
        detail:"暂无",

      }
    },
    city:{
      type:String,
      value:"武汉",
    },
    scenary:{
      type:String,
      value:"黄鹤楼",
    },
    catelorgy:{
      type:Number,
      value:1,
    },
    detail_id:{
      type:Number,
      value:1,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
