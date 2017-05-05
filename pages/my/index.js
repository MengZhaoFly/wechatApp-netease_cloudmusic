//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  redirect:function(){
    console.log('点击');
    wx.navigateTo({
      url: '../index/index',
      success: function(res){
      console.log(res)
      },
      fail: function(res) {
        // fail
      console.log(res)
        
      },
      complete: function(res) {
        // complete
      console.log(res)
        
      }
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    }),
    wx.setNavigationBarTitle({
      title: '我的音乐'
    })
     
  }
})
