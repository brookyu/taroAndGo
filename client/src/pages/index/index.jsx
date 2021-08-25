import { View, Image, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import Taro, { useDidShow } from '@tarojs/taro'
import styles from './index.module.less'



// import {connect } from 'react-redux'

// @connect(({common   /* 需要哪些模块都写在这里 */    }) => ({
//   accessToken: common.accessToken,   // 这里定义的值会传给页面的props
// }))    // connect必须写在class 前面(中间也可以有其他装饰器)
const Index = () => {

  // 跳转到首页
  useDidShow(()=>{
    setTimeout(()=>{
      Taro.switchTab({
        url: '/pages/createHome/index'
      })
    },1000)
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
    </View>
  )
}
 
export default Index