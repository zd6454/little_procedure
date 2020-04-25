// component/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Object,
      value:{
        id:1,
        name:"行程亮点",
        isactive:false
      }
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
handleItemTab(e){
  const {index}=e.currentTarget.dataset;
 this.triggerEvent("itemChange",{index})
}
  }
})
