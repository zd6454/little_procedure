// component/scorll/scorll.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     rows:{
      type:Array,
      value:[]
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
    upper(e) {
      console.log(e)
    },
  
    lower(e) {
      console.log(e)
    },
  
    scroll(e) {
      console.log(e)
    },
  
    scrollToTop() {
      this.setAction({
        scrollTop: 0
      })
    },
  }
})
