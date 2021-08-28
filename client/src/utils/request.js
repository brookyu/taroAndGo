/**
 * 请求方法封装
*/
import {httpIpaddr} from '../config'
import Taro from '@tarojs/taro'

let loading = 0



/**
 * 简易封装网络请求
 * // NOTE 需要注意 RN 不支持 *StorageSync，此处用 async/await 解决
 * @param {*} options
 */
export default async function fetch(options) {
    const {
        data,
        method = 'POST',
        showToast = true,
        showLoading = true
    } = options

    let {url} = options

    url = url.replace(/^\/v1/, httpIpaddr)

    const slp = async x => {
        return new Promise(r => {
            setTimeout(r, x)
        })
    }

    const shToast = async x => {
        if (showToast) {
            await Taro.showToast({
                icon: 'none',
                ...x
            })
            await slp(1000)
        }
    }

    if (showLoading){
        loading ++
        if (loading == 1){
            Taro.showLoading({
                title:'加载中'
            })
        }
    }

    let res = await Taro
        .request({url, method, data})
        .then(async (res) => {
            if (res.data instanceof Object) {
                const {status, data, msg} = res.data
                if (+status === 200) {
                    return data
                } else {
                    shToast({
                        title: msg || ""
                    })
                }
                return new Error()
            } else {
                const {statusCode, data} = res
                if (statusCode && statusCode != 200) {
                    shToast({title: `${data}`})
                    return new Error()
                }
            }
        })
        .catch(({errMsg}) => {
            shToast({title: `${errMsg}`})
            return new Error()
        })

    if(showLoading){
        loading --
        if (loading == 0){
            Taro.hideLoading()
        }
    }
    return res
}