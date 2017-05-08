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
                success:function(){
                    resolve(true)
                },
                fail:function(){
                    reject(new Error('播放错误'));
                }
            })
        })
        
    }
}
module.exports = operation