Component({
  data: {
    play: false
  },
  properties: {},
  methods: {
    changePlay() {
      // 改变状态
      let flag = !this.data.play;
      this.setData({
        play: flag
      });

      //start title
      let titleOpenAn = wx.createAnimation({
        duration: 300,
        timingFunction: 'forwards',
        delay: 0,
        transformOrigin: '50% 50% 0'
      });
      titleOpenAn.opacity(0).step();
      this.setData({
        titleOpenAn: titleOpenAn.export()
      });
      let titleCloseAn = wx.createAnimation({
        duration: 300,
        timingFunction: 'forwards',
        delay: 0,
        transformOrigin: '50% 50% 0'
      });
      titleCloseAn.opacity(1).step();
      this.setData({
        titleCloseAn: titleCloseAn.export()
      });
      //end title
      // start 第一条line
      let line1OpenAn = wx.createAnimation({
        duration: 300,
        timingFunction: 'forwards',
        delay: 0,
        transformOrigin: '50% 50% 52%'
      });
      line1OpenAn.translateY(12).rotate(45).scale(1.4, 1).step();
      this.setData({
        line1OpenAn: line1OpenAn.export()
      });
      let line1CloseAn = wx.createAnimation({
        duration: 300,
        timingFunction: 'forwards',
        delay: 0,
        transformOrigin: '12rpx 50%'
      });
      line1CloseAn.translateY(0).rotate(0).scale(1, 1).step();
      this.setData({
        line1CloseAn: line1CloseAn.export()
      });
      //end 第一条line

      // start 第二条line
      let line2OpenAn = wx.createAnimation({
        duration: 300,
        timingFunction: 'forwards',
        delay: 0,
        transformOrigin: '100% 0'
      });
      line2OpenAn.translateY(-6.5).translateX(-1).rotate(-45).scale(1.4, 1).step();
      this.setData({
        line2OpenAn: line2OpenAn.export()
      });

      let line2CloseAn = wx.createAnimation({
        duration: 300,
        timingFunction: 'forwards',
        delay: 0,
        transformOrigin: '46rpx 50%'
      });
      line2CloseAn.translateY(0).rotate(0).scale(1, 1).step();
      this.setData({
        line2CloseAn: line2CloseAn.export()
      });
      //end 第二条line

      //start 第一个按钮
      let btn1Open = wx.createAnimation({
        duration: 300,
        timingFunction: 'forwards',
        delay: 0,
        transformOrigin: '100% 0'
      });
      btn1Open.translateX(-60).opacity(1).step();
      this.setData({
        btn1Open: btn1Open.export()
      });

      let btn1Close = wx.createAnimation({
        duration: 300,
        timingFunction: 'forwards',
        delay: 0,
        transformOrigin: '46rpx 50%'
      });
      btn1Close.translateX(0).opacity(0).step();
      this.setData({
        btn1Close: btn1Close.export()
      });
      //end 第一个按钮
      //start 第二个按钮
      let btn2Open = wx.createAnimation({
        duration: 500,
        timingFunction: 'forwards',
        delay: 0,
        transformOrigin: '100% 0'
      });
      btn2Open.translateX(-35).translateY(-45).opacity(1).step();
      this.setData({
        btn2Open: btn2Open.export()
      });

      let btn2Close = wx.createAnimation({
        duration: 500,
        timingFunction: 'forwards',
        delay: 0,
        transformOrigin: '46rpx 50%'
      });
      btn2Close.translateX(0).opacity(0).step();
      this.setData({
        btn2Close: btn2Close.export()
      });
      //end 第二个按钮
    }
  }
})
