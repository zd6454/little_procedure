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
  console.log(e.target.dataset.id);
  let id = e.target.dataset.id;
  // console.log(id);

  let self = this;
  self.setData({
    likeamount: this.data.likeamount + 1,
  })
  // console.log(this.data.likeamount);
  db.collection('travelnotes').doc(id).update({
    data: {
      likeamount: this.data.likeamount,
    },
    success(res){
      console.log(res);
    }
    
  })
},

handlecomment2(e){

},
handlegood(e){
  console.log(e);
  let self=this;
  self.setData({
   goodamount:this.data.goodamount+1,
  })
  db.collection('travelnotes').doc('todo-identifiant-aleatoire').update({
    data:{
      goodamount:this.data.goodamount,
    }
  })
},
handleshow(){

}
  }
})
