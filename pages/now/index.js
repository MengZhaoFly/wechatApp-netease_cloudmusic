//index.js
//获取应用实例
// var Music = require('../../backgroundMusic.js')
// console.log('music',Music)
var app = getApp()
Page({
  data: {
    id: 436514312,
    name: "成都",
    src: "http://m2.music.126.net/7o5D4dA6271VktgawcbZFA==/18665309393829604.mp3",
    poster: "http://p1.music.126.net/34YW1QtKxJ_3YnX9ZzKhzw==/2946691234868155.jpg",
    author: "赵雷",
    isplaying: true,
    islyric: false,
    sumduration: 0,
    lyricobj:{},
    lyricArr:[],
    isadd:false,
    items: [
      {name: 'recent', value: '最近'},
      {name: 'like', value: '我的收藏'}
    ],
    percent:'100%'
  },
  addsong:function(){
    this.setData({
      percent:'0'
    })
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      percent:'100%'
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  showCircle:function(){
    this.setData({
        islyric: true,
         percent:'100%'
      })
  },
  showlyric:function(){
    this.setData({
        islyric: false,
         percent:'100%'
      })
  },
  onLoad: function () {
    console.log('正在播放 onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    }),
       wx.setNavigationBarTitle({
      title: '正在播放'
    })
  },
  onShow: function () {
    var that = this;
    console.log('正在播放 is on show')
    // 获取缓存
    wx.getStorage({
      key: 'clickdata',
      success: function (res) {
        var value = res.data
        var id =  value.id
        if (value) {
         
          // 设置到data
          that.setData({
            id:id,
            name: value.name,
            src: value.mp3Url,
            poster: value.picUrl,
            author: value.singer
            
          })
         getlyric(id,function(data, lyricArr){
           that.setData({
             lyricobj:data,
             lyricArr:lyricArr
           })
         })
          
        }
        let url = that.data.src
       
        // 播放
        wx.playBackgroundAudio({
          dataUrl: url,
          title: value.name,
          coverImgUrl: value.picUrl,
          success: function () {
             console.log('url',url)
             setTimeout(function(){
                wx.getBackgroundAudioPlayerState({
                  success: function (res) {
                    var tempduration = res.duration
                    console.log('get bg success', tempduration, res)
                    // 设置时长
                    that.setData({
                      sumduration: tempduration
                    })
                  },
                  complete: function (res) {
                    console.log(' get bg complete:', res)
                  }
                })
             },1000)
                
           
            
          },
          complete:function(){
            // 获取正在播放的信息
         
          }
        })
      }
    })
  },
  audioPlay: function () {
    //背景音乐信息

    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        var status = res.status
        var dataUrl = res.dataUrl
        var currentPosition = res.currentPosition
        var duration = res.duration
        var downloadPercent = res.downloadPercent
        wx.playBackgroundAudio({
          dataUrl: dataUrl
        })
        wx.seekBackgroundAudio({
          position: currentPosition
        })

      }
    })
    this.setData({
      isplaying: true
    })
  },
  audioPause: function () {
    wx.pauseBackgroundAudio()
    this.setData({
      isplaying: false
    })
  },
  audio14: function () {

  },
  audioStart: function () {

  },
  slider3change: function (e) {
    sliderToseek(e, function (dataUrl, cal) {
      wx.playBackgroundAudio({
        dataUrl: dataUrl
      })
      wx.seekBackgroundAudio({
        position: cal
      })
    })

  },
  prev:function(){
   prevSong(this)
  }
})
// 上一曲
function prevSong(that){
  let id = that.data.id
  console.log('id',id)
  wx.getStorage({
      key: 'searchReault',
      success: function(res) {
          console.log(res.data)
          let currentSongIndex = res.data.findIndex((item)=>{
                                return item.id == id;
          })
          console.log(currentSongIndex)
          currentSongIndex -- ;
          wx.playBackgroundAudio({
            dataUrl: res.data[currentSongIndex].mp3Url
          })
           wx.switchTab({
            url: '../now/index'
        })
          
      } 
    })
}
//滑动 歌曲快进
function sliderToseek(e, cb) {
  wx.getBackgroundAudioPlayerState({
    success: function (res) {
      var dataUrl = res.dataUrl
      var duration = res.duration
      let val = e.detail.value
      let cal = val * duration / 100
      cb && cb(dataUrl, cal);
    }
  })
}

// 获取歌词
function getlyric(id,cb) {
  console.log('id:',id)
  let url = `http://neteasemusic.leanapp.cn/lyric`
  wx.request({
    url: url,
    data: {
      id: id
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      // success
    
      if (!res.data.lrc.lyric) return false;
     
      let lyric = res.data.lrc.lyric
     
      let timearr = lyric.split('[')
      let obj = {}
      let lyricArr=[]
      // seek 为键  歌词为value
      timearr.forEach((item) => {
        let key = parseInt(item.split(']')[0].split(':')[0]) * 60 + parseInt(item.split(']')[0].split(':')[1])
        let val = item.split(']')[1]
        
        obj[key] = val
      })
      for(let key in obj){
        // obj[key] = obj[key].split('\n')[0]
        lyricArr.push(obj[key])
      }
      cb&&cb(obj,lyricArr)
    },
    fail: function (res) {
      // fail
    },
    complete: function (res) {
      // complete
    }
  })
}
