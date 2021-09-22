import Taro from '@tarojs/taro'
import dva from './dva'

 // 检查当前用户信息
 const login = () => {
    return new Promise((resolve,reject)=>{
        const dispatch = dva.getDispatch()

        if (Taro.getEnv()==Taro.ENV_TYPE.QQ){
            // 可以通过 qq.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
            Taro.getUserInfo({
                success(res){
                    console.log(res)
                }
            })

        }else{
            // 获取当前用户信息 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
            // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
            Taro.getUserProfile({
                desc: '用于显示游戏信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                fail:()=>{
                    Taro.showToast({title:'授权失败，您可能不能使用完整的小程序功能。',icon:'none'})
                    reject(new Error())
                },
                success:res=>{
                    const payload = {
                        name: res.userInfo.nickName.replace(' ','_'),
                        avatar: res.userInfo.avatarUrl
                    }
                    dispatch({
                        type: "user/saveStorageSync",
                        payload
                    })
                    resolve(payload)
                }
            })
        }
    })
  }

  export default login