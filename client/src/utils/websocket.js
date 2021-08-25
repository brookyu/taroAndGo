import {wsIpaddr} from '../config'
import Taro from '@tarojs/taro'


const getWs = async ({url}) =>{
    url = url.replace(/^\/v1/, wsIpaddr)
    const ws =  await Taro.connectSocket({
        url,
        header:{
            'content-type': 'application/json'
        },
    })
    return ws
}

export default getWs