// component/start/start.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  strartid:{
    type:String,
    value:3
  }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgs: [{
      id: 1
    }, {
      id: 2
    }, {
      id: 3
    }, {
      id: 4
    }, {
      id: 5
    }],
    starId: 3,
    src1: '../../img/start.png',
    src2: '../../img/unstart.png',
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
