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
>[组件说明](https://mp.weixin.qq.com/debug/wxadoc/dev/component/)<br>
***.js:** 作为逻辑层 与wxml交互 有着丰富的 
网络，
媒体，
文件，
数据缓存，
位置，
设备，
界面...的api<br>
>[官方文档](https://mp.weixin.qq.com/debug/wxadoc/dev/api/)<br>
***.wxml:** 数据驱动的视图层 +  微信提供了大量的组件 表单 导航 媒体 ...

