import { View, Image, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import Taro, { useDidShow } from '@tarojs/taro'
import styles from './index.module.less'
import dva from '../../utils/dva'

const dispatch = dva.getDispatch()
const store = dva.getStore()
const { user } = store.getState()
let {name} = user || {}



// import {connect } from 'react-redux'

// @connect(({common   /* 需要哪些模块都写在这里 */    }) => ({
//   accessToken: common.accessToken,   // 这里定义的值会传给页面的props
// }))    // connect必须写在class 前面(中间也可以有其他装饰器)

const Index = () => {

  
  // dispatch({
  //   type: 'common/saveStorageSync',
  //   payload: {
  //     accessToken: '123',
  //     isSubscribe: false,
  //   },
  //   cb: ()=>{
  //     // 执行回调函数
  //   }
  // })
  

  // 检查当前用户信息
const getUserInfo = async () => {
  // 获取当前用户信息 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
  // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  Taro.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
          console.log(res.userInfo.nickName)
          console.log(res.userInfo.avatarUrl)
          // 控制授权框
          name = res.userInfo.nickName

          // 保存到本地
          dispatch({
              type: "user/saveStorageSync",
              payload: {
                  name: res.userInfo.nickName,
                  avatar: res.userInfo.avatarUrl
              },
              cb:()=>{
                // 跳转到首页
                Taro.switchTab({url: '/pages/createHome/index'})
              }
          })

          
      }
  })
}


  // 跳转到首页
  useDidShow(()=>{
    if (name){
      setTimeout(()=>{
        Taro.switchTab({
          url: '/pages/createHome/index'
        })
      },1000)
    }
  })

  
  return (
    <View className={styles.index}>
      <View className={styles.title}>那年夏天</View>
      <Image src={require('../../assets/summer.png')} mode='widthFix'></Image>
      <View className={styles.text}>
        <View>...</View>
        <View>怀念啊我们的青春啊</View>
        <View>昨天在记忆里生根发芽</View>
        <View>爱情滋养心中那片土地</View>
        <View>绽放出美丽不舍的泪花</View>
        <View>...</View>
      </View>
      <AtModal isOpened={!name}>
        <AtModalHeader>授权请求</AtModalHeader>
        <AtModalContent>
          <View className={styles.modal}>
            <View>「梓琪 流」想要获取您的以下信息</View>
            <View>微信名称：用于游戏名称</View>
            <View>头像文件：用于游戏显示</View>
          </View>
        </AtModalContent>
        <AtModalAction> <Button onClick={getUserInfo}>确定</Button> </AtModalAction>
      </AtModal>
    </View>
  )
}
 
export default Index