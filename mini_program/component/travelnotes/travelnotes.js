// component/travelnotes/travelnotes.js
const db=wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      list:{
        type:Array,
        value:""
      },
      user:{
        type:String,
        vslue:""
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
   
  
handleIlike(e){
  this.triggerEvent("handleIlike", e);
},

// handlecomment2(e){
//   this.triggerEvent("handlecomment2", e);
// },
handlegood(e){
  this.triggerEvent("handlegood", e);
},
// handleshow(){
//   this.triggerEvent("handleshow", e);
// }
preimage:function(e){
  const idx = e.target.dataset.index
  const {images} = this.properties.list[0].travelnote
  wx.previewImage({
    current: images[idx],  //当前预览的图片
    urls: images,  //所有要预览的图片
  })
}
  },
  
})
