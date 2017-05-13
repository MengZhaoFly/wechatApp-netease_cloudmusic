![](https://img.shields.io/badge/language-js-orange.svg)
![](https://img.shields.io/badge/platform-wechat-lightgrey.svg)
## 初窥
![](https://github.com/MengZhaoFly/wechatApp-netease_cloudmusic/blob/master/results/all.gif)<br>
todo:
- [ ] 添加音乐到收藏（最近）列表
- [ ] 歌词滚动
## 从一个hello world开始
微信开发者工具生成 目录如下：
```
.
|-- app.js
|-- app.json
|-- app.wxss
|-- pages     
|   |-- index   # 主页
|   |   |-- index.js
|   |   |-- index.json
|   |   |-- index.wxml
|   |   `-- index.wxss
|   `-- log # 日志页面
|   |   |-- log.js
|   |   |-- log.json
|   |   |-- log.wxml
|   |   `-- log.wxss
`-- utils       # 工具
    `-- util.js
```
大体为:
每一个page即是一个页面文件 ，每个页面有一个js/wxml/wxss/json文件 规定：**描述页面的这四个文件必须具有相同的路径与文件名。**<br>
全局下同路，为公共的逻辑，样式，配置<br>
与html不同:用`view text navigator` 代替 `div span a`

## 开发者文档走马观花
**app.json:** 注册pages window tabBar networkTimeout<br>
[组件说明](https://mp.weixin.qq.com/debug/wxadoc/dev/component/)<br>
***.js:** 作为逻辑层 与wxml交互 有着丰富的 
网络，
媒体，
文件，
数据缓存，
位置，
设备，
界面...的api<br>
[官方文档](https://mp.weixin.qq.com/debug/wxadoc/dev/api/)<br>
***.wxml:** 数据驱动的视图层 +  微信提供了大量的组件 表单 导航 媒体 ...
## 官方组件不够,weui来凑
weui为小程序提供了 weui.wxcss 但大多是造官方组件的轮子<br>
这里精选,也算是补充两个常用组件<br>
**对于小程序没有DOM操作 不熟悉mvvm思想的同学 是个很好的入门**
1. navbar<br>
![navbar](https://github.com/MengZhaoFly/wechatApp-netease_cloudmusic/blob/master/results/tabbar.gif)
```html
<!-- wxml -->
<view class="weui-tab">
            <view class="weui-navbar">
                <block wx:for="{{tabs}}" wx:key="*this">
                    <view id="{{index}}" class="weui-navbar__item {{activeIndex == index ? 'weui-bar__item_on' : ''}}" bindtap="tabClick">
                        <view class="weui-navbar__title">{{item}}</view>
                    </view>
                </block>
                <view class="weui-navbar__slider" style="left: {{sliderLeft}}px; transform: translateX({{sliderOffset}}px); -webkit-transform: translateX({{sliderOffset}}px);"></view>
            </view>
            <view class="weui-tab__panel">
                <view class="weui-tab__content" hidden="{{activeIndex != 0}}">选项一的内容</view>
                <view class="weui-tab__content" hidden="{{activeIndex != 1}}">选项二的内容</view>
                <view class="weui-tab__content" hidden="{{activeIndex != 2}}">选项三的内容</view>
            </view>
 </view>
       
```
block渲染data里面的四个tabs,slider为激活tab选项时候的表现，panel为内容面板
```js
//js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
    data: {
        tabs: ["选项一", "选项二", "选项三"],
        activeIndex: 1,
        sliderOffset: 0,
        sliderLeft: 0
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
});
```
了解mvvm思想的同学不难看出 通过tabs数组渲染出来选项后每次点击获取id 然后通过设置hidden显示或隐藏

2. searchbar<br>
![searchbar](https://github.com/MengZhaoFly/wechatApp-netease_cloudmusic/blob/master/results/searchbar.gif)
```html
        <view class="weui-search-bar">
            <view class="weui-search-bar__form">
                <view class="weui-search-bar__box">
                    <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
                    <input type="text" class="weui-search-bar__input" placeholder="搜索" value="{{inputVal}}" focus="{{inputShowed}}" bindinput="inputTyping" />
                    <view class="weui-icon-clear" wx:if="{{inputVal.length > 0}}" bindtap="clearInput">
                        <icon type="clear" size="14"></icon>
                    </view>
                </view>
                <label class="weui-search-bar__label" hidden="{{inputShowed}}" bindtap="showInput">
                    <icon class="weui-icon-search" type="search" size="14"></icon>
                    <view class="weui-search-bar__text">搜索</view>
                </label>
            </view>
            <view class="weui-search-bar__cancel-btn" hidden="{{!inputShowed}}" bindtap="hideInput">取消</view>
        </view>
        <view class="weui-cells searchbar-result" wx:if="{{inputVal.length > 0}}">
            <navigator url="" class="weui-cell" hover-class="weui-cell_active">
                <view class="weui-cell__bd">
                    <view>实时搜索文本</view>
                </view>
            </navigator>
        </view>
```
一个input输入框+一个搜索label+一个清楚内容的icon + 取消按钮
```js
Page({
    data: {
        inputShowed: false,
        inputVal: ""
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    }
});
```
input上面有一层label 通过Page里面状态的改变而操作其wxml状态的改变<br>
不难体会到：**小程序和Vue**的思想还是挺接近的
## 站在巨人的肩膀上为大佬们提供云音乐api
    ---获取云音乐api
>[巨人的源github项目](https://github.com/Binaryify/NeteaseCloudMusicApi)<br>

在此我将他部署到leancloud上<br>
即可在线访问，免去烦人的本地localhost启动,在线url<br>
http://neteasemusic.leanapp.cn<br>
调用例子:<br>
http://neteasemusic.leanapp.cn/search?keywords=海阔天空<br>
http://neteasemusic.leanapp.cn/lyric?id=347230<br>
![搜索结果](https://github.com/MengZhaoFly/wechatApp-netease_cloudmusic/blob/master/results/searchresult.jpg)
具体参考api<br>
>[详细文档](https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=neteasecloudmusicapi)<br>
## 一切具备 只欠东风
生成目录
```
.
|-- app.js
|-- app.json
|-- app.wxss
|-- common.js #公用js
|-- images #存放项目图片
|-- style
|   |-- weui.wxss   # 引入weui样式  万一你自己不想写css样式呢
|-- pages
|   |-- find   # 发现音乐
|   |   |-- index.js
|   |   |-- index.json
|   |   |-- index.wxml
|   |   `-- index.wxss
|   |--my   # 我的音乐
|   |   |-- index.js
|   |   |-- index.json
|   |   |-- index.wxml
|   |   `-- index.wxss
|   |--now  # 正在播放
|   |   |-- index.js
|   |   |-- index.json
|   |   |-- index.wxml
|   |   `-- index.wxss
|   |--account   # 账号
|   |   |-- index.js
|   |   |-- index.json
|   |   |-- index.wxml
|   |   `-- index.wxss
|   |-- index   # 主页
|   |   |-- index.js
|   |   |-- index.json
|   |   |-- index.wxml
|   |   `-- index.wxss
|   `-- log # 日志页面
`-- utils       # 工具
    `-- util.js
```
请先在在app.json中注册页面，设置navigation，配置tabbar<br>
```js
{
  "pages":[
    "pages/find/index",
    "pages/my/index",
    "pages/now/index",
    "pages/account/index",
    "pages/index/index"
  ],
  "window":{
    "backgroundTextStyle":"light",
    "navigationBarBackgroundColor": "#D43C33",
    "navigationBarTitleText": "网易云音乐",
    "navigationBarTextStyle":"white",
    "backgroundColor": "#FBFCFD"
  },
  "tabBar": {
    "backgroundColor":"#2A2C2E",
    "color": "#a7a7a7",
     "selectedColor": "#ffffff",
    "list": [{
      "iconPath":"./images/find.png",
      "selectedIconPath":"./images/find1.png",
      "pagePath":"pages/find/index",
      "text": "发现音乐"
    }, {
      "iconPath":"./images/my.png",
      "selectedIconPath":"./images/my1.png",
      "pagePath": "pages/my/index",
      "text": "我的音乐"
    }, {
      "iconPath":"./images/now.png",
      "selectedIconPath":"./images/now1.png",
      "pagePath": "pages/now/index",
      "text": "正在播放"
    }, {
      "iconPath":"./images/account.png",
      "selectedIconPath":"./images/account1.png",
      "pagePath": "pages/account/index",
      "text": "账号"
    }]
  }
}
```

- 发现音乐<br>
![](https://github.com/MengZhaoFly/wechatApp-netease_cloudmusic/blob/master/results/mysong.jpg)<br>
布局分为搜索框,navbar,swiper滑动，三列，以及两行三列构成<br>
tips:小程序中`flex`布局基本无兼容性问题 ，可大胆使用<br>
前三个可用上文提到的组件和小程序swiper组件快速完成，<br>
对于搜索功能<br>
我们在搜索input上绑定一个`inputTyping`事件，这样每次键入完毕都可以得到结果，然后我们直接请求api<br>

```js
    //index.js
//获取应用实例
// 个人网易云音乐 ID  66919655
var app = getApp()
Page({
    data: {
        searchReault: []
    },
    //绑定事件
    inputTyping: function (e) {
        let that = this
        console.log(e.detail)
        this.setData({
            inputVal: e.detail.value
        });
        wx.request({
            url: 'http://neteasemusic.leanapp.cn/search',
            data: {
                keywords: e.detail.value
            },
            method: 'GET',
            success: function (res) {
                let temp = []
                if(!res.data.result.songs){
                    return ;
                }
                //遍历数据
                res.data.result.songs.forEach((song, index) => {
                    temp.push({
                        id: song.id,
                        name: song.name,
                        mp3Url: song.mp3Url,
                        picUrl: song.album.picUrl,
                        singer: song.artists[0].name
                    })
                    //设置数据
                   that.setData({
                        searchReault: temp
                    })
                })
                // 存入搜索的结果进缓存
                wx.setStorage({
                    key:"searchReault",
                    data:temp
                })
            }
        })
    }
});
```
data里面的searchReault数组存入搜索结果，发起一个wx.request,用GET方式传入参数，组织好json后设置data，然后将搜索结果存入本地缓存<br>
**wxml渲染searchReault:**<br>
![](https://github.com/MengZhaoFly/wechatApp-netease_cloudmusic/blob/master/results/search.jpg)<br>
并且自定义data属性，navigator的打开方式为tab切换`open-type="switchTab"` ，绑定一个tonow事件bindtap="tonow"
```html
<block wx:for="{{searchReault}}" wx:key="item" style="overflow-y: scroll;">
    <navigator url="../now/index" class="weui-cell" hover-class="weui-cell_active"
       data-id="{{item.id}}" data-name="{{item.name}}" data-songUrl="{{item.mp3Url}}" data-picUrl="{{item.picUrl}}" 
       data-singer="{{item.singer}}"
       open-type="switchTab" bindtap="tonow">
       <view class="weui-cell__bd">
          <view class="song-name">{{item.name}}
               <text class="song-singer">{{item.singer}}</text>
            </view>
         </view>
       </navigator>
</block>
```
在tonow事件中,获取当前的歌曲
```
    tonow: function (event) {
        let songData = {
            id: event.currentTarget.dataset.id,
            name: event.currentTarget.dataset.name,
            mp3Url: event.currentTarget.dataset.songurl,
            picUrl: event.currentTarget.dataset.picurl,
            singer: event.currentTarget.dataset.singer
        }
        // 将当前点击的歌曲保存在缓存中
        wx.setStorageSync('clickdata', songData)
        wx.switchTab({
            url: '../now/index'
        })
    }
```
- 正在播放<br>
![](https://github.com/MengZhaoFly/wechatApp-netease_cloudmusic/blob/master/results/nowplay.jpg)<br>
**布局：**歌曲封面，滑动条上下为操作按钮，
封面在采用圆角,rotate,transition既可以
**滑动快进:**在滑动条上绑定事件 slider3change
```js
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
//分隔 在page中调用
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
```
一个自定义的sliderToseek函数:<br>
参数e 可以获取滑动的值，获取正在播放的音乐信息成功后执行`回调函数1->播放 回调函数2->跳到指定位置`;
**拆分歌词：**
在api中得到的歌词："[00:00.00] 作曲 : 黄家驹 [00:01.00] 作词 : 黄家驹 [00:18.580]今天我 寒夜里看雪飘过 [00:25.050]怀着冷却了的心窝漂远方 [00:30.990]风雨里追赶 "
在page外定义函数：<br>
以`]`划分数组 第二部分就是歌词内容:`item.split(']')[1]` 第一部分即为对应的时间:`item.split(']')[0]`
```js
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
```
在page中调用:传入歌曲ID(上文我们已经存入缓存，在缓存中取出即可),和将其设置在data的回调
```js
  getlyric(id,function(data, lyricArr){
           that.setData({
             lyricobj:data,
             lyricArr:lyricArr
           })
         })
  ```
  wxml进行渲染：
  ```html
    <!--歌词-->
<view class="lyric-content" hidden="{{islyric}}" style="height:401px; overflow-y: scroll;" bindtap="showCircle">
  <view class="lyric"  style="overflow-y: scroll;">
      <block wx:for="{{lyricArr}}" >

        <view> {{item}} </view>
      </block>
    </view>

</view>
```
**添加歌曲：**<br>
![](https://github.com/MengZhaoFly/wechatApp-netease_cloudmusic/blob/master/results/add.jpg)
我的可以在本地缓存中添加两个key入对应的信息<br>
like:我的喜欢<br>
recent:最近<br>

选择事件
```js
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      percent:'100%'
    })
  },
  //radio发生change事件，携带value值为： like
  //radio发生change事件，携带value值为： recent
 ```
点击添加按钮，向上呼出选项，将当前播放的歌曲设置到对应的数组即可<br>
**进行当前歌曲的播放:**
页面onshow的时候，获取本地缓存的信息，在success的回调中，设置到data,以供页面解析，而后在获取歌词的函数中也进行一次回调，设置歌词，
播放本地音乐，播放成功之后，在success的回调中，获取正在播放的音乐信息，包括该歌曲的总时长，再进行设置。
```
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
        let url = that.data.src || value.mp3Url;
        // 播放
        wx.playBackgroundAudio({
          dataUrl: value.mp3Url,
          title: value.name,
          coverImgUrl: value.picUrl,
          success: function () {
            wx.hideLoading()
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
            console.log('play',url)
         
          }
        })
      }
    })
  },
 ```
这样我们不知不觉进入多个回调嵌套的问题
## 代码优化，使用Promise,较为优雅地解决回调
**小程序暂时不支持async await**<br>
在 common.js 中为小程序提供的api上裹上一层Promise，并且通过`module.exports = operation`暴露出去<br>
```js
const operation = {
    getMusicData: function () {
        return new Promise((resolve, reject) => {
            wx.getBackgroundAudioPlayerState({
                success: function (res) {
                    resolve(res);
                },
                fail: function (err) {
                    reject(err);
                }
            })
        })
    },
    // 播放音乐 参数:url title 图片url
    playMusic: function (url, title, pic) {
        return new Promise((resolve, reject) => {
            wx.playBackgroundAudio({
                dataUrl: url,
                title: title,
                coverImgUrl: pic,
                success: function () {
                    resolve(true)
                },
                fail: function () {
                    reject(new Error('播放错误'));
                }
            })
        })
    },
    asyncGetStorage: function (key) {
        return new Promise((resolve, reject) => {
            wx.getStorage({
                key: key,
                success: function (res) {
                    resolve(res.data)
                },
                fail: function (err) {
                    reject(err)
                }
            })
        })
    },
    getlyric: function (id) {
        return new Promise((resolve, reject) => {
            console.log('id:', id)
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
                    let lyricArr = []
                    // seek 为键  歌词为value
                    timearr.forEach((item) => {
                        let key = parseInt(item.split(']')[0].split(':')[0]) * 60 + parseInt(item.split(']')[0].split(':')[1])
                        let val = item.split(']')[1]
                        obj[key] = val
                    })
                    for (let key in obj) {
                        // obj[key] = obj[key].split('\n')[0]
                        lyricArr.push(obj[key])
                    }
                    // cb && cb(obj, lyricArr)
                    resolve(lyricArr)
                },
                fail: function (err) {
                    reject(err)
                },
                complete: function (res) {
                    // complete
                }
            })
        })
    }
}
module.exports = operation
```
重写一下**当前歌曲播放事件**
```js
  onShow: function () {
    let that = this;
    Common.asyncGetStorage('clickdata')//本地缓存
      .then(data => {
        // console.log(data)
        if (!data) return;
        that.setData({
          id: data.id,
          name: data.name,
          src: data.mp3Url,
          poster: data.picUrl,
          author: data.singer
        })
        return Common.playMusic(data.mp3Url,  data.name, data.picUrl);
      })
      .then(status => {
        if(!status) return;
        wx.hideLoading();
        console.log('id,',that.data.id)
        return Common.getlyric(that.data.id)
      })
      .then((lyricArr) => {
        console.log('lyricArr',lyricArr)
        that.setData({
          lyricArr: lyricArr
        })
        return Common.getMusicData()
      })
      .then(data => {
        let tempduration = data.duration
        console.log('get bg success', tempduration, data)
        // 设置时长
        that.setData({
          sumduration: tempduration
        })
      })
  },
  ```
  这样即可缩减部分代码.
***
18届小前端求职中`['html/html5', 'css/css3', 'js/es5/es6', 'node']`
<a href="mailto:1424254461@qq.com">1424254461@qq.com</a>



