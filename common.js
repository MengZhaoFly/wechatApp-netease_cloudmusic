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
