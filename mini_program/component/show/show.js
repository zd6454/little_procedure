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
    list_length:{
      type:Number,
      value:0,
    },
    Data:{
      type:Object,
      value:{
        title:"黄鹤楼大酒店",
        price:"100",
        catelorgy:"酒店住宿",
        hotlevel:"5",
        detail:"123",

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
