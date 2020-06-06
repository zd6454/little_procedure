// component/start/start.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     list:{
       type:Array,
       value:[],
     },
    user: {
      type: String,
      vslue: ""
    },
    tabs_small:{
      type:Array,
      value:[],
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
    handleIlike(e) {
      this.triggerEvent("handleIlike", e);
    },

    // handlecomment2(e){
    //   this.triggerEvent("handlecomment2", e);
    // },
    handlegood(e) {
      this.triggerEvent("handlegood", e);
    },
  }
})
