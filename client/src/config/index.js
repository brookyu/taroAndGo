
// const ipaddr = 'localhost:2303'
const ipaddr = 'gflmini.zju-zry.club/ziqi.six'

const httpIpaddr = 'https://'+ipaddr
const wsIpaddr = 'wss://'+ipaddr

const appName = '梓琪流 两颗打一颗'


const shareImages = [
    'https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210825180512.png',
    'https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210825180703.png',
    'https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210825180902.png',
    'https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210825181032.png',
    'https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210825181220.png',
    'https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210825181317.png',
    'https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210825181432.png',
    'https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210825181458.png',
    'https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210825181530.png',
    'https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210825181621.png',
    'https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210825181647.png',
]
const getShareImage = () =>{
    const i = Math.floor(Math.random()*shareImages.length)
    return shareImages[i]
}

export {ipaddr,httpIpaddr,wsIpaddr,appName,shareImages,getShareImage}  