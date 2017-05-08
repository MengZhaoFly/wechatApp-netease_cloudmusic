![](https://img.shields.io/badge/language-js-orange.svg)
![](https://img.shields.io/badge/platform-wechat-lightgrey.svg)
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
补充两个常用组件
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

2. searchbar
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
不难体会到：小程序和Vue的思想还是挺接近的



