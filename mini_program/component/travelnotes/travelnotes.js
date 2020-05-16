// component/travelnotes/travelnotes.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      list:{
        type:Array,
        value:""
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
   likeamount:0,
   likeimage:"",
   likeuserlist:{
     state:0,
     user_id:"",
    user:{},
   },
   goodimage:"",
   commentamount:0,
   goodamount:0,
   gooduserlist:{
    state:0,
    user_id:"",
    user:{},
   },
  },

  /**
   * 组件的方法列表
   */
  methods: {
handleIlike(e){
  console.log(document);
  console.log(e);
  let self=this;
  self.setData({
  likeamount:this.data.likeamount+1,
  })
},
handlecomment2(e){

},
handlegood(){
  let self=this;
  self.setData({
   goodamount:this.data.goodamount+1,
  })
},
handleshow(){

}
  }
})
